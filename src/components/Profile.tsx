import { CodeHighlight } from '@mantine/code-highlight';

const yaml = /* yaml */ `
name: あまねきー
region: ap-northeast-1
favorites:
  languages:
    - Ruby
    - TypeScript
  animal: cat
  game: Splatoon 🦑
  foods:
    - sushi
    - sweets
hobbies:
  - western painting
`;

export const Profile = (): JSX.Element => {
  return <CodeHighlight code={yaml} language='yaml' withCopyButton={false} />;
};
