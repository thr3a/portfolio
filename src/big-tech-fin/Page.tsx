import { Container, Loader, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { theme } from '../theme';
import { CompanyChart } from './components/CompanyChart';
import { useCashflowData } from './hooks/useCashflowData';
import type { CompanyConfig } from './types';

// 表示する企業とブランドカラー(指定順に縦一列で並べる)
const COMPANIES: CompanyConfig[] = [
  { ticker: 'GOOGL', name: 'Google', color: '#4285F4' },
  { ticker: 'AMZN', name: 'Amazon', color: '#FF9900' },
  { ticker: 'MSFT', name: 'Microsoft', color: '#00A4EF' },
  { ticker: 'META', name: 'Meta', color: '#0866FF' },
  { ticker: 'ORCL', name: 'Oracle', color: '#C74634' }
];

export default function BigTechFinPage() {
  useDocumentTitle('米ビッグテックのキャッシュフロー');
  const { data, error } = useCashflowData();

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='xl'>
        <Stack gap={4} py='md'>
          <Title order={2}>米ビッグテックのキャッシュフロー</Title>
          <Text size='sm' c='dimmed'>
            SEC EDGARの提出データより。OCF(営業CF)・FCF(フリーCF)・Capex(設備投資)のTTM(直近4四半期合計)推移。単位はUSD
            bn(10億ドル)。
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
