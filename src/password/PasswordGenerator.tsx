import { Box, Button, Checkbox, Flex, Group, Input, Paper, Select, Stack, Text, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useState } from 'react';
import { ButtonCopy } from './ButtonCopy';
import { generatePassword } from './passwordGenerator.ts';

type FormValues = {
  length: number;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  excludeSimilar: boolean;
};

import { useEffect } from 'react';

const initialFormValues: FormValues = {
  length: 8,
  lower: true,
  upper: true,
  number: true,
  symbol: false,
  excludeSimilar: true
};

export function PasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([]);

  const form = useForm<FormValues>({
    initialValues: initialFormValues,
    validate: {
      lower: (_: boolean, values: FormValues) =>
        values.lower || values.upper || values.number || values.symbol ? null : '最低1つは選択してください'
    }
  });

  const handleGenerateOnButtonClick = useCallback(() => {
    const result = Array.from({ length: 10 }, () => generatePassword(form.values));
    setPasswords(result);
  }, [form.values]);

  // 初回マウント時に自動生成
  useEffect(() => {
    const result = Array.from({ length: 10 }, () => generatePassword(initialFormValues));
    setPasswords(result);
  }, []); // initialFormValues が外部で変更される可能性がなければ空で良い

  return (
    <Paper withBorder p='md' mt='md'>
      <form
        onSubmit={form.onSubmit(() => {
          handleGenerateOnButtonClick();
        })}
      >
        <Stack gap='xs'>
          <Select
            label='パスワードの長さ'
            data={Array.from({ length: 17 }, (_, i) => ({
              value: String(i + 4),
              label: String(i + 4)
            }))}
            {...form.getInputProps('length')}
            defaultValue={'8'}
            allowDeselect={false}
          />
          <Group gap='xs'>
            <Checkbox label='小文字 (a-z)' {...form.getInputProps('lower', { type: 'checkbox' })} />
            <Checkbox label='大文字 (A-Z)' {...form.getInputProps('upper', { type: 'checkbox' })} />
            <Checkbox label='数字 (0-9)' {...form.getInputProps('number', { type: 'checkbox' })} />
            <Checkbox label='記号 (!@#$%^&*)' {...form.getInputProps('symbol', { type: 'checkbox' })} />
          </Group>
          <Checkbox
            label='似た文字を除外 (1, l, I, 0, O)'
            {...form.getInputProps('excludeSimilar', { type: 'checkbox' })}
          />
          <Button type='submit' mt='xs' fullWidth>
            パスワード生成
          </Button>
        </Stack>
      </form>
      {passwords.length > 0 && (
        <Box mt='md'>
          <Text size='sm' c='dimmed' mb={4}>
            生成結果
          </Text>
          <Stack gap={4}>
            {passwords.map((pw, i) => (
              <Flex key={i} align='center' gap='xs' justify='space-between'>
                <ButtonCopy content={pw} />
                <Input
                  type='text'
                  value={pw}
                  readOnly
                  size='md'
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: rem(1),
                    flex: 1
                  }}
                  styles={{
                    input: {
                      fontFamily: 'monospace',
                      letterSpacing: rem(1)
                    }
                  }}
                  variant='filled'
                />
              </Flex>
            ))}
          </Stack>
          <Flex justify='flex-end' mt='md'>
            <ButtonCopy content={passwords.join('\n')} label='すべてコピー' />
          </Flex>
        </Box>
      )}
    </Paper>
  );
}
