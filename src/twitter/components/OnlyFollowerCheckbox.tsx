import { Checkbox } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const OnlyFollowerCheckbox = () => {
  const form = useSearchFormContext();
  return (
    <Checkbox label='フォローしているユーザーのみ' {...form.getInputProps('onlyFollowerFlag', { type: 'checkbox' })} />
  );
};
