export const BRUSH_SIZES = [
  { label: '小', value: 20 },
  { label: '中', value: 40 },
  { label: '大', value: 60 }
] as const;

export type BrushSize = (typeof BRUSH_SIZES)[number]['value'];

export const MOSAIC_SIZES = [
  { label: '細かい', value: 4 },
  { label: '普通', value: 8 },
  { label: '粗い', value: 16 }
] as const;

export type MosaicSize = (typeof MOSAIC_SIZES)[number]['value'];
