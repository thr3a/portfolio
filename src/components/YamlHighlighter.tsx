import { Anchor, Box, type MantineTheme, Paper, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import type { JSX } from 'react';

// URLを検出し、Anchorコンポーネントでラップする関数
const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Anchor href={part} target='_blank' key={index} underline={'always'}>
          {part}
        </Anchor>
      );
    }
    return part;
  });
};

// YAMLのキーとリストのハイフンにスタイルを適用する関数
const highlightYaml = (line: string, colorScheme: 'light' | 'dark', colors: MantineTheme['colors']) => {
  const isDarkMode = colorScheme === 'dark';
  const keyColor = isDarkMode ? colors.blue[4] : colors.blue[7];
  const hyphenColor = isDarkMode ? colors.grape[4] : colors.grape[7];

  const leadingSpaceMatch = line.match(/^(\s*)/);
  const leadingSpace = leadingSpaceMatch ? leadingSpaceMatch[0] : '';
  const trimmedLine = line.trimStart();

  const content: (string | JSX.Element)[] = [];

  if (trimmedLine.startsWith('- ')) {
    // リストアイテムの場合
    content.push(
      <span style={{ color: hyphenColor }} key='hyphen'>
        -{' '}
      </span>
    );
    let restOfLine = trimmedLine.substring(2); // "- " の後

    const keyMatch = restOfLine.match(/^([\w.-]+:)(\s*)/);
    if (keyMatch) {
      // キーがある場合 (例: "- Twitter: https://...")
      content.push(
        <span style={{ color: keyColor }} key='list-key'>
          {keyMatch[1]}
        </span>
      );
      content.push(keyMatch[2]); // キーの後の空白
      restOfLine = restOfLine.substring(keyMatch[0].length);
      content.push(...linkify(restOfLine));
    } else {
      // キーがない場合 (例: "- https://...")
      content.push(...linkify(restOfLine));
    }
  } else {
    // リストアイテムではない場合
    const keyMatch = trimmedLine.match(/^([\w.-]+:)(\s*)/);
    if (keyMatch) {
      // キーがある場合 (例: "name: 山田太郎")
      content.push(
        <span style={{ color: keyColor }} key='key'>
          {keyMatch[1]}
        </span>
      );
      content.push(keyMatch[2]); // キーの後の空白
      const valuePart = trimmedLine.substring(keyMatch[0].length);
      content.push(...linkify(valuePart));
    } else {
      // キーがない場合 (単純な文字列、またはURLのみの行)
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
    <Paper
      component='pre'
      p={'md'}
      withBorder
      shadow='xs'
      ff={'monospace'}
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        margin: 0
      }}
    >
      {lines.map((line, index) => (
        <Box key={index}>{highlightYaml(line, computedColorScheme, theme.colors)}</Box>
      ))}
    </Paper>
  );
};
