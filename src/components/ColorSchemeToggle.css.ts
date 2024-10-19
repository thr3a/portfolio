import { rem } from '@mantine/core';
import { style } from '@vanilla-extract/css';
import { vars } from '../theme';

export const common = style({
  width: rem('22px'),
  height: rem('22px')
});

export const dark = style({
  selectors: {
    [vars.lightSelector]: {
      display: 'block'
    },
    [vars.darkSelector]: {
      display: 'none'
    }
  }
});

export const light = style({
  selectors: {
    [vars.lightSelector]: {
      display: 'none'
    },
    [vars.darkSelector]: {
      display: 'block'
    }
  }
});
