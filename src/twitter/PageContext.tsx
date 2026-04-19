import { useLocalStorage } from '@mantine/hooks';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

type PageContextType = {
  searchWords: string[];
  setSearchWords: Dispatch<SetStateAction<string[]>>;
};

type ChildrenProps = {
  children: ReactNode;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: ChildrenProps) => {
  const [searchWords, setSearchWords] = useLocalStorage<string[]>({ key: 'twitter-search-words', defaultValue: [] });
  return <PageContext.Provider value={{ searchWords, setSearchWords }}>{children}</PageContext.Provider>;
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within PageProvider');
  }
  return context;
};
