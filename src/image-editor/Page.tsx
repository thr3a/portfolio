import {
  Box,
  Button,
  Container,
  FileButton,
  MantineProvider,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconArrowBackUp, IconDeviceFloppy, IconPhoto, IconTrash, IconZoomReset } from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { theme } from '../theme';
import { MosaicCanvas, type MosaicCanvasHandle } from './components/MosaicCanvas';
import { BRUSH_SIZES, type BrushSize, MOSAIC_SIZES, type MosaicSize } from './types';

export default function ImageEditorPage() {
  useDocumentTitle('モザイクエディター');

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<BrushSize>(40);
  const [mosaicSize, setMosaicSize] = useState<MosaicSize>(8);
  const [canUndo, setCanUndo] = useState(false);
  const canvasRef = useRef<MosaicCanvasHandle>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setImageSrc(result);
        setCanUndo(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Container size={'md'}>
        <Stack gap={4} py='md'>
          <Title order={2}>モザイクエディター</Title>
          <Text size='sm' c='dimmed'>
            画像のなぞったところにモザイクをかけます。
          </Text>
        </Stack>

        <Stack gap='sm' style={{ flex: 1, width: '100%' }}>
          <Title order={2}></Title>

          {/* 画像選択 */}
          <FileButton onChange={handleFileChange} accept='image/*'>
            {(props) => (
              <Button {...props} leftSection={<IconPhoto size={18} />} variant='outline' fullWidth>
                画像を選択
              </Button>
            )}
          </FileButton>

          {/* キャンバス */}
          {imageSrc ? (
            <Box bd='1px solid var(--mantine-color-gray-3)' style={{ overflow: 'hidden' }}>
              <MosaicCanvas
                ref={canvasRef}
                imageSrc={imageSrc}
                brushSize={brushSize}
                mosaicSize={mosaicSize}
                onHistoryChange={setCanUndo}
              />
            </Box>
          ) : (
            <Box
              h={200}
              bd='2px dashed var(--mantine-color-gray-4)'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text c='dimmed' size='sm'>
                画像を選択してください
              </Text>
            </Box>
          )}

          {/* ツール設定 */}
          <Stack gap='xs'>
            <Text size='xs' c='dimmed' fw='bold'>
              モザイクの粗さ
            </Text>
            <SegmentedControl
              value={String(mosaicSize)}
              onChange={(v) => {
                const found = MOSAIC_SIZES.find((s) => String(s.value) === v);
                if (found) setMosaicSize(found.value);
              }}
              data={MOSAIC_SIZES.map((s) => ({ label: s.label, value: String(s.value) }))}
              fullWidth
              size='xs'
            />
            <Text size='xs' c='dimmed' fw='bold'>
              ブラシサイズ
            </Text>
            <SegmentedControl
              value={String(brushSize)}
              onChange={(v) => {
                const found = BRUSH_SIZES.find((s) => String(s.value) === v);
                if (found) setBrushSize(found.value);
              }}
              data={BRUSH_SIZES.map((s) => ({ label: s.label, value: String(s.value) }))}
              fullWidth
              size='xs'
            />
          </Stack>

          {/* アクションボタン */}
          <SimpleGrid cols={{ base: 1, sm: 4 }}>
            <Button
              variant='default'
              leftSection={<IconArrowBackUp size={16} />}
              onClick={() => canvasRef.current?.undo()}
              disabled={!canUndo}
              size='sm'
            >
              1つ戻す
            </Button>
            <Button
              variant='default'
              leftSection={<IconTrash size={16} />}
              onClick={() => canvasRef.current?.reset()}
              disabled={!imageSrc}
              size='sm'
            >
              変更リセット
            </Button>
            <Button
              variant='default'
              leftSection={<IconZoomReset size={16} />}
              onClick={() => canvasRef.current?.resetZoom()}
              disabled={!imageSrc}
              size='sm'
            >
              ズームリセット
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={() => canvasRef.current?.save()}
              disabled={!imageSrc}
              size='sm'
            >
              保存
            </Button>
          </SimpleGrid>
        </Stack>
      </Container>
    </MantineProvider>
  );
}
