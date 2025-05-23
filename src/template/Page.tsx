import { Container, MantineProvider, Title } from '@mantine/core';
import { theme } from '../theme';

export default function Template() {
  return (
    <MantineProvider theme={theme}>
      <Container>
        <Title mt={'sm'} order={2}>
          Aboutページ
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          これはAboutページです。
        </Title>
      </Container>
    </MantineProvider>
  );
}
