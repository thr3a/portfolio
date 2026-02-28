import { Group, Paper, Stack, Text } from '@mantine/core';
import type { WorkProps } from './data/works';
import { text } from './Work.css';

export const Work = ({ title, description, url, emoji }: WorkProps) => {
  return (
    <Paper bd='1px solid pink.6' p='md' component='a' target='_blank' href={url} c='green.9'>
      <Stack gap='0'>
        <Group gap='xs' align='center'>
          <Text fz='xl' component='span'>
            {emoji}
          </Text>
          <Text fw='bold' fz='xl' component='span'>
            {title}
          </Text>
        </Group>
        <Text size='xs' className={text} component='span'>
          {description}
        </Text>
      </Stack>
    </Paper>
  );
};
