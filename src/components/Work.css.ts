import { style } from '@vanilla-extract/css';
import { vars } from '../theme';

export const text = style({
  selectors: {
    [vars.lightSelector]: {
      color: vars.colors.black
    },
    [vars.darkSelector]: {
      color: vars.colors.white
    }
  }
});
