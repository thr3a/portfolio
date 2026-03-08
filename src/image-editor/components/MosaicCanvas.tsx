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

export const MosaicCanvas = ({ ref, imageSrc, brushSize, mosaicSize, onHistoryChange }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);

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
      onHistoryChange(false);
    };
    img.src = imageSrc;
  }, [imageSrc, onHistoryChange]);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const applyMosaicAt = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !originalImageDataRef.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const origData = originalImageDataRef.current;
      const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    },
    [brushSize, mosaicSize],
  );

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    onHistoryChange(true);
  }, [onHistoryChange]);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      isDrawingRef.current = true;
      saveHistory();
      const point = getCanvasPoint(clientX, clientY);
      applyMosaicAt(point.x, point.y);
    },
    [saveHistory, getCanvasPoint, applyMosaicAt],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawingRef.current) return;
      const point = getCanvasPoint(clientX, clientY);
      applyMosaicAt(point.x, point.y);
    },
    [getCanvasPoint, applyMosaicAt],
  );

  const handleEnd = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => handleEnd();

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

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
        onHistoryChange(historyRef.current.length > 0);
      },
      reset: () => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImageDataRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.putImageData(originalImageDataRef.current, 0, 0);
        historyRef.current = [];
        onHistoryChange(false);
      },
      save: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'mosaic-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      },
    }),
    [onHistoryChange],
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    />
  );
};
