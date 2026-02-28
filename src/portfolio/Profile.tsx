import { Paper } from '@mantine/core';
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
  - LLM
links:
  - Twitter: [@Amanekey](https://x.com/amanekey)
  - Blog: [https://blog.turai.work](https://blog.turai.work/)
  - GitHub: [@thr3a](https://github.com/thr3a)
`;

export const Profile = () => {
  return (
    <Paper p='md' withBorder bd='1px solid pink.5'>
      <YamlHighlighter code={yaml} />
    </Paper>
  );
};
