export type WorkProps = {
  title: string;
  url: string;
  description: string;
  group: 'ai' | 'tool' | 'dev' | 'old' | 'book';
};

export const WorkData: WorkProps[] = [
  {
    title: 'レストランメニュー解説くん',
    url: 'https://ai.turai.work/describe-menu/',
    description: '海外旅行もこれで安心',
    group: 'ai'
  },
  {
    title: 'rubocop-rspec_enforce_description',
    url: 'https://github.com/thr3a/rubocop-rspec_enforce_description',
    description: 'RSpecの説明が「〜こと」で終わっていること',
    group: 'dev'
  },
  {
    title: 'EPUBテキスト変換ツール',
    url: 'https://epub.turai.work/',
    description: 'EPUBをテキストに必要な章だけダウンロード',
    group: 'tool'
  },
  {
    title: '神話4択クイズ',
    url: 'https://ai.turai.work/art-quiz/',
    description: '４択クイズで絵画知識を学ぼう',
    group: 'tool'
  },
  {
    title: 'TailwindCSS UI生成ツール',
    url: 'https://ai.turai.work/html-ui/',
    description: 'TailwindCSS対応のHTMLを作れるよ',
    group: 'dev'
  },
  {
    title: 'パスワード一括生成ツール',
    url: 'https://turai.work/password/',
    description: '安全なパスワードを一括で作成します。',
    group: 'dev'
  },
  {
    title: 'E-Paper Image tool',
    url: 'https://epaper.turai.work/',
    description: '電子ペーパー用の画像に変換ツール',
    group: 'dev'
  },
  {
    title: 'llm-token-count',
    url: 'https://github.com/thr3a/llm-token-count',
    description: '文字列のLLMトークン数をカウントするツール',
    group: 'dev'
  },
  {
    title: 'LibreChat質問部屋',
    url: 'https://ai.turai.work/docs-librechat/',
    description: '公式ドキュメントに基づいてAIがLibreChatをサポート',
    group: 'dev'
  },
  {
    title: 'mise質問部屋',
    url: 'https://ai.turai.work/docs-mise/',
    description: '公式ドキュメントに基づいてAIがmiseをサポート',
    group: 'dev'
  },
  {
    title: 'Kamal質問部屋',
    url: 'https://ai.turai.work/docs-kamal/',
    description: '公式ドキュメントに基づいてAIがKamalサポート',
    group: 'dev'
  },
  {
    title: 'repo-to-text',
    url: 'https://github.com/thr3a/repo-to-text',
    description: 'LLM用にソースコードをテキストに変換するツール',
    group: 'dev'
  },
  {
    title: 'remove-markdown-links',
    url: 'https://github.com/thr3a/remove-markdown-links',
    description: 'LLM用にリンクを除去するMarkdown整形ツール',
    group: 'dev'
  },
  {
    title: 'PDFメタデータビューアー',
    url: 'https://pdf-metadata.turai.work/',
    description: 'プレスリリースの最終更新日時が深夜ってことは…？',
    group: 'tool'
  },
  {
    title: 'Amazon banana',
    url: 'https://chromewebstore.google.com/detail/amazon-banana/bimgbejbhnlaeapccdejdgnjfcembnjj?authuser=0&hl=ja',
    description: 'Amazon販売ページのウザい表示を抹消するChrome拡張機能',
    group: 'tool'
  },
  {
    title: 'ポケポケ ガチャシュミレーター',
    url: 'https://gacha.turai.work/pokepoke.html',
    description: 'ミューツーexください😭',
    group: 'tool'
  },
  {
    title: 'sie; TechBook vol.2',
    url: 'https://techbookfest.org/product/jECrnrUCE2sW1Sg9Xn1KrY',
    description: '格安感熱式プリンターで遊ぶ',
    group: 'book'
  },
  {
    title: 'sie; TechBook vol.1',
    url: 'https://techbookfest.org/product/i0PDp1UKf9jMPXN4JRDCj0?productVariantID=i5cQdNGaWEmXvz75J7jFdm',
    description: '生成AIにエビフライ学習させてみた',
    group: 'book'
  },
  {
    title: 'ビジネスフレームワーク提案くん',
    url: 'https://ai.turai.work/business-framework/',
    description: '最適なビジネスフレームワークを教えてくれる',
    group: 'ai'
  },
  {
    title: '無知フクロウ二次創作ジェネレーター',
    url: 'https://ai.turai.work/muchifuku/',
    description: 'AIなんも分かんないプー',
    group: 'ai'
  },
  {
    title: 'AI討論コロシアム',
    url: 'https://ai.turai.work/arena/',
    description: 'ChatGPT Vs ChatGPT',
    group: 'ai'
  },
  {
    title: 'AI大阪弁変換くん',
    url: 'https://ai.turai.work/kansai/',
    description: 'えらいこっちゃ、AIがなんやら大阪弁しゃべりよる！',
    group: 'ai'
  },
  {
    title: 'クソリプジェネレーター',
    url: 'https://ai.turai.work/kusoreply/',
    description: 'ChatGPTの無駄遣い',
    group: 'ai'
  },
  {
    title: 'ダジャレべた褒めジェネレーター',
    url: 'https://ai.turai.work/owen-reply/',
    description: 'ダジャレxAIで自己肯定感を高めるソリューション',
    group: 'ai'
  },
  {
    title: 'Terraform code builder',
    url: 'https://ai.turai.work/terraform/',
    description: 'Terraformのコードをつくってくれるやつ',
    group: 'ai'
  },
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
