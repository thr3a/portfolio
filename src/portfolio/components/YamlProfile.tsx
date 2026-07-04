import { Anchor, Box } from '@mantine/core';
import type { JSX } from 'react';
import { COLORS } from '../theme';

const yaml = /* yaml */ `
name: あまねきー
region: ap-northeast-1
favorites:
  languages:
    - Ruby
    - TypeScript
  animal: 猫
  game: スプラトゥーン
  foods:
    - お寿司
    - 甘いもの全般
hobbies:
  - 西洋絵画
  - LLM
links:
  - Twitter: [@amanekey](https://x.com/amanekey)
  - Blog: [blog.turai.work](https://blog.turai.work/)
  - GitHub: [@thr3a](https://github.com/thr3a)
`;

// [text](url) 形式のmarkdownリンクをAnchorコンポーネントに変換する
const linkify = (text: string): (string | JSX.Element)[] => {
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(markdownLinkRegex)) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Anchor href={match[2]} target='_blank' key={match.index} underline='always' c={COLORS.shu} ff='monospace'>
        {match[1]}
      </Anchor>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

// YAMLのキーを朱、ハイフンをグレーでハイライトする
const highlightLine = (line: string) => {
  const leadingSpace = line.match(/^(\s*)/)?.[0] ?? '';
  const trimmedLine = line.trimStart();
  const content: (string | JSX.Element)[] = [];

  let rest = trimmedLine;

  if (rest.startsWith('- ')) {
    content.push(
      <span style={{ color: '#909090' }} key='hyphen'>
        -{' '}
      </span>
    );
    rest = rest.substring(2);
  }

  const keyMatch = rest.match(/^([\w.-]+:)(\s*)/);
  if (keyMatch) {
    content.push(
      <span style={{ color: COLORS.shu }} key='key'>
        {keyMatch[1]}
      </span>
    );
    content.push(keyMatch[2]);
    rest = rest.substring(keyMatch[0].length);
  }

  content.push(...linkify(rest));

  return (
    <>
      {leadingSpace}
      {content}
    </>
  );
};

// エディタのファイルタブ風フレームに包んだYAMLプロフィール
export const YamlProfile = () => {
  const lines = yaml.trim().split('\n');

  return (
    <Box bd={`1px solid ${COLORS.ink}`} bg={'white'}>
      <Box
        component='pre'
        p='md'
        m={0}
        ff='monospace'
        fz='sm'
        lh={1.9}
        c={COLORS.ink}
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      >
        {lines.map((line, index) => (
          <span key={index}>
            {highlightLine(line)}
            {index < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </Box>
    </Box>
  );
};
