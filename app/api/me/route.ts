import { NextRequest } from 'next/server';
import { executeTool, getSystemPrompt, toolDefinitions, type ChatMessage } from '@/lib/ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';
const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 1500;
const MAX_TOTAL_CHARS = 12000;
/** 防止模型无限连环调工具 */
const MAX_TOOL_ROUNDS = 3;

/** 限流：IP 维度，每分钟 6 次、每天 60 次 */
const rateBuckets = new Map<string, { minute: number; minuteCount: number; day: number; dayCount: number }>();
const MINUTE_LIMIT = 6;
const DAY_LIMIT = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const minute = Math.floor(now / 60_000);
  const day = Math.floor(now / DAY_MS);
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.minute !== minute || bucket.day !== day) {
    const carryDayCount = bucket?.day === day ? bucket.dayCount : 0;
    rateBuckets.set(ip, { minute, minuteCount: 1, day, dayCount: carryDayCount + 1 });
    if (rateBuckets.size > 1000) {
      rateBuckets.forEach((value, key) => {
        if (value.minute < minute - 2 && value.day < day) rateBuckets.delete(key);
      });
    }
    return rateBuckets.get(ip)!.dayCount > DAY_LIMIT;
  }

  bucket.minuteCount += 1;
  bucket.dayCount += 1;
  return bucket.minuteCount > MINUTE_LIMIT || bucket.dayCount > DAY_LIMIT;
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get('host') ?? request.headers.get('x-forwarded-host') ?? '';
    if (originHost === requestHost) return true;
    const allowed = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    return allowed.includes(originHost);
  } catch {
    return false;
  }
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((msg): msg is ChatMessage => {
      if (!msg || typeof msg !== 'object') return false;
      const role = (msg as ChatMessage).role;
      const content = (msg as ChatMessage).content;
      return (role === 'user' || role === 'assistant') && typeof content === 'string';
    })
    .slice(-MAX_HISTORY)
    .map((msg) => ({ role: msg.role, content: msg.content.slice(0, MAX_MESSAGE_CHARS) }));
}

function deepseekBody(messages: ChatMessage[], stream: boolean) {
  return JSON.stringify({ model: MODEL, messages, stream, temperature: 0.85, max_tokens: 1200, tools: toolDefinitions });
}

async function upstreamChat(messages: ChatMessage[], stream: boolean) {
  return fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: deepseekBody(messages, stream),
  });
}

export async function POST(request: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: '服务端未配置 DEEPSEEK_API_KEY 环境变量' }, { status: 500 });
  }

  if (!sameOrigin(request)) {
    return Response.json({ error: '来源不被允许' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (rateLimited(ip)) {
    return Response.json({ error: '今天聊得够多啦，让我歇会儿——明天再来找我。' }, { status: 429 });
  }

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '请求格式错误' }, { status: 400 });
  }

  const history = sanitizeMessages(body.messages);
  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return Response.json({ error: '缺少有效的对话内容' }, { status: 400 });
  }

  const totalChars = history.reduce((sum, msg) => sum + msg.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return Response.json({ error: '这次对话太长了，开个新对话继续聊吧。' }, { status: 413 });
  }

  const locale = body.locale === 'en' ? 'en' : 'zh';
  const messages: ChatMessage[] = [{ role: 'system', content: getSystemPrompt(locale) }, ...history];

  try {
    // 第一轮：非流式，判断是否需要工具调用
    let round = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await upstreamChat(messages, false);
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        console.error('DeepSeek error:', response.status, detail.slice(0, 300));
        return Response.json({ error: '我这个「我」暂时断线了，稍后再试试。' }, { status: 502 });
      }
      const completion = await response.json();
      const choice = completion.choices?.[0]?.message;
      const toolCalls = choice?.tool_calls as ChatMessage['tool_calls'] | undefined;

      if (!toolCalls?.length || round >= MAX_TOOL_ROUNDS) {
        // 不需要工具：把模型答案直接推给流式阶段重放，保证前端拿到统一的流式体验
        if (choice?.content) {
          const replay = await upstreamChat(messages, true);
          if (replay.ok && replay.body) {
            return new Response(replay.body, {
              headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' },
            });
          }
        }
        return Response.json({ error: '我这个「我」暂时走神了，再问一次？' }, { status: 502 });
      }

      // 需要工具：执行并把结果拼回对话，进入下一轮
      round += 1;
      messages.push({ role: 'assistant', content: choice?.content ?? '', tool_calls: toolCalls });
      for (const call of toolCalls) {
        const result = executeTool(call.function.name, call.function.arguments, locale);
        messages.push({ role: 'tool', content: result, tool_call_id: call.id });
      }
    }
  } catch (error) {
    console.error('Chat proxy failed:', error);
    return Response.json({ error: '网络异常，稍后再试。' }, { status: 502 });
  }
}