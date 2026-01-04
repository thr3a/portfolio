---
File: src/SampleStyle.tsx
import { Box, Button, rem, useMantineTheme } from '@mantine/core';
import classes from './Button.module.css';
import * as veClasses from './SampleStyle.css';

export function SampleCssModule() {
  return <Box className={classes.box}>sample</Box>;
}

export function SampleVanillaExtract() {
  return <Box className={veClasses.box}>sample</Box>;
}

export function SampleStyleProps() {
  return (
    // margin-left: auto; margin-right: auto; (centers the box horizontally)
    // max-width: 400px
    // color: theme.colors.blue[6]
    // background-color: #fff
    <Box mx='auto' maw={400} c='blue.6' bg='#fff'>
      Your component
    </Box>
  );
}

export function SampleStyle() {
  const theme = useMantineTheme();

  return (
    <div>
      {/*
      colorプロップは、特定のコンポーネントに適用される複数のCSSプロパティ（例: background、color、border-colorなど）を一括で制御するために使用
      一方、cプロップは、通常コンポーネント内のテキスト色（CSSのcolorプロパティ）を直接指定するために使用
      */}
      <Button color='yellow' c='black'>
        背景色が黄色で文字が黒のボタン
      </Button>
      <div
        style={{
          backgroundColor: theme.colors.blue[1],
          color: theme.colors.blue[9]
        }}
      >
        This is a blue theme
      </div>

      <Button
        style={{
          // theme.colors.red[5]
          color: 'var(--mantine-color-red-5)',
          fontSize: rem(12)
        }}
      >
        Button 1
      </Button>
      <Box
        style={(theme) => ({
          color: theme.colors.red[5],
          fontSize: theme.fontSizes.xs
        })}
      />

      <Button
        radius='md'
        styles={{
          root: {
            padding: 2,
            border: 0
          }
        }}
      >
        button
      </Button>
    </div>
  );
}

---
File: src/SampleStyle.css.ts
import { rem } from '@mantine/core';
import { style } from '@vanilla-extract/css';
import { vars } from './theme';

export const box = style({
  color: vars.colors.black,
  backgroundColor: vars.colors.red[5],
  fontSize: vars.fontSizes.xl,
  paddingRight: vars.spacing.md,

  selectors: {
    [vars.darkSelector]: {
      color: vars.colors.white
    }
  },

  '@media': {
    [vars.smallerThan('md')]: {
      fontSize: rem(50)
    }
  }
});

---
File: src/Button.module.css
.box {
  color: red;
  font-size: var(--mantine-font-size-xl);
}

---
