import { Box, type MantineTheme, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import type React from 'react';

// YAMLのキーとリストのハイフンにスタイルを適用する関数
const highlightYaml = (line: string, colorScheme: 'light' | 'dark', colors: MantineTheme['colors']) => {
  const isDarkMode = colorScheme === 'dark';
  const keyColor = isDarkMode ? colors.blue[4] : colors.blue[7];
  const hyphenColor = isDarkMode ? colors.grape[4] : colors.grape[7];

  // キーのハイライト (例: "name:")
  if (line.match(/^\s*[\w.-]+:/)) {
    const parts = line.split(/(:.*)/);
    return (
      <>
        <span style={{ color: keyColor }}>{parts[0]}</span>
        {parts[1]}
      </>
    );
  }

  // リストのハイフンのハイライト (例: "- スカイツリー")
  if (line.match(/^\s*-\s+/)) {
    const parts = line.split(/(-.*)/);
    return (
      <>
        {parts[0]}
        <span style={{ color: hyphenColor }}>{parts[1].substring(0, parts[1].indexOf(' ') + 1)}</span>
        {parts[1].substring(parts[1].indexOf(' ') + 1)}
      </>
    );
  }

  return line;
};

export const YamlHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const lines = code.trim().split('\n');

  return (
    <Box
      p={'md'}
      component='pre'
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        margin: 0,
        fontFamily: theme.fontFamilyMonospace,
        border: '1px solid #eee'
      }}
    >
      {lines.map((line, index) => (
        <div key={index}>{highlightYaml(line, computedColorScheme, theme.colors)}</div>
      ))}
    </Box>
  );
};
