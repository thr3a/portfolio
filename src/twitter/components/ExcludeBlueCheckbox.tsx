import { Checkbox } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const ExcludeBlueCheckbox = () => {
  const form = useSearchFormContext();
  return <Checkbox label='青認証除外' {...form.getInputProps('excludeBlue', { type: 'checkbox' })} />;
};
