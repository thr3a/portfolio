import { YamlHighlighter } from './YamlHighlighter';

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

export const Profile = () => {
  return <YamlHighlighter code={yaml} />;
};
