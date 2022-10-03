import { createStyles, Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import Link from 'next/link';
import type { WorkProps } from '../Props';

const useStyles = createStyles((theme) => ({
  card: {
    padding: theme.spacing.lg,
    "margin-top": theme.spacing.md,
    "margin-buttom": theme.spacing.md,
    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'scale(1.02)',
    },
  },
}));

export const MyWork = ({ title, description, url }: WorkProps) => {
  const { classes } = useStyles();
  return (
    <Link href={url} passHref>
      <Paper
        component="a"
        className={classes.card}
        radius={0}
        withBorder={true}
        target="_blank"
      >
        <Group mb="xs">
          <Title
            order={1}
            color="blue"
            weight={800}
          >{title}</Title>
        </Group>
        <Text size="md">
          {description}
        </Text>
      </Paper>
    </Link>
  );
};
