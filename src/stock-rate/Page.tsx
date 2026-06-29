import { Container, MantineProvider, NumberFormatter, NumberInput, Stack, Table, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useState } from 'react';
import { theme } from '../theme';

const PRESET_RATES = [0.1, 0.3, 0.5, 0.8, 1, 2, 3, 4, 5, 8, 10, 20];

const calcPrice = (base: number, ratePercent: number): number => Math.round(base * (1 + ratePercent / 100) * 10) / 10;
const calcDiff = (base: number, ratePercent: number): number => Math.round(base * (ratePercent / 100) * 10) / 10;

export default function StockRatePage() {
  useDocumentTitle('株価変動率計算ツール');

  const [basePrice, setBasePrice] = useState<number | string>('');
  const [customRate, setCustomRate] = useState<number | string>('');
  const [targetPrice, setTargetPrice] = useState<number | string>('');
  // PC はホバー、スマホはタップでアクティブにする行の変動率
  const [activeRate, setActiveRate] = useState<number | null>(null);

  const base = typeof basePrice === 'number' && basePrice > 0 ? basePrice : 0;
  const custom = typeof customRate === 'number' ? customRate : null;
  const target = typeof targetPrice === 'number' && targetPrice > 0 ? targetPrice : null;
  const requiredRate = target !== null && base > 0 ? Math.round(((target - base) / base) * 100 * 100) / 100 : null;

  return (
    <MantineProvider theme={theme}>
      <Container mb={'lg'} maw={500}>
        <Stack gap={4} py='md'>
          <Title order={2}>株価変動率計算ツール</Title>
          <Text size='sm' c='dimmed'>
            基準株価を入力すると、各変動率での株価を一覧表示します。
          </Text>
        </Stack>

        <Stack gap='xl'>
          <NumberInput
            label='基準株価'
            value={basePrice}
            onChange={setBasePrice}
            min={1}
            step={1}
            allowDecimal
            decimalScale={1}
            thousandSeparator=','
          />

          <Table withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th c='red.7'>📈 上昇</Table.Th>
                <Table.Th>変動率</Table.Th>
                <Table.Th c='blue.7'>📉 下落</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PRESET_RATES.map((rate) => (
                <Table.Tr
                  key={rate}
                  bg={activeRate === rate ? 'gray.1' : undefined}
                  fw={activeRate === rate ? 'bold' : undefined}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveRate(rate)}
                  onMouseLeave={() => setActiveRate(null)}
                  onClick={() => setActiveRate(rate)}
                >
                  <Table.Td c='red.7'>
                    {base > 0 ? (
                      <Stack gap={0}>
                        <NumberFormatter value={calcPrice(base, rate)} thousandSeparator decimalScale={1} />
                        <Text size='xs' c='red.4'>
                          +
                          <NumberFormatter
                            value={calcDiff(base, rate)}
                            thousandSeparator
                            decimalScale={1}
                            suffix=' 円'
                          />
                        </Text>
                      </Stack>
                    ) : (
                      '-'
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text fw={activeRate === rate ? 'bold' : undefined}>{rate}%</Text>
                  </Table.Td>
                  <Table.Td c='blue.7'>
                    {base > 0 ? (
                      <Stack gap={0}>
                        <NumberFormatter value={calcPrice(base, -rate)} thousandSeparator decimalScale={1} />
                        <Text size='xs' c='blue.4'>
                          -
                          <NumberFormatter
                            value={calcDiff(base, rate)}
                            thousandSeparator
                            decimalScale={1}
                            suffix=' 円'
                          />
                        </Text>
                      </Stack>
                    ) : (
                      '-'
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Stack gap='sm'>
            <Title order={4}>目標株価からの変動率計算</Title>
            <NumberInput
              label='目標株価'
              value={targetPrice}
              onChange={setTargetPrice}
              min={1}
              step={1}
              allowDecimal
              decimalScale={1}
              thousandSeparator=','
              placeholder='例: 1500'
            />
            {requiredRate !== null && base > 0 && (
              <Table withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      基準 <NumberFormatter value={base} thousandSeparator /> 円 →{' '}
                      <NumberFormatter value={target ?? 0} thousandSeparator decimalScale={1} /> 円
                    </Table.Td>
                    <Table.Td c={requiredRate >= 0 ? 'red.7' : 'blue.7'}>
                      <Stack gap={0}>
                        <Text>
                          {requiredRate >= 0 ? '+' : ''}
                          {requiredRate}%
                        </Text>
                        <Text size='xs' c={requiredRate >= 0 ? 'red.4' : 'blue.4'}>
                          {requiredRate >= 0 ? '+' : ''}
                          <NumberFormatter
                            value={Math.round(((target ?? 0) - base) * 10) / 10}
                            thousandSeparator
                            decimalScale={1}
                          />{' '}
                          円
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            )}
          </Stack>

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
                      <Stack gap={0}>
                        <Text fw='bold'>
                          <NumberFormatter value={calcPrice(base, custom)} thousandSeparator decimalScale={1} /> 円
                        </Text>
                        <Text size='xs' c='red.4'>
                          +<NumberFormatter value={calcDiff(base, custom)} thousandSeparator decimalScale={1} /> 円
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>-{custom}%（下落）</Table.Td>
                    <Table.Td c='blue.7' fw='bold'>
                      <Stack gap={0}>
                        <Text fw='bold'>
                          <NumberFormatter value={calcPrice(base, -custom)} thousandSeparator decimalScale={1} /> 円
                        </Text>
                        <Text size='xs' c='blue.4'>
                          -<NumberFormatter value={calcDiff(base, custom)} thousandSeparator decimalScale={1} /> 円
                        </Text>
                      </Stack>
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
