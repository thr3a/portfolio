import { TextInput } from '@mantine/core';

import type { ChangeEvent } from 'react';

type StoreSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StoreSearchInput({ value, onChange }: StoreSearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <TextInput
      value={value}
      onChange={handleChange}
      autoFocus
      placeholder='店名で検索'
      size='lg'
      radius='md'
      data-autofocus
    />
  );
}
