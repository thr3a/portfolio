# turn1

パスワード一括生成ツールを作成したい

フォームで設定できるパラメーター
- パスワードの長さ 4~20 数字入力ではなくセレクトボックスで選ぶようにする　デフォルト８
- 使用する文字タイプ
  - 小文字(a-z)
  - 大文字(A-Z)
  - 数字(1-0)
  - 記号 !@#$%^&*
- 似た文字を除外 デフォルトOFF
  - これにチェックいれると1,l,I,0,Oが除外される

「パスワード生成」ボタンをクリックすると下に要件を満たしたパスワードが１０個生成される

パスワード生成ロジックは以下を参考にすること　Math.random()は使うな！！

```ts
export const generatePassword = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map(value => characters[value % characters.length])
    .join('');
};
```

# turn2

パスワードがワンクリックでコピーできるようにしてほしい
mantineのCopyButtonを使ってパスワードの右側にコピーボタン
クリックしたらその行のパスワードがコピーされる

加えて、一番右下に「すべてコピー」のボタンを用意
それをクリックすると10個全部が10行としてコピーされる


# turn3

src/PasswordGenerator.tsxのパスワード生成部分のロジックをtsに切り出して
vitestでパスワード生成の部分のみのてすとを実装して
必要なライブラリがあればインストールしていいよ
