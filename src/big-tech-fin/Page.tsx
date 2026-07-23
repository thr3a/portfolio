import { Container, Loader, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { theme } from '../theme';
import { CapexStackedChart } from './components/CapexStackedChart';
import { CompanyChart } from './components/CompanyChart';
import { useCashflowData } from './hooks/useCashflowData';
import type { CompanyConfig } from './types';

const COMPANIES: CompanyConfig[] = [
  { ticker: 'GOOGL', name: 'Google', color: '#4285F4' },
  { ticker: 'AMZN', name: 'Amazon', color: '#FF9900' },
  { ticker: 'MSFT', name: 'Microsoft', color: '#00188f' },
  { ticker: 'META', name: 'Meta', color: '#0866FF' },
  { ticker: 'ORCL', name: 'Oracle', color: '#f80000' },
  // { ticker: 'AAPL', name: 'Apple', color: '#000000' }
];

export default function BigTechFinPage() {
  useDocumentTitle('米ハイパースケーラーのキャッシュフローグラフ');
  const { data, error } = useCashflowData();

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='md'>
        <Stack gap={4} py='md'>
          <Title order={2}>米ハイパースケーラーのキャッシュフローグラフ📈</Title>
          <Text size='sm' c='dimmed'>
            米国主要ハイパースケーラー5社(Google、Amazon、Microsoft、Meta、Oracle)のOCF(営業CF)・FCF(フリーCF)・Capex(設備投資)を直近4四半期合計で比較するグラフです。
            キャッシュ創出力と設備投資の規模・推移を把握できます。SEC EDGARの提出資料ベース、単位は10億米ドル
          </Text>
        </Stack>

        {error && (
          <Text c='red' size='sm'>
            {error}
          </Text>
        )}
        {!data && !error && <Loader />}

        {data && (
          <Stack gap='xl' mt='md'>
            <CapexStackedChart companies={data.companies} configs={COMPANIES} />
            {COMPANIES.map((config) => {
              const company = data.companies.find((c) => c.ticker === config.ticker);
              if (!company) return null;
              return <CompanyChart key={config.ticker} config={config} quarters={company.quarters} />;
            })}
          </Stack>
        )}
      </Container>
    </MantineProvider>
  );
}
