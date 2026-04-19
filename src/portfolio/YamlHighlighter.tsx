import { Anchor, Box, type MantineTheme, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import type { JSX } from 'react';

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
      <Anchor href={match[2]} target='_blank' key={match.index} underline='always'>
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

// YAMLのキーとリストのハイフンにスタイルを適用する関数
const highlightYaml = (line: string, colorScheme: 'light' | 'dark', colors: MantineTheme['colors']) => {
  const isDarkMode = colorScheme === 'dark';
  const keyColor = isDarkMode ? colors.green[4] : colors.green[7];
  const hyphenColor = isDarkMode ? colors.grape[4] : colors.grape[7];

  const leadingSpace = line.match(/^(\s*)/)?.[0] ?? '';
  const trimmedLine = line.trimStart();

  const content: (string | JSX.Element)[] = [];

  if (trimmedLine.startsWith('- ')) {
    content.push(
      <span style={{ color: hyphenColor }} key='hyphen'>
        -{' '}
      </span>
    );
    let restOfLine = trimmedLine.substring(2);

    const keyMatch = restOfLine.match(/^([\w.-]+:)(\s*)/);
    if (keyMatch) {
      content.push(
        <span style={{ color: keyColor }} key='list-key'>
          {keyMatch[1]}
        </span>
      );
      content.push(keyMatch[2]);
      restOfLine = restOfLine.substring(keyMatch[0].length);
      content.push(...linkify(restOfLine));
    } else {
      content.push(...linkify(restOfLine));
    }
  } else {
    const keyMatch = trimmedLine.match(/^([\w.-]+:)(\s*)/);
    if (keyMatch) {
      content.push(
        <span style={{ color: keyColor }} key='key'>
          {keyMatch[1]}
        </span>
      );
      content.push(keyMatch[2]);
      const valuePart = trimmedLine.substring(keyMatch[0].length);
      content.push(...linkify(valuePart));
    } else {
      content.push(...linkify(trimmedLine));
    }
  }

  return (
    <>
      {leadingSpace}
      {content}
    </>
  );
};

export const YamlHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const lines = code.trim().split('\n');

  return (
    <Box component='pre' ff='monospace' lh={1.8} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
      {lines.map((line, index) => (
        <span key={index}>
          {highlightYaml(line, computedColorScheme, theme.colors)}
          {index < lines.length - 1 ? '\n' : ''}
        </span>
      ))}
    </Box>
  );
};
