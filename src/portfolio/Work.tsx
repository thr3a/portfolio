import { Anchor, Paper, Text } from '@mantine/core';
import { text } from './Work.css';
import type { WorkProps } from './data/works';

export const Work = ({ title, description, url }: WorkProps) => {
  return (
    <Paper shadow='xs' withBorder p='lg' component='a' radius={0} target='_blank' href={url}>
      <Anchor component={'span'} fw={'bold'} fz={'xl'}>
        {title}
      </Anchor>
      <Text size='sm' className={text}>
        {description}
      </Text>
    </Paper>
  );
};
