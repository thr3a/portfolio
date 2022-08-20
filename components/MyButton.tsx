import { Button, Text } from '@mantine/core';
import { IconBrandTwitter, IconEdit, IconExternalLink, IconBrandGithub, TablerIcon } from '@tabler/icons';

type StringKeyObject = {
  [key: string]: TablerIcon;
}

const iconMap: StringKeyObject = {
  twitter: IconBrandTwitter,
  blog: IconEdit,
  external: IconExternalLink,
  github: IconBrandGithub
};

type Props = {
  url: string,
  name: string,
  color: string,
  icon: keyof typeof iconMap
}

export default function MyButton(props: Props) {
  const Component = iconMap[props.icon];
  
  return (
    <div style={{ width: 200 }}>
      <Button
        fullWidth
        size="lg"
        color={props.color}
        component="a"
        target="_blank"
        radius="xs"
        href={props.url}
        styles={(theme) => ({
          root: {
            marginTop: 5,
            marginBottom: 5
          }
        })}
        leftIcon={<Component />}
      >
        <Text align="left">{props.name}</Text>
      </Button>
    </div>

  );
}
