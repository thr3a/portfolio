import { CodeHighlight } from '@mantine/code-highlight';

const yaml = /* yaml */ `
name: あまねきー
location: 東京
favorites:
  languages:
    - Ruby
    - TypeScript
  animal: 猫
  game: スプラトゥーン 🦑
  foods:
    - お寿司
    - 甘いもの全般
hobbies:
  - 西洋絵画
`;

export const Profile = (): JSX.Element => {
  return <CodeHighlight
    code={yaml}
    language='yaml'
    withCopyButton={false}
  />;
};
