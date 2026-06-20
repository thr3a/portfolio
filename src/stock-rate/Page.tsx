import { Container, MantineProvider, NumberFormatter, NumberInput, Stack, Table, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useState } from 'react';
import { theme } from '../theme';

const PRESET_RATES = [0.1, 0.3, 0.5, 0.8, 1, 2, 3, 4, 5];

const calcPrice = (base: number, ratePercent: number): number => Math.round(base * (1 + ratePercent / 100) * 10) / 10;

export default function StockRatePage() {
  useDocumentTitle('株価変動率計算ツール');

  const [basePrice, setBasePrice] = useState<number | string>(1000);
  const [customRate, setCustomRate] = useState<number | string>('');

  const base = typeof basePrice === 'number' && basePrice > 0 ? basePrice : 0;
  const custom = typeof customRate === 'number' ? customRate : null;

  return (
    <MantineProvider theme={theme}>
      <Container size={'md'}>
        <Stack gap={4} py='md'>
          <Title order={2}>株価変動率計算ツール</Title>
          <Text size='sm' c='dimmed'>
            基準株価を入力すると、各変動率での株価を一覧表示します。
          </Text>
        </Stack>

        <Stack gap='xl'>
          <NumberInput
            label='基準株価（円）'
            value={basePrice}
            onChange={setBasePrice}
            min={1}
            step={1}
            allowDecimal
            decimalScale={1}
            thousandSeparator=','
          />

          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>変動率</Table.Th>
                <Table.Th c='red.7'>上昇後（円）</Table.Th>
                <Table.Th c='blue.7'>下落後（円）</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PRESET_RATES.map((rate) => (
                <Table.Tr key={rate}>
                  <Table.Td>{rate}%</Table.Td>
                  <Table.Td c='red.7'>{base > 0 ? <NumberFormatter value={calcPrice(base, rate)} thousandSeparator decimalScale={1} /> : '-'}</Table.Td>
                  <Table.Td c='blue.7'>{base > 0 ? <NumberFormatter value={calcPrice(base, -rate)} thousandSeparator decimalScale={1} /> : '-'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Stack gap='sm'>
            <Title order={4}>任意の変動率で計算</Title>
            <NumberInput
              label='変動率（%）'
              value={customRate}
              onChange={setCustomRate}
              min={0}
              step={0.1}
              allowDecimal
              decimalScale={2}
              placeholder='例: 7.5'
            />
            {custom !== null && base > 0 && (
              <Table withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>+{custom}%（上昇）</Table.Td>
                    <Table.Td c='red.7' fw='bold'>
                      <NumberFormatter value={calcPrice(base, custom)} thousandSeparator decimalScale={1} /> 円
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>-{custom}%（下落）</Table.Td>
                    <Table.Td c='blue.7' fw='bold'>
                      <NumberFormatter value={calcPrice(base, -custom)} thousandSeparator decimalScale={1} /> 円
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Stack>
      </Container>
    </MantineProvider>
  );
}
