import { Checkbox } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const RecentTwoYearsCheckbox = () => {
  const form = useSearchFormContext();
  return <Checkbox label='直近2年に絞る' {...form.getInputProps('recentTwoYears', { type: 'checkbox' })} />;
};
