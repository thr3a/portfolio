import { Paper, Stack, Text } from '@mantine/core';
import type { WorkProps } from './data/works';
import { text } from './Work.css';

export const Work = ({ title, description, url, emoji }: WorkProps) => {
  return (
    <Paper
      bd='1px solid var(--mantine-primary-color-5)'
      p='md'
      component='a'
      radius={0}
      target='_blank'
      href={url}
      c='var(--mantine-primary-color-8)'
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Stack gap='sm'>
        <Text ta='center' fz='h1' component='span'>
          {emoji}
        </Text>
        <Text fw='bold' fz={'xl'} component='span'>
          {title}
        </Text>
        <Text size='xs' className={text} component='span'>
          {description}
        </Text>
      </Stack>
    </Paper>
  );
};
