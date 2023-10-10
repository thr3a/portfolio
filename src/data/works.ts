export type WorkProps = {
  title: string
  url: string
  description: string
  group: 'ai' | 'tool' | 'dev'
};

export const WorkData: WorkProps[] = [
  {
    title: '言い換えAI',
    url: 'https://ai.turai.work/paraphrase/',
    description: '単語/文章をシチュエーションに合わせてChatGPTが変換',
    group: 'ai'
  },
  {
    title: '検索キーワード作成くん',
    url: 'https://ai.turai.work/ggr-en',
    description: '英語でググりたいときにいい感じに翻訳',
    group: 'ai'
  },
  {
    title: 'AI議論コロシアム',
    url: 'https://debate-simulator.turai.work/',
    description: 'お題入れるとAさんとBさんが自動で真面目な議論始めて面白い',
    group: 'ai'
  },
  {
    title: '命名先生',
    url: 'https://meimei-sensei.turai.work/',
    description: '変数名をAIをつけてくれるやつ',
    group: 'ai'
  },
  {
    title: 'ブログ記事おたすけくん',
    url: 'https://article-generator.turai.work/',
    description: '箇条書きから文章をAIが自動生成',
    group: 'ai'
  },
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
  {
    title: 'スプラトゥーン3 射程比較表',
    url: 'https://spla3.turai.work/',
    description: 'スプラ 洗濯機 消す方法 [検索]',
    group: 'tool'
  },
  // {
  //   "title": "メルカリ除外キーワード",
  //   "url": "https://chrome.google.com/webstore/detail/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E9%99%A4%E5%A4%96%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89/edagpkikgijeoeaijgohpojmihffhljl",
  //   "description": "メルカリで除外キーワードを使えるようにするChrome拡張機能"
  // },
  {
    title: 'Mantine Components Gallery',
    url: 'https://thr3a.github.io/mantine-cheatsheets/',
    description: 'Mantineはいいぞ',
    group: 'dev'
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
  }
];
