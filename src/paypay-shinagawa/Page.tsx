import { Alert, Container, Group, Loader, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle, useInputState } from '@mantine/hooks';
import { useMemo } from 'react';
import { theme } from '../theme';
import { StoreResultList } from './components/StoreResultList';
import { StoreSearchInput } from './components/StoreSearchInput';
import { usePayPayStores } from './hooks/usePayPayStores';

export default function PayPayShinagawa() {
  useDocumentTitle('PayPay品川商品券検索ツール');

  const [keyword, setKeyword] = useInputState('');
  const { stores, loading, error } = usePayPayStores();

  const trimmedKeyword = keyword.trim();
  const filteredStores = useMemo(() => {
    if (trimmedKeyword === '') {
      return [];
    }

    const normalizedKeyword = trimmedKeyword.toLocaleLowerCase();

    return stores.filter((store) => store.title.toLocaleLowerCase().includes(normalizedKeyword));
  }, [stores, trimmedKeyword]);

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='xl'>
        <Stack gap='md'>
          <Stack gap={4}>
            <Title order={2}>PayPay品川商品券検索ツール</Title>
            <Text size='sm' c='dimmed'>
              品川区内の対象店舗を店名で検索できます。
            </Text>
          </Stack>

          <StoreSearchInput value={keyword} onChange={setKeyword} />

          {loading && (
            <Group gap='sm'>
              <Loader size='sm' />
              <Text size='sm' c='dimmed'>
                店舗情報を読み込み中です…
              </Text>
            </Group>
          )}

          {!loading && error && (
            <Alert color='red' title='読み込みエラー'>
              データ取得に失敗しました。時間をおいて再度お試しください。詳細: {error}
            </Alert>
          )}

          {!loading && !error && trimmedKeyword !== '' && <StoreResultList stores={filteredStores} />}
        </Stack>
      </Container>
    </MantineProvider>
  );
}
