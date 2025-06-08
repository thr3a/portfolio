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
links:
  - Twitter: https://twitter.com/amanekey
  - Blog: https://blog.turai.work
  - GitHub: https://github.com/thr3a
`;

export const Profile = () => {
  return <YamlHighlighter code={yaml} />;
};
