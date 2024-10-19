import { rem } from '@mantine/core';
import { style } from '@vanilla-extract/css';
import { vars } from '../theme';

export const title = style({
  fontSize: rem(100),
  '@media': {
    [vars.smallerThan('xs')]: {
      fontSize: rem(32)
    }
  }
});
