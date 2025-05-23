// ref: https://mantine.dev/theming/color-schemes/#color-scheme-value-caveats
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import * as classes from './ColorSchemeToggle.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => {
        setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
      }}
      variant='default'
      size='xl'
      aria-label='Toggle color scheme'
    >
      <IconSun className={cx(classes.common, classes.light)} />
      <IconMoon className={cx(classes.common, classes.dark)} />
    </ActionIcon>
  );
}
