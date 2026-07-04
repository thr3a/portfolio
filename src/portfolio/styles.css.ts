import { style } from '@vanilla-extract/css';
import { COLORS } from './theme';

// ページ全体の背景: 朱の縦罫線 + 生成り紙色
export const page = style({
  minHeight: '100vh',
  background: `linear-gradient(90deg, ${COLORS.shuFaint} 0, ${COLORS.shuFaint} 1px, transparent 1px, transparent 100%), #f3f1ec`,
  backgroundSize: '24px 24px'
});

// アイコン画像: 黒枠 + 朱のズレ影
export const iconFrame = style({
  border: `2px solid ${COLORS.ink}`,
  boxShadow: `8px 8px 0 ${COLORS.shu}`,
  lineHeight: 0,
  flexShrink: 0
});

// 作品カード: hoverで朱枠 + ズレ影
export const card = style({
  display: 'block',
  height: '100%',
  border: `1px solid ${COLORS.line}`,
  backgroundColor: '#ffffff',
  transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
  ':hover': {
    borderColor: COLORS.shu,
    transform: 'translate(-2px, -2px)',
    boxShadow: `4px 4px 0 ${COLORS.shu}`
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none'
    }
  }
});
