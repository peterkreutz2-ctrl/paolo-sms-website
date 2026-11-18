import { SITE_URL } from '../config';

// Statisch erzeugt (sitemap.xml): alle Seiten unter src/pages/ außer 404 und den
// Dateiendpunkten (robots.txt, sitemap.xml). Ohne Zusatzpaket.
const files = import.meta.glob('./*.astro', { eager: false });

export function GET() {
  const paths = Object.keys(files)
    .map((f) => f.replace('./', '').replace('.astro', ''))
    .filter((n) => n !== '404')
    .map((n) => (n === 'index' ? '/' : `/${n}/`))
    .sort();
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
