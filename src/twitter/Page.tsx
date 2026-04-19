import { Container, MantineProvider, Title } from '@mantine/core';
import { theme } from '../theme';
import { SearchForm } from './components/SearchForm';
import { PageProvider } from './PageContext';

const TwitterSearchHelper = () => {
  document.title = 'Twitter検索ヘルパー';
  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='md'>
        <Title order={2} mt='md'>
          Twitter検索ヘルパー
        </Title>
        <Title order={4} c='dimmed' mb='md'>
          Twitterの高度な検索を、より簡単に行えるツールです。
        </Title>
        <PageProvider>
          <SearchForm />
        </PageProvider>
      </Container>
    </MantineProvider>
  );
};

export default TwitterSearchHelper;
