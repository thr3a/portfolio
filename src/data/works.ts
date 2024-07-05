export type WorkProps = {
  title: string;
  url: string;
  description: string;
  group: 'ai' | 'tool' | 'dev' | 'old';
};

export const WorkData: WorkProps[] = [
  {
    title: 'Anime Remove Background',
    url: 'https://huggingface.co/spaces/thr3a/anime-remove-background',
    description: '2次元画像の背景削除時に白色できるようにしたやつ',
    group: 'ai'
  },
  {
    title: 'Super-IOPaint',
    url: 'https://huggingface.co/spaces/thr3a/super-iopaint',
    description: '画像背景削除するやつ',
    group: 'ai'
  },
  // {
  //   title: 'JKヒス構文メーカー',
  //   url: 'https://ai.turai.work/jkhiss/',
  //   description: 'JKヒス構文もAIで自動生成なんだ、私なんかいなくなっちゃえばいいんだ！',
  //   group: 'ai'
  // },
  {
    title: 'プロンプト改善くん',
    url: 'https://ai.turai.work/improve-prompt/',
    description: 'プロンプト改善もAIにやらせよう',
    group: 'ai'
  },
  {
    title: 'お母さんヒス構文メーカー',
    url: 'https://ai.turai.work/mhiss/',
    description: 'ヒス構文もAIで自動生成なんだ、じゃあお母さんはいらないってこと？',
    group: 'ai'
  },
  {
    title: '言い換えAI',
    url: 'https://ai.turai.work/paraphrase/',
    description: '単語/文章をシチュエーションに合わせてChatGPTが変換',
    group: 'ai'
  },
  {
    title: '英語でググり隊',
    url: 'https://ai.turai.work/ggr-en',
    description: '英語でググりたいときにいい感じに翻訳',
    group: 'ai'
  },
  // {
  //   title: 'AI言論コロシアム',
  //   url: 'https://ai.turai.work/discuss/',
  //   description: 'ChatGPT vs ChatGPT',
  //   group: 'ai'
  // },
  {
    title: '命名先生',
    url: 'https://ai.turai.work/meimei/',
    description: '変数名をAIをつけてくれるやつ',
    group: 'ai'
  },
  // {
  //   title: 'ブログ記事おたすけくん',
  //   url: 'https://article-generator.turai.work/',
  //   description: '箇条書きから文章をAIが自動生成',
  //   group: 'ai'
  // },
  {
    title: 'Twitter検索ヘルパー',
    url: 'https://t.turai.work/',
    description: 'ツイッター検索を便利にしてくれるやつ',
    group: 'tool'
  },
  {
    title: 'ポケモンタイプ相性チェッカー',
    url: 'https://poketype.turai.work/',
    description: 'フェアリーしか勝たん',
    group: 'tool'
  },
  {
    title: 'ガチャシュミレーター',
    url: 'https://gacha.turai.work/',
    description: 'スマホゲームなどのガチャ確率計算機',
    group: 'tool'
  },
  {
    title: 'どっちお得くん',
    url: 'https://otoku.turai.work/',
    description: '物価上昇を耐え抜け',
    group: 'tool'
  },
  // {
  //   title: 'スプラトゥーン3 射程比較表',
  //   url: 'https://spla3.turai.work/',
  //   description: 'スプラ 洗濯機 消す方法 [検索]',
  //   group: 'old'
  // },
  {
    title: 'メルカリ除外キーワード',
    url: 'https://chromewebstore.google.com/detail/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E9%99%A4%E5%A4%96%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89/edagpkikgijeoeaijgohpojmihffhljl',
    description: 'メルカリで除外キーワードを使えるようにするChrome拡張機能',
    group: 'old'
  },
  {
    title: 'Mantine Components Gallery',
    url: 'https://thr3a.github.io/mantine-cheatsheets/',
    description: 'Mantineはいいぞ',
    group: 'old'
  },
  // {
  //   "title": "Twitter Profile Auto Generator",
  //   "url": "https://github.com/thr3a/twitter-profile-auto-generator",
  //   "description": "@amanekeyの紹介文はこれで自動生成してる"
  // },
  {
    title: 'バグ文字コピペセンター',
    url: 'https://thr3a.github.io/invalid-char-collections/',
    description: 'エラー処理していないアプリをバグらせていこう',
    group: 'dev'
  },
  {
    title: 'docker-build-station',
    url: 'https://github.com/thr3a/docker-build-station',
    description: '毎日新鮮なイメージをお届けします',
    group: 'dev'
  },
  {
    title: 'はてなブログ芝生',
    url: 'https://hatena.turai.work/',
    description: 'はてなブログの投稿数でGitHubの草を生やそうｗｗｗ',
    group: 'tool'
  }
  // {
  //   title: 'アートWiki',
  //   url: 'https://wiki.turai.work/',
  //   description: '西洋絵画個人的まとめwiki',
  //   group: 'tool'
  // }
];
