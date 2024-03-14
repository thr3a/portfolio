import { Anchor, Paper, Text } from '@mantine/core';
import type { WorkProps } from '../data/works';
import classes from './Text.module.css';

export const Work = ({ title, description, url }: WorkProps): JSX.Element => {
  return (
    <Paper shadow='xs' withBorder p='lg' component='a' radius={0} target='_blank' href={url}>
      <Anchor component={'span'} fw={'bold'} fz={'xl'}>
        {title}
      </Anchor>
      <Text size='sm' className={classes.root}>
        {description}
      </Text>
    </Paper>
  );
};
