import { createStyles, Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import Link from 'next/link';

type CardProps = {
  title: string,
  url: string,
  description: string
}

const useStyles = createStyles((theme) => ({
  card: {
    // position: 'relative',
    // cursor: 'pointer',
    // overflow: 'hidden',
    // transition: 'transform 150ms ease, box-shadow 100ms ease',
    padding: theme.spacing.lg,
    "margin-top": theme.spacing.md,
    "margin-buttom": theme.spacing.md,
    // paddingLeft: theme.spacing.xl * 2,

    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'scale(1.02)',
    },

    // '&::before': {
    //   content: '""',
    //   position: 'absolute',
    //   top: 0,
    //   bottom: 0,
    //   left: 0,
    //   width: 6,
    //   backgroundImage: theme.fn.linearGradient(0, theme.colors.pink[6], theme.colors.orange[6]),
    // },
  },
}));

export function MyWork({ title, description, url }: CardProps) {
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
}

export default MyWork;
