import '@gfazioli/mantine-border-animate/styles.css';
import { BorderAnimate } from '@gfazioli/mantine-border-animate';

import { Group, Paper, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import type { WorkProps } from './data/works';
import { text } from './Work.css';

export const Work = ({ title, description, url, emoji }: WorkProps) => {
  const { hovered, ref } = useHover();

  return (
    <BorderAnimate
      show={hovered}
      radius={'xs'}
      size='md'
      borderWidth='sm'
      duration={4}
      colorFrom='red'
      colorTo='violet'
    >
      <Paper
        ref={ref}
        flex='1'
        bd='1px solid pink.6'
        p='md'
        pt='sm'
        component='a'
        target='_blank'
        href={url}
        c='green.8'
      >
        <Stack gap='0'>
          <Group gap='xs' align='center'>
            <Text fz='h1' component='span'>
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
    </BorderAnimate>
  );
};
