import { Stack, Text } from '@mantine/core';
import type { PayPayStore } from '../types';
import { StoreCard } from './StoreCard';

type StoreResultListProps = {
  stores: PayPayStore[];
};

export function StoreResultList({ stores }: StoreResultListProps) {
  if (stores.length === 0) {
    return (
      <Text size='sm' c='dimmed'>
        該当する店舗は見つかりませんでした。
      </Text>
    );
  }

  return (
    <Stack gap='sm'>
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </Stack>
  );
}
