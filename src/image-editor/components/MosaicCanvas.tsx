import { useCallback, useEffect, useImperativeHandle, useRef } from 'react';

export type MosaicCanvasHandle = {
  undo: () => void;
  reset: () => void;
  save: () => void;
};

type Props = {
  ref: React.Ref<MosaicCanvasHandle>;
  imageSrc: string;
  brushSize: number;
  mosaicSize: number;
  onHistoryChange: (canUndo: boolean) => void;
};

// clientX/clientY をキャンバス論理座標に変換するユーティリティ（コンポーネント外で定義することで毎レンダリングの再生成・メモ化コストを排除）
const getCanvasPoint = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
};

export const MosaicCanvas = ({ ref, imageSrc, brushSize, mosaicSize, onHistoryChange }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  // brushSize/mosaicSize/onHistoryChange を useCallback・useEffect の依存関係にせず ref 経由で参照するため
  const brushSizeRef = useRef(brushSize);
  const mosaicSizeRef = useRef(mosaicSize);
  const onHistoryChangeRef = useRef(onHistoryChange);
  brushSizeRef.current = brushSize;
  mosaicSizeRef.current = mosaicSize;
  onHistoryChangeRef.current = onHistoryChange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current = [];
      onHistoryChangeRef.current(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const applyMosaicAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageDataRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const origData = originalImageDataRef.current;
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 表示サイズ→論理サイズのスケール係数を計算し、表示ピクセルを論理ピクセルに変換
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const brushSize = brushSizeRef.current * scaleX;
    const mosaicSize = Math.max(1, Math.round(mosaicSizeRef.current * scaleX));
    const halfBrush = brushSize / 2;

    // ブラシ円と交差するモザイクブロックを列挙
    const startBlockX = Math.floor(Math.max(0, x - halfBrush) / mosaicSize) * mosaicSize;
    const startBlockY = Math.floor(Math.max(0, y - halfBrush) / mosaicSize) * mosaicSize;
    const endBlockX = Math.min(canvas.width, x + halfBrush);
    const endBlockY = Math.min(canvas.height, y + halfBrush);

    for (let blockY = startBlockY; blockY < endBlockY; blockY += mosaicSize) {
      for (let blockX = startBlockX; blockX < endBlockX; blockX += mosaicSize) {
        const bx2 = Math.min(blockX + mosaicSize, canvas.width);
        const by2 = Math.min(blockY + mosaicSize, canvas.height);

        // ブロックとブラシ円の交差チェック（最近点で判定）
        const nearX = Math.max(blockX, Math.min(x, bx2));
        const nearY = Math.max(blockY, Math.min(y, by2));
        const dx = nearX - x;
        const dy = nearY - y;
        if (dx * dx + dy * dy > halfBrush * halfBrush) continue;

        // オリジナル画像からブロック内の平均色を算出
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;
        for (let py = blockY; py < by2; py++) {
          for (let px = blockX; px < bx2; px++) {
            const idx = (py * canvas.width + px) * 4;
            r += origData.data[idx];
            g += origData.data[idx + 1];
            b += origData.data[idx + 2];
            a += origData.data[idx + 3];
            count++;
          }
        }
        if (count === 0) continue;
        const avgR = Math.round(r / count);
        const avgG = Math.round(g / count);
        const avgB = Math.round(b / count);
        const avgA = Math.round(a / count);

        // ブロック全体を平均色で塗りつぶす
        for (let py = blockY; py < by2; py++) {
          for (let px = blockX; px < bx2; px++) {
            const idx = (py * canvas.width + px) * 4;
            currentData.data[idx] = avgR;
            currentData.data[idx + 1] = avgG;
            currentData.data[idx + 2] = avgB;
            currentData.data[idx + 3] = avgA;
          }
        }
      }
    }

    ctx.putImageData(currentData, 0, 0);
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    onHistoryChangeRef.current(true);
  }, []);

  // Pointer Events API でマウス・タッチを統一処理
  // setPointerCapture によりキャンバス外にドラッグしてもイベントが継続する
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      saveHistory();
      const point = getCanvasPoint(canvas, e.clientX, e.clientY);
      applyMosaicAt(point.x, point.y);
    },
    [saveHistory, applyMosaicAt]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!isDrawingRef.current || !canvas) return;
      const point = getCanvasPoint(canvas, e.clientX, e.clientY);
      applyMosaicAt(point.x, point.y);
    },
    [applyMosaicAt]
  );

  const handlePointerUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        const canvas = canvasRef.current;
        if (!canvas || historyRef.current.length === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const prev = historyRef.current.pop();
        if (!prev) return;
        ctx.putImageData(prev, 0, 0);
        onHistoryChangeRef.current(historyRef.current.length > 0);
      },
      reset: () => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImageDataRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.putImageData(originalImageDataRef.current, 0, 0);
        historyRef.current = [];
        onHistoryChangeRef.current(false);
      },
      save: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'mosaic-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }),
    []
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
};
