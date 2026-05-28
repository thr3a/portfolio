import { ActionIcon, Box, Button, Group, Table, Text } from '@mantine/core';
import { IconCopy, IconDownload } from '@tabler/icons-react';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import type { TableData } from '../types';

type Props = {
  data: TableData;
};

export const TablePreview = ({ data }: Props) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!tableRef.current) return;
    const dataUrl = await toPng(tableRef.current, { pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'table.png';
    a.click();
  };

  const handleCopyToClipboard = async () => {
    if (!tableRef.current) return;
    const dataUrl = await toPng(tableRef.current, { pixelRatio: 2 });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  };

  if (data.headers.length === 0) {
    return (
      <Box p='xl' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Text c='dimmed' size='sm'>
          左のテキストエリアに CSV / TSV / Markdown を貼り付けると、ここにプレビューが表示されます
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box ref={tableRef} bg='white' p='0' style={{ display: 'inline-block' }}>
        <Table withTableBorder withColumnBorders withRowBorders striped>
          <Table.Thead>
            <Table.Tr>
              {data.headers.map((h, i) => (
                <Table.Th key={i}>{h}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.rows.map((row, ri) => (
              <Table.Tr key={ri}>
                {row.map((cell, ci) => (
                  <Table.Td key={ci}>{cell}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      <Group mb='sm'>
        <Button leftSection={<IconDownload size={16} />} size='sm' onClick={handleDownload}>
          画像ダウンロード
        </Button>
        <ActionIcon variant='default' size='lg' title='クリップボードにコピー' onClick={handleCopyToClipboard}>
          <IconCopy size={16} />
        </ActionIcon>
      </Group>
    </Box>
  );
};
