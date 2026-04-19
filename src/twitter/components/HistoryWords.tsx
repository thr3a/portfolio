import { Button, Group } from '@mantine/core';
import { usePageContext } from '../PageContext';
import { HistoryWord } from './HistoryWord';

export const HistoryWords = () => {
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
    <>
      <Group gap='xs' mt='xs'>
        {searchWords.map((word, index) => (
          <HistoryWord key={index} word={word} onDelete={deleteHistory} />
        ))}
      </Group>
      <Group gap='xs' mt='xs'>
        <Button color='yellow' size='compact-md' onClick={clearHistory}>
          検索履歴全削除
        </Button>
      </Group>
    </>
  );
};
