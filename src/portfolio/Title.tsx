import { Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';

export const Title = ({ title }: { title: string }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Text mt='xl' mb='md' fz='h1' c={theme.primaryColor}>
        ##{' '}
        <Text component='span' fw={'bold'} c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.black} inherit>
          {title}
        </Text>
      </Text>
    </>
  );
};
