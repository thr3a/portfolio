import { Radio, Stack } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const MediaTypeSelect = () => {
  const form = useSearchFormContext();
  return (
    <Radio.Group label='メディア' {...form.getInputProps('mediaType')}>
      <Stack gap='xs' mt='xs'>
        <Radio value='none' label='指定なし' />
        <Radio value='image' label='画像のみ' />
        <Radio value='movie' label='動画のみ' />
        <Radio value='include_url' label='URL含む' />
        <Radio value='exclude_url' label='URL除外' />
      </Stack>
    </Radio.Group>
  );
};
