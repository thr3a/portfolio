import { Anchor, Group, Stack, Text } from '@mantine/core';
import type { Work } from '../../portfolio/data/works';
import * as css from '../styles.css';
import { COLORS } from '../theme';

type WorkCardProps = {
  work: Work;
};

export const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <Anchor
      href={work.url}
      target='_blank'
      rel='noopener noreferrer'
      underline='never'
      c='inherit'
      p='md'
      className={css.card}
    >
      <Stack gap='xs'>
        <Group gap='xs' wrap='nowrap' align='flex-start'>
          <Text fz='lg' lh={1.4}>
            {work.emoji}
          </Text>
          <Text fw='bold' c={COLORS.ink} lh={1.4}>
            {work.title}
          </Text>
        </Group>
        <Text fz='sm' c='dimmed'>
          {work.description}
        </Text>
      </Stack>
    </Anchor>
  );
};
