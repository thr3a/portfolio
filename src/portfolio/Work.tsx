import { Paper, Stack, Text } from '@mantine/core';
import type { WorkProps } from './data/works';
import { text } from './Work.css';

export const Work = ({ title, description, url, emoji }: WorkProps) => {
  return (
    <Paper
      shadow='md'
      withBorder
      p='lg'
      component='a'
      radius={0}
      target='_blank'
      href={url}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Stack gap='0'>
        <Text ta='center' fz='h1' component='span' mb={'lg'}>
          {emoji}
        </Text>
        <Text fw='bold' fz={'xl'} component='span'>
          {title}
        </Text>
        <Text size='sm' className={text} component='span'>
          {description}
        </Text>
      </Stack>
    </Paper>
  );
};
