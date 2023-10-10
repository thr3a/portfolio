import fs from 'fs';
import dayjs from 'dayjs';
import { WorkData } from '../data/works';

function createSitemap (urls: string[]): string {
  const now = dayjs();
  const iso8601 = now.format('YYYY-MM-DDTHH:mm:ssZ');

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    sitemap += '<url>\n';
    sitemap += `<loc>${url}</loc>\n`;
    sitemap += `<lastmod>${iso8601}</lastmod>\n`;
    sitemap += '</url>\n';
  }

  sitemap += '</urlset>';
  return sitemap;
}

const urls = WorkData.filter((data) => data.url.includes('turai.work')).map(x => x.url);
const testSitemap = createSitemap(urls);
fs.writeFileSync('dist/sitemap.xml', testSitemap);
