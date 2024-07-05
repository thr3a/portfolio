import { Button, Text } from '@mantine/core';
// import { type SnsProps, iconMap } from '@/features/Props';
import type { IconProps } from '@tabler/icons-react';
import { IconBrandGithub, IconBrandTwitter, IconEdit, IconExternalLink } from '@tabler/icons-react';

type StringKeyObject = Record<string, React.FC<IconProps>>;

const iconMap: StringKeyObject = {
  twitter: IconBrandTwitter,
  blog: IconEdit,
  external: IconExternalLink,
  github: IconBrandGithub
};

export type SnsProps = {
  url: string;
  name: string;
  color: string;
  icon: keyof typeof iconMap;
};

export const SnsLink = (props: SnsProps): JSX.Element => {
  const IconComponent = iconMap[props.icon];

  return (
    <Button
      w={200}
      size={'lg'}
      color={props.color}
      component='a'
      target='_blank'
      href={props.url}
      justify='flex-start'
      leftSection={<IconComponent size={22} />}
    >
      <Text fw={'bold'}>{props.name}</Text>
    </Button>
  );
};
