import { Paper, Text, Anchor } from '@mantine/core';
import { type WorkProps } from '../data/works';

export const Work = ({ title, description, url }: WorkProps): JSX.Element => {
  return (
    <Paper
      shadow="xs" withBorder p='lg'
      component="a"
      radius={0}
      target="_blank"
      href={url}
    >
      <Anchor component={'span'} fw={'bold'} fz={'xl'}>{title}</Anchor>
      <Text size="sm" c={'black'}>
        {description}
      </Text>
    </Paper>
  );
};
