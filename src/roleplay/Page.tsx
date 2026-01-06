import { Container, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { theme } from '../theme';
import { RoleplayGenerator } from './components/RoleplayGenerator';

export const RoleplayPage = () => {
  useDocumentTitle('ロールプレイ設定ジェネレーター');

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='xl'>
        <Stack gap={4} py='md'>
          <Title order={2}>ロールプレイ設定ジェネレーター</Title>
          <Text size='sm' c='dimmed'>
            ランダムなロールプレイ設定をAPIから取得して表示します。
          </Text>
        </Stack>

        <Stack id='main'>
          <RoleplayGenerator />
        </Stack>
      </Container>
    </MantineProvider>
  );
};

export default RoleplayPage;
