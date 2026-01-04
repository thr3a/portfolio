import { Container, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { theme } from '../theme';
import { MyCard } from './components/MyCard';

export default function Example() {
  useDocumentTitle('サンプル');

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='xl'>
        <Stack gap={4} py='md'>
          <Title order={2}>サンプルタイトル</Title>
          <Text size='sm' c='dimmed'>
            タイトル説明文。
          </Text>
        </Stack>

        <Stack id='main'>
          <MyCard />
        </Stack>
      </Container>
    </MantineProvider>
  );
}
