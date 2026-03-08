import { useCallback, useEffect, useImperativeHandle, useRef } from 'react';

export type MosaicCanvasHandle = {
  undo: () => void;
  reset: () => void;
  save: () => Promise<void>;
  resetZoom: () => void;
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
    y: (clientY - rect.top) * scaleY
  };
};

const pointerDist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type PinchState = {
  dist: number;
  midX: number; // clientX
  midY: number; // clientY
};

export const MosaicCanvas = ({ ref, imageSrc, brushSize, mosaicSize, onHistoryChange }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  // ズーム・パン状態（re-renderなしでimperativeに管理）
  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStateRef = useRef<PinchState | null>(null);

  const applyTransform = useCallback((s: number, tx: number, ty: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    canvas.style.transformOrigin = '0 0';
  }, []);

  const clampTranslate = useCallback((tx: number, ty: number, scale: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return { x: tx, y: ty };
    const cw = wrapper.offsetWidth;
    const ch = wrapper.offsetHeight;
    // scale >= 1 を前提に、キャンバスが常にコンテナを覆うよう制約
    return {
      x: clamp(tx, cw * (1 - scale), 0),
      y: clamp(ty, ch * (1 - scale), 0)
    };
  }, []);

  // (clientX, clientY) を中心にズームする共通処理
  // biome-ignore lint/correctness/useExhaustiveDependencies: applyTransform/clampTranslate は [] で生成済みの安定 ref のため依存不要
  const zoomAt = useCallback((clientX: number, clientY: number, scaleDelta: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const localX = clientX - wrapperRect.left;
    const localY = clientY - wrapperRect.top;

    const oldScale = scaleRef.current;
    const newScale = clamp(oldScale * scaleDelta, 1, 10);
    const actualDelta = newScale / oldScale;

    const newTx = localX - (localX - translateRef.current.x) * actualDelta;
    const newTy = localY - (localY - translateRef.current.y) * actualDelta;

    const clamped = clampTranslate(newTx, newTy, newScale);
    scaleRef.current = newScale;
    translateRef.current = clamped;
    applyTransform(newScale, clamped.x, clamped.y);
  }, []);

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

  // wheelイベントは passive: false が必要なため useEffect で直接登録
  // biome-ignore lint/correctness/useExhaustiveDependencies: zoomAt は [] で生成済みの安定 ref のため依存不要
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 0.9);
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  const applyMosaicAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageDataRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const origData = originalImageDataRef.current;
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // CSS transform(ズーム)に依存しない表示→論理スケール係数を計算
    // wrapperRef.offsetWidth はズームの影響を受けないコンテナの実幅
    const displayWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : canvas.width;
    const scaleX = canvas.width / displayWidth;
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
  // activePointersRef でアクティブポインターを追跡し、1本指=描画、2本指=ピンチズーム+パンを切り替える
  // biome-ignore lint/correctness/useExhaustiveDependencies: saveHistory/applyMosaicAt は [] で生成済みの安定 ref のため依存不要
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);

    if (activePointersRef.current.size === 1) {
      isDrawingRef.current = true;
      saveHistory();
      const point = getCanvasPoint(canvas, e.clientX, e.clientY);
      applyMosaicAt(point.x, point.y);
    } else if (activePointersRef.current.size === 2) {
      // ピンチモードに移行: 進行中の描画ストロークをキャンセル
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        const ctx = canvas.getContext('2d');
        if (ctx && historyRef.current.length > 0) {
          const prev = historyRef.current.pop();
          if (prev) {
            ctx.putImageData(prev, 0, 0);
            onHistoryChangeRef.current(historyRef.current.length > 0);
          }
        }
      }
      const [p1, p2] = [...activePointersRef.current.values()];
      pinchStateRef.current = {
        dist: pointerDist(p1, p2),
        midX: (p1.x + p2.x) / 2,
        midY: (p1.y + p2.y) / 2
      };
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: applyMosaicAt/applyTransform/clampTranslate は [] で生成済みの安定 ref のため依存不要
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const size = activePointersRef.current.size;

    if (size === 1 && isDrawingRef.current) {
      const point = getCanvasPoint(canvas, e.clientX, e.clientY);
      applyMosaicAt(point.x, point.y);
      return;
    }

    if (size >= 2) {
      const [p1, p2] = [...activePointersRef.current.values()];
      const currentDist = pointerDist(p1, p2);
      const currentMidX = (p1.x + p2.x) / 2;
      const currentMidY = (p1.y + p2.y) / 2;

      if (!pinchStateRef.current) {
        pinchStateRef.current = { dist: currentDist, midX: currentMidX, midY: currentMidY };
        return;
      }

      const { dist: prevDist, midX: prevMidX, midY: prevMidY } = pinchStateRef.current;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();

      // インクリメンタル方式: 前フレームからのスケール変化量を算出
      const oldScale = scaleRef.current;
      const newScale = clamp(oldScale * (currentDist / prevDist), 1, 10);
      const actualDelta = newScale / oldScale;

      // 現在の中点（ローカル座標）を中心にズーム
      const localMidX = currentMidX - wrapperRect.left;
      const localMidY = currentMidY - wrapperRect.top;
      let newTx = localMidX - (localMidX - translateRef.current.x) * actualDelta;
      let newTy = localMidY - (localMidY - translateRef.current.y) * actualDelta;

      // 中点の移動量をパンとして加算
      newTx += currentMidX - prevMidX;
      newTy += currentMidY - prevMidY;

      const clamped = clampTranslate(newTx, newTy, newScale);
      scaleRef.current = newScale;
      translateRef.current = clamped;
      applyTransform(newScale, clamped.x, clamped.y);

      // 今フレームの状態を次フレームの基準として保存
      pinchStateRef.current = { dist: currentDist, midX: currentMidX, midY: currentMidY };
    }
  }, []);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.delete(e.pointerId);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const size = activePointersRef.current.size;
    if (size === 0) {
      isDrawingRef.current = false;
      pinchStateRef.current = null;
    } else if (size === 1) {
      // 1本指に戻ってもピンチ状態をリセット（次のpointerdownまで描画しない）
      pinchStateRef.current = null;
    }
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
      save: async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.8);
        });
        if (!blob) return;

        const file = new File([blob], 'mosaic-image.jpg', { type: 'image/jpeg' });

        // Web Share API でファイル共有が可能かチェック（iOS Safari 15+ など）
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }

        // フォールバック：従来の <a download> 方式
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'mosaic-image.jpg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      resetZoom: () => {
        scaleRef.current = 1;
        translateRef.current = { x: 0, y: 0 };
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.style.transform = '';
        canvas.style.transformOrigin = '';
      }
    }),
    []
  );

  return (
    <div ref={wrapperRef} style={{ overflow: 'hidden', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
    </div>
  );
};
