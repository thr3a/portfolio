import { Alert, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { useFetch } from '@mantine/hooks';
import type { RoleplaySetting } from '../types';

const roleplayApiUrl = 'https://misc-api-py.turai.work/roleplay/random';

export const RoleplayGenerator = () => {
  const { data, loading, error, refetch } = useFetch<RoleplaySetting>(roleplayApiUrl, {
    method: 'GET',
    autoInvoke: true
  });

  return (
    <Card shadow='sm' radius='md' withBorder p='lg'>
      <Stack gap='sm'>
        <Group justify='space-between'>
          <div>
            <Title order={3} fz='lg'>
              ロールプレイ設定ジェネレーター
            </Title>
            <Text size='sm' c='dimmed'>
              APIからランダムなロールプレイ設定を取得します。
            </Text>
          </div>

          <Button onClick={refetch} loading={loading} variant='light' size='sm'>
            再取得
          </Button>
        </Group>

        {error && (
          <Alert color='red' title='エラー'>
            設定の取得に失敗しました: {error.message}
          </Alert>
        )}

        {loading && (
          <Group justify='center' py='md'>
            <Loader size='sm' />
          </Group>
        )}

        {!loading && !error && !data && (
          <Text size='sm' c='dimmed'>
            ロールプレイ設定を読み込み中です…
          </Text>
        )}

        {data && (
          <Stack gap='xs'>
            <Text fw={500}>
              {data.major_genre} / {data.minor_genre}
            </Text>

            <Stack gap={4}>
              <Text fw={500} fz='sm'>
                世界観
              </Text>
              <Text size='sm'>{data.world_setting}</Text>
            </Stack>

            <Stack gap={4}>
              <Text fw={500} fz='sm'>
                シーン
              </Text>
              <Text size='sm'>{data.scene_setting}</Text>
            </Stack>

            <Stack gap={4}>
              <Text fw={500} fz='sm'>
                ユーザー設定
              </Text>
              <Text size='sm'>{data.user_setting}</Text>
            </Stack>

            <Stack gap={4}>
              <Text fw={500} fz='sm'>
                アシスタント設定
              </Text>
              <Text size='sm'>{data.assistant_setting}</Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
