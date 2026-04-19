import { createFormContext } from '@mantine/form';
import type { SearchProps } from './types';

export const [SearchFormProvider, useSearchFormContext, useSearchForm] = createFormContext<SearchProps>();
