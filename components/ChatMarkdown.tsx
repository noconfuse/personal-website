import type { ReactNode } from 'react';
import Link from 'next/link';

/** 极简 Markdown 渲染：段落 / 标题 / 列表 / 加粗 / 行内代码 / 链接，够聊天用 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-b${index}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={`${keyPrefix}-c${index}`}>{token.slice(1, -1)}</code>);
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const href = linkMatch[2];
        if (href.startsWith('/')) {
          nodes.push(
            <Link key={`${keyPrefix}-l${index}`} href={href} className="chat-link">
              {linkMatch[1]} ↗
            </Link>,
          );
        } else {
          nodes.push(
            <a key={`${keyPrefix}-a${index}`} href={href} target="_blank" rel="noreferrer" className="chat-link">
              {linkMatch[1]} ↗
            </a>,
          );
        }
      }
    }
    lastIndex = match.index + token.length;
    index += 1;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export default function ChatMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={`ul-${key++}`}>
          {listBuffer.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `li-${key}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const listMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);

    if (listMatch) {
      listBuffer.push(listMatch[1]);
      continue;
    }
    flushList();

    if (!line.trim()) continue;
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(
        level === 1 ? (
          <h3 key={`h-${key++}`}>{renderInline(headingMatch[2], `h1-${key}`)}</h3>
        ) : (
          <h4 key={`h-${key++}`}>{renderInline(headingMatch[2], `h2-${key}`)}</h4>
        ),
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      blocks.push(<p className="chat-ordered" key={`p-${key++}`}>{renderInline(line.replace(/^\d+\.\s/, '· '), `p-${key}`)}</p>);
      continue;
    }
    blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>);
  }
  flushList();

  return <div className="chat-md">{blocks}</div>;
}