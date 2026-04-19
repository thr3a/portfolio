import { Button, Center, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { SearchFormProvider, useSearchForm } from '../form-context';
import { usePageContext } from '../PageContext';
import type { SearchProps } from '../types';
import { EndDateInput } from './EndDateInput';
import { ExcludeWordInput } from './ExcludeWordInput';
import { HistoryWords } from './HistoryWords';
import { MediaTypeSelect } from './MediaTypeSelect';
import { OnlyFollowerCheckbox } from './OnlyFollowerCheckbox';
import { OnlyJapaneseCheckbox } from './OnlyJapaneseCheckbox';
import { PopularTypeSelect } from './PopularTypeSelect';
import { RecentTwoYearsCheckbox } from './RecentTwoYearsCheckbox';
import { UsernameInput } from './UserNameInput';
import { WordInput } from './WordInput';

export const SearchForm = () => {
  const { setSearchWords } = usePageContext();

  const form = useSearchForm({
    initialValues: {
      word: '',
      excludeWord: '',
      username: '',
      mediaType: 'none',
      popularType: 'none',
      onlyFollowerFlag: false,
      onlyJapanese: true,
      endDate: '',
      recentTwoYears: true
    }
  });

  const search = (values: SearchProps) => {
    const query: string[] = [];

    if (values.word) {
      setSearchWords((prev) => [...new Set([...prev, values.word])]);
      query.push(encodeURIComponent(values.word));
    }
    if (values.excludeWord) {
      query.push(`-${encodeURIComponent(values.excludeWord)}`);
    }
    if (values.username) {
      query.push(`from:${values.username}`);
    }
    if (values.onlyFollowerFlag) {
      query.push('filter:follows');
    }
    if (values.onlyJapanese) {
      query.push('lang:ja');
    }
    if (values.mediaType === 'image') {
      query.push('filter:twimg');
    } else if (values.mediaType === 'movie') {
      query.push('filter:consumer_video');
    } else if (values.mediaType === 'include_url') {
      query.push('filter:links -filter:media');
    } else if (values.mediaType === 'exclude_url') {
      query.push('-filter:links');
    }
    if (values.popularType !== 'none') {
      query.push(`min_faves:${values.popularType}`);
    }
    if (values.recentTwoYears) {
      const since = dayjs().subtract(2, 'year').startOf('year').format('YYYY-MM-DD');
      query.push(`since:${since}`);
    }
    if (values.endDate !== '') {
      const endDate = dayjs(values.endDate).format('YYYY-MM-DD');
      query.push(`until:${endDate}`);
    }

    const url = `https://x.com/search?f=live&q=${query.join(' ')}`;
    window.open(url);
  };

  return (
    <SearchFormProvider form={form}>
      <form onSubmit={form.onSubmit(search)}>
        <Stack gap='sm'>
          <WordInput />
          <HistoryWords />
          <ExcludeWordInput />
          <UsernameInput />
          <MediaTypeSelect />
          <PopularTypeSelect />
          <EndDateInput />
          <OnlyFollowerCheckbox />
          <OnlyJapaneseCheckbox />
          <RecentTwoYearsCheckbox />
        </Stack>
        <Center py='xl'>
          <Button type='submit' size='md'>
            検索
          </Button>
        </Center>
      </form>
    </SearchFormProvider>
  );
};
