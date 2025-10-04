import { Anchor, Avatar, Card, Group, Stack, Text } from '@mantine/core';
import type { PayPayStore } from '../types';

type StoreCardProps = {
  store: PayPayStore;
};

export function StoreCard({ store }: StoreCardProps) {
  const genre = store.subCategoryLabel?.trim() || store.category?.name || 'ジャンル未設定';
  const query = encodeURIComponent(`品川区 ${store.title}`);
  const googleMapsUrl = `https://google.com/maps?q=${query}`;

  return (
    <Card withBorder padding='sm' radius='md'>
      <Group gap='md' align='flex-start' wrap='nowrap'>
        <Avatar src={store.iconUrl} alt={`${store.title}のアイコン`} size={64} radius='md' />
        <Stack gap={4} flex={1}>
          <Anchor href={googleMapsUrl} target='_blank' rel='noopener noreferrer'>
            <Text fw={700} size='lg'>
              {store.title}
            </Text>
          </Anchor>
          <Text size='sm' c='dimmed'>
            {genre}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
