import { ReactNode } from 'react';
import { CodeBlock } from '@/components/CodeBlock';

export function parseMessageContent(content: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index);
      parts.push(
        <span key={`text-${key++}`} className="whitespace-pre-wrap">
          {textBefore}
        </span>
      );
    }

    const language = match[1] || 'code';
    const code = match[2].trim();
    parts.push(<CodeBlock key={`code-${key++}`} code={code} language={language} />);

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex);
    parts.push(
      <span key={`text-${key++}`} className="whitespace-pre-wrap">
        {textAfter}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key="text-0" className="whitespace-pre-wrap">{content}</span>];
}
