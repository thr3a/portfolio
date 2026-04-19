import { Button, Center, Checkbox, Group, Radio, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useLongPress } from '@mantine/hooks';
import { IconAt } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { SearchFormProvider, useSearchForm, useSearchFormContext } from '../form-context';
import { usePageContext } from '../PageContext';
import type { SearchProps } from '../types';

type HistoryWordProps = {
  word: string;
  onDelete: (word: string) => void;
};

const HistoryWord = ({ word, onDelete }: HistoryWordProps) => {
  const form = useSearchFormContext();
  const handlers = useLongPress(() => onDelete(word));
  return (
    <Button variant='default' size='compact-lg' onClick={() => form.setFieldValue('word', word)} {...handlers}>
      {word}
    </Button>
  );
};

const HistoryWords = () => {
  const { searchWords, setSearchWords } = usePageContext();

  const deleteHistory = (word: string) => {
    setSearchWords((prev) => prev.filter((w) => w !== word));
  };

  const clearHistory = () => {
    if (window.confirm('全削除しますか？')) {
      setSearchWords([]);
    }
  };

  if (searchWords.length === 0) return null;

  return (
    <Stack gap='xs'>
      <Group gap='xs'>
        {searchWords.map((word) => (
          <HistoryWord key={word} word={word} onDelete={deleteHistory} />
        ))}
      </Group>
      <Group gap='xs'>
        <Button color='yellow' size='compact-md' onClick={clearHistory}>
          検索履歴全削除
        </Button>
      </Group>
    </Stack>
  );
};

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

    const url = `https://x.com/search?f=live&src=typed_query&q=${query.join(' ')}`;
    window.open(url);
  };

  return (
    <SearchFormProvider form={form}>
      <form onSubmit={form.onSubmit(search)}>
        <Stack gap='sm'>
          <TextInput label='検索ワード' {...form.getInputProps('word')} />
          <HistoryWords />
          <TextInput label='除外ワード' {...form.getInputProps('excludeWord')} />
          <TextInput
            maw={400}
            label='特定ユーザーからのみ'
            leftSection={<IconAt size={14} />}
            {...form.getInputProps('username')}
          />
          <Radio.Group label='メディア' {...form.getInputProps('mediaType')}>
            <Stack gap='xs' mt='xs'>
              <Radio value='none' label='指定なし' />
              <Radio value='image' label='画像のみ' />
              <Radio value='movie' label='動画のみ' />
              <Radio value='include_url' label='URL含む' />
              <Radio value='exclude_url' label='URL除外' />
            </Stack>
          </Radio.Group>
          <Radio.Group label='いいね数' {...form.getInputProps('popularType')}>
            <Stack gap='xs' mt='xs'>
              <Radio value='none' label='指定なし' />
              <Radio value='5' label='5いいね以上' />
              <Radio value='20' label='20いいね以上' />
            </Stack>
          </Radio.Group>
          <DateInput label='この日より昔(当日を含まない)' {...form.getInputProps('endDate')} />
          <Checkbox
            label='フォローしているユーザーのみ'
            {...form.getInputProps('onlyFollowerFlag', { type: 'checkbox' })}
          />
          <Checkbox label='日本語ツイートのみ' {...form.getInputProps('onlyJapanese', { type: 'checkbox' })} />
          <Checkbox label='直近2年に絞る' {...form.getInputProps('recentTwoYears', { type: 'checkbox' })} />
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
