import { Text, useMantineTheme } from '@mantine/core';

export const Title = ({ title }: { title: string }): JSX.Element => {
  const theme = useMantineTheme();

  return (
    <>
      <Text mt='xl' mb='md' fz='h1' c={theme.primaryColor}>
        ##{' '}
        <Text component='span' fw={'bold'} c={'dark'} inherit>
          {title}
        </Text>
      </Text>
    </>
  );
};
