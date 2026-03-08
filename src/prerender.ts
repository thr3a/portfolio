// ビルド時プリレンダリング用スクリプト
// vite-prerender-plugin が呼び出し、各ルートの静的HTMLとhead要素を生成する

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

const IMAGE_EDITOR_TITLE = 'モザイク加工ツール';
const IMAGE_EDITOR_DESCRIPTION = 'なぞったところにモザイクかけられる無料の画像モザイクツール';
const IMAGE_EDITOR_URL = 'https://turai.work/image-editor';
const IMAGE_EDITOR_OGP_IMAGE = 'https://turai.work/ogp/image-editor.jpg';

// ルートごとのhead設定マップ
const routeHeadMap: Record<string, PrerenderResult['head']> = {
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
