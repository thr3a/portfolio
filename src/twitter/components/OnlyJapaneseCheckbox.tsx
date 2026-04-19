import { Checkbox } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const OnlyJapaneseCheckbox = () => {
  const form = useSearchFormContext();
  return <Checkbox label='日本語ツイートのみ' {...form.getInputProps('onlyJapanese', { type: 'checkbox' })} />;
};
