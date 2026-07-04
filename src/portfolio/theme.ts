import { createTheme } from '@mantine/core';

// 白・墨・朱の3色だけで構成するカラートークン
export const COLORS = {
  shu: '#e60012',
  shuFaint: 'rgba(230, 0, 18, 0.08)',
  ink: '#1a1a1a',
  line: '#d9d9d9',
  paleGray: '#f6f6f6'
} as const;

export const theme = createTheme({
  scale: 1,
  defaultRadius: 0,
  black: COLORS.ink,
  fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
  fontFamilyMonospace: 'ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Consolas, Menlo, monospace'
});
