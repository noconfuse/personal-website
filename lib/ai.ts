import { getItem, getItems } from '@/lib/content';
import { siteConfig } from '@/config/site';

export type ToolCallSpec = { id: string; type: 'function'; function: { name: string; arguments: string } };
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCallSpec[];
  tool_call_id?: string;
};

export type ToolDefinition = {
  type: 'function';
  function: { name: string; description: string; parameters: Record<string, unknown> };
};

function profileBlock(): string {
  const person = siteConfig.person;
  const interview = siteConfig.aboutInterview;
  return [
    `## 关于 ${person.name} 的基本信息`,
    `- 身份：${person.role}，坐标 ${person.location}`,
    `- 邮箱：${person.email}`,
    `- 简介：${person.intro}`,
    `- 关于自己：${person.aboutLead} ${person.aboutDetail}`,
    `- 基本事实：${person.facts.map(([label, value]) => `${label}=${value}`).join('；')}`,
    `- 社交：${siteConfig.social.filter((s) => s.href).map((s) => `${s.label} ${s.href}`).join('；')}`,
    '',
    `## ${person.name} 的自述访谈（他的真实观点，引用时保持第一人称）`,
    ...interview.questions.map((qa) => `问：${qa.question}\n答：${qa.answer}\n（他信奉的原则：${qa.principle}）`),
    '',
    `## 他的技能盘点`,
    ...interview.skills.map((skill) => `- ${skill.name}：${skill.detail}`),
    '',
    `## 他提供的服务（别人想合作时可以介绍）`,
    ...interview.services.map((service) => `- ${service.name}：${service.detail}（关键词：${service.tags.join('、')}）`),
    `合作流程：${interview.process.join(' → ')}`,
  ].join('\n');
}

function indexBlock(): string {
  const projects = getItems('project');
  const posts = getItems('post');
  const projectLines = projects.map((item) => `- [项目] ${item.title}（slug: ${item.slug}）· ${item.date} · 标签：${item.tags.join('、')} · ${item.description}`);
  const postLines = posts.map((item) => `- [文章] ${item.title}（slug: ${item.slug}）· ${item.date} · 标签：${item.tags.join('、')} · ${item.description}`);
  return [
    '## 作品目录（只有索引，正文细节请用工具获取）',
    ...projectLines,
    '',
    '## 文章目录（只有索引，正文细节请用工具获取）',
    ...postLines,
  ].join('\n');
}

let cachedPrompt: string | null = null;

export function getSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt;
  cachedPrompt = [
    siteConfig.ai.soul,
    '',
    '===== 以下是你的养分 =====',
    '',
    profileBlock(),
    '',
    indexBlock(),
    '',
    '## 工具使用原则',
    '- 上面只有目录：标题、简介、slug。当问题需要某个项目或文章的正文细节（怎么做的、技术实现、原文观点）时，调用对应工具把全文取出来再回答。',
    '- 闲聊、问候、概念性讨论、访谈里已经覆盖的观点——直接回答，不要调用工具。',
    '- 一次回答最多调用 2 次工具，别把时间花在翻资料上。',
    '',
    '## 链接规则（重要）',
    '- 提到本站的项目或文章时，用 Markdown 链接指向站内详情页：项目用 `/projects/<slug>`，文章用 `/posts/<slug>`，slug 来自上面的目录。如：[命网 FateMesh](/projects/fatemesh)。',
    '- 提到项目线上地址时用完整链接（如 deerblock.top 的实际 URL）。一行里别堆太多链接，自然就好。',
    '- 只链接真实存在的 slug，绝不编造链接。',
    '===== 养分结束 =====',
  ].join('\n');
  return cachedPrompt;
}

export const toolDefinitions: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_project_detail',
      description: '获取某个作品/项目的完整详细介绍（正文 Markdown，含技术实现、功能、上线情况）',
      parameters: {
        type: 'object',
        properties: { slug: { type: 'string', description: '项目 slug，来自作品目录' } },
        required: ['slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_post_detail',
      description: '获取某篇文章的完整正文（Markdown）',
      parameters: {
        type: 'object',
        properties: { slug: { type: 'string', description: '文章 slug，来自文章目录' } },
        required: ['slug'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_content',
      description: '按关键词搜索全部项目与文章，返回匹配条目的标题、简介与原文摘录。当目录信息不够、不确定内容在哪篇文章/项目里时使用',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string', description: '搜索关键词，如「限流」「3D」「定价」' } },
        required: ['query'],
      },
    },
  },
];

/** 执行工具调用，返回给模型的结果文本 */
export function executeTool(name: string, argsJson: string): string {
  let args: { slug?: string; query?: string };
  try {
    args = JSON.parse(argsJson || '{}');
  } catch {
    return '错误：参数不是合法 JSON';
  }

  if (name === 'get_project_detail') {
    const slug = String(args.slug ?? '');
    const item = getItem('project', slug);
    if (!item) {
      const known = getItems('project').map((p) => p.slug).join('、');
      return `未找到 slug 为「${slug}」的项目。可用的 slug：${known}`;
    }
    return [`# ${item.title}`, `简介：${item.description}`, `标签：${item.tags.join('、')} · 日期：${item.date}`, item.link ? `在线地址：${item.link}` : '', '', String(item.content).slice(0, 8000)].filter(Boolean).join('\n');
  }

  if (name === 'get_post_detail') {
    const slug = String(args.slug ?? '');
    const item = getItem('post', slug);
    if (!item) {
      const known = getItems('post').map((p) => p.slug).join('、');
      return `未找到 slug 为「${slug}」的文章。可用的 slug：${known}`;
    }
    return [`# ${item.title}`, `简介：${item.description}`, `标签：${item.tags.join('、')} · 日期：${item.date}`, '', String(item.content).slice(0, 6000)].join('\n');
  }

  if (name === 'search_content') {
    const query = String(args.query ?? '').trim();
    if (!query) return '错误：请提供 query 关键词';
    const entries = [
      ...getItems('project').map((item) => ({ kind: '项目', slug: item.slug, title: item.title, description: item.description })),
      ...getItems('post').map((item) => ({ kind: '文章', slug: item.slug, title: item.title, description: item.description })),
    ];
    const hits = [];
    for (const entry of entries) {
      const body = getItem(entry.kind === '项目' ? 'project' : 'post', entry.slug)?.content ?? '';
      const bodyIndex = body.indexOf(query);
      if (bodyIndex >= 0) {
        const start = Math.max(0, bodyIndex - 100);
        hits.push(`[${entry.kind}·${entry.slug}] ${entry.title}\n简介：${entry.description}\n摘录：…${body.slice(start, bodyIndex + 240).trim()}…`);
      } else if (`${entry.title} ${entry.description}`.includes(query)) {
        hits.push(`[${entry.kind}·${entry.slug}] ${entry.title}\n简介：${entry.description}\n（关键词命中标题/简介，可用 get_${entry.kind === '项目' ? 'project' : 'post'}_detail 看全文）`);
      }
      if (hits.length >= 5) break;
    }
    return hits.length ? hits.join('\n\n') : `没有找到与「${query}」相关的内容`;
  }

  return `未知工具：${name}`;
}