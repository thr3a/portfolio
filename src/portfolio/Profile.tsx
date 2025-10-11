import { YamlHighlighter } from './YamlHighlighter';

const yaml = /* yaml */ `
name: あまねきー
region: ap-northeast-1
favorites:
  languages:
    - Ruby
    - TypeScript
  animal: 猫
  game: スプラトゥーン
  foods:
    - お寿司
    - 甘いもの全般
hobbies:
  - 西洋絵画
links:
  - Twitter: https://twitter.com/amanekey
  - Blog: https://blog.turai.work
  - GitHub: https://github.com/thr3a
`;

export const Profile = () => {
  return <YamlHighlighter code={yaml} />;
};
