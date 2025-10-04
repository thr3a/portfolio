import { Container, MantineProvider, Title } from '@mantine/core';
import { theme } from '../theme';

export default function PayPayShinagawa() {
  document.title = 'PayPay品川商品券検索ツール';
  return (
    <MantineProvider theme={theme}>
      <Container id='container' maw={400}>
        <Title mt={'sm'} order={2}>
          PayPay品川商品券検索ツール
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          PayPay品川商品券検索ツール
        </Title>
      </Container>
    </MantineProvider>
  );
}
