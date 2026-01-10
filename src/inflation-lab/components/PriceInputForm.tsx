import { Box, Button, Group, NumberInput, Paper, Select, Stack, Text } from '@mantine/core';

const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

type PriceInputFormProps = {
  pastYear: number | null;
  setPastYear: (year: number | null) => void;
  currentYear: number | null;
  setCurrentYear: (year: number | null) => void;
  pastPrice: number | null;
  setPastPrice: (price: number | null) => void;
  currentPrice: number | null;
  setCurrentPrice: (price: number | null) => void;
  onCalculate: () => void;
};

export function PriceInputForm({
  pastYear,
  setPastYear,
  currentYear,
  setCurrentYear,
  pastPrice,
  setPastPrice,
  currentPrice,
  setCurrentPrice,
  onCalculate
}: PriceInputFormProps) {
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Text size='sm'>比較したい商品の価格を入力してください。</Text>
        <Group align='flex-end'>
          <Box style={{ flex: 1 }}>
            <Text size='sm' fw={500} mb={4}>
              昔
            </Text>
            <Group>
              <Select
                data={YEARS.map((y) => ({ value: y.toString(), label: `${y}年` }))}
                value={pastYear?.toString() ?? undefined}
                onChange={(value) => setPastYear(typeof value === 'number' ? value : Number.parseInt(value ?? '0', 10))}
                placeholder='年を選択'
                style={{ width: 120 }}
              />
              <NumberInput
                value={pastPrice ?? undefined}
                onChange={(value) => setPastPrice(typeof value === 'number' ? value : null)}
                placeholder='価格'
                min={0}
                rightSection='円'
                style={{ flex: 1 }}
              />
            </Group>
          </Box>

          <Box style={{ flex: 1 }}>
            <Text size='sm' fw={500} mb={4}>
              現在
            </Text>
            <Group>
              <Select
                data={YEARS.map((y) => ({ value: y.toString(), label: `${y}年` }))}
                value={currentYear?.toString() ?? undefined}
                onChange={(value) =>
                  setCurrentYear(typeof value === 'number' ? value : Number.parseInt(value ?? '0', 10))
                }
                placeholder='年を選択'
                style={{ width: 120 }}
              />
              <NumberInput
                value={currentPrice ?? undefined}
                onChange={(value) => setCurrentPrice(typeof value === 'number' ? value : null)}
                placeholder='価格'
                min={0}
                rightSection='円'
                style={{ flex: 1 }}
              />
            </Group>
          </Box>
        </Group>

        <Button onClick={onCalculate} fullWidth>
          診断する
        </Button>
      </Stack>
    </Paper>
  );
}
