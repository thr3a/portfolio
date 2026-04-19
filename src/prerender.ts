// vite-prerender-plugin が呼び出し、各ルートの静的HTMLとhead要素を生成する
// 重要: パスを追加した場合はvite.config.tsにも追記必要!

type HeadElement = {
  type: string;
  props: Record<string, string>;
};

type PrerenderResult = {
  html: string;
  head?: {
    title?: string;
    elements?: Set<HeadElement>;
  };
};

type PrerenderData = {
  url: string;
};

const KNIGHTS_KNAVES_TITLE = '正直者と嘘つき者パズル';
const KNIGHTS_KNAVES_DESCRIPTION =
  '正直者と嘘つき者が混在する島のパズル。全員の発言から誰が正直者かを推理する無料の論理パズルゲーム';
const KNIGHTS_KNAVES_URL = 'https://turai.work/knights-knaves';

const IMAGE_EDITOR_TITLE = 'モザイク加工ツール';
const IMAGE_EDITOR_DESCRIPTION = 'なぞったところにモザイクかけられる無料の画像モザイクツール';
const IMAGE_EDITOR_URL = 'https://turai.work/image-editor';
const IMAGE_EDITOR_OGP_IMAGE = 'https://turai.work/ogp/image-editor.jpg';

const PASSWORD_TITLE = 'パスワード一括生成ツール';
const PASSWORD_DESCRIPTION = '文字数や使える文字など、細かい条件を指定して安全なパスワードを一括作成できる無料ツール';
const PASSWORD_URL = 'https://turai.work/password';

const routeHeadMap: Record<string, PrerenderResult['head']> = {
  '/knights-knaves': {
    title: KNIGHTS_KNAVES_TITLE,
    elements: new Set<HeadElement>([
      { type: 'meta', props: { name: 'description', content: KNIGHTS_KNAVES_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:title', content: KNIGHTS_KNAVES_TITLE } },
      { type: 'meta', props: { property: 'og:description', content: KNIGHTS_KNAVES_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:url', content: KNIGHTS_KNAVES_URL } },
      { type: 'meta', props: { property: 'og:type', content: 'website' } },
      { type: 'meta', props: { property: 'og:site_name', content: 'turai.work' } },
      { type: 'meta', props: { name: 'twitter:card', content: 'summary' } },
      { type: 'meta', props: { name: 'twitter:title', content: KNIGHTS_KNAVES_TITLE } },
      { type: 'meta', props: { name: 'twitter:description', content: KNIGHTS_KNAVES_DESCRIPTION } }
    ])
  },
  '/password': {
    title: PASSWORD_TITLE,
    elements: new Set<HeadElement>([
      { type: 'meta', props: { name: 'description', content: PASSWORD_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:title', content: PASSWORD_TITLE } },
      { type: 'meta', props: { property: 'og:description', content: PASSWORD_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:url', content: PASSWORD_URL } },
      { type: 'meta', props: { property: 'og:type', content: 'website' } },
      { type: 'meta', props: { property: 'og:site_name', content: 'turai.work' } },
      { type: 'meta', props: { name: 'twitter:card', content: 'summary' } },
      { type: 'meta', props: { name: 'twitter:title', content: PASSWORD_TITLE } },
      { type: 'meta', props: { name: 'twitter:description', content: PASSWORD_DESCRIPTION } }
    ])
  },
  '/image-editor': {
    title: IMAGE_EDITOR_TITLE,
    elements: new Set<HeadElement>([
      { type: 'meta', props: { name: 'description', content: IMAGE_EDITOR_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:title', content: IMAGE_EDITOR_TITLE } },
      { type: 'meta', props: { property: 'og:description', content: IMAGE_EDITOR_DESCRIPTION } },
      { type: 'meta', props: { property: 'og:url', content: IMAGE_EDITOR_URL } },
      { type: 'meta', props: { property: 'og:type', content: 'website' } },
      { type: 'meta', props: { property: 'og:site_name', content: 'turai.work' } },
      { type: 'meta', props: { property: 'og:image', content: IMAGE_EDITOR_OGP_IMAGE } },
      { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
      { type: 'meta', props: { name: 'twitter:title', content: IMAGE_EDITOR_TITLE } },
      { type: 'meta', props: { name: 'twitter:description', content: IMAGE_EDITOR_DESCRIPTION } },
      { type: 'meta', props: { name: 'twitter:image', content: IMAGE_EDITOR_OGP_IMAGE } }
    ])
  }
};

export const prerender = (data: PrerenderData): PrerenderResult => {
  const head = routeHeadMap[data.url];
  return {
    html: '',
    ...(head ? { head } : {})
  };
};
