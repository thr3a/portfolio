import { CodeHighlight } from '@mantine/code-highlight';

const yaml = /* yaml */ `
name: あまねきー
place: 東京
favorite:
  language:
    - Ruby
    - TypeScript
  animal: 猫
  game: スプラトゥーン 🦑
  food:
    - お寿司
    - 甘いもの全般
`;

export const Profile = (): JSX.Element => {
  return <CodeHighlight
    code={yaml}
    language='yaml'
    withCopyButton={false}
  />;
};
