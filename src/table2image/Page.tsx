import { Container, Grid, MantineProvider, Stack, Text, Textarea, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useState } from 'react';
import { theme } from '../theme';
import { TablePreview } from './components/TablePreview';
import type { InputFormat, TableData } from './types';

const detectFormat = (input: string): InputFormat => {
  const firstLine = input.trim().split('\n')[0] ?? '';
  if (firstLine.includes('|')) return 'markdown';
  if (firstLine.includes('\t')) return 'tsv';
  return 'csv';
};

const parseMarkdown = (lines: string[]): TableData => {
  const dataLines = lines.filter((line) => !line.match(/^\|[\s|:-]+\|?\s*$/));
  const parseLine = (line: string) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
  const [header, ...rest] = dataLines;
  return {
    headers: parseLine(header ?? ''),
    rows: rest.map(parseLine)
  };
};

const parseSeparated = (lines: string[], sep: string): TableData => {
  const [header, ...rest] = lines;
  return {
    headers: (header ?? '').split(sep).map((s) => s.trim()),
    rows: rest.map((line) => line.split(sep).map((s) => s.trim()))
  };
};

const parseInput = (input: string): TableData => {
  const trimmed = input.trim();
  if (!trimmed) return { headers: [], rows: [] };
  const lines = trimmed.split('\n');
  const format = detectFormat(trimmed);
  if (format === 'markdown') return parseMarkdown(lines);
  if (format === 'tsv') return parseSeparated(lines, '\t');
  return parseSeparated(lines, ',');
};

const FORMAT_LABEL: Record<InputFormat, string> = {
  csv: 'CSV',
  tsv: 'TSV',
  markdown: 'Markdown'
};

export default function Table2ImagePage() {
  useDocumentTitle('テーブル画像変換くん');

  const [input, setInput] = useState('商品名,数量,単価（円）\n牛乳,2,198\n食パン,1,158\nバナナ,3,98');

  const tableData = parseInput(input);
  const format = input.trim() ? detectFormat(input) : null;

  return (
    <MantineProvider theme={theme}>
      <Container size='xl' py='xl'>
        <Stack gap={4} py='md'>
          <Title order={2}>テーブル画像変換くん</Title>
          <Text size='sm' c='dimmed'>
            CSV / TSV / Markdown テーブルを貼り付けると PNG 画像に変換します
          </Text>
        </Stack>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap='xs'>
              <Text size='sm' fw='bold'>
                入力
                {format && (
                  <Text component='span' size='xs' c='blue' ml='xs'>
                    ({FORMAT_LABEL[format]} として解釈中)
                  </Text>
                )}
              </Text>
              <Textarea
                autosize
                minRows={12}
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                styles={{ input: { fontFamily: 'monospace' } }}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap='xs'>
              <Text size='sm' fw='bold'>
                プレビュー
              </Text>
              <TablePreview data={tableData} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </MantineProvider>
  );
}
