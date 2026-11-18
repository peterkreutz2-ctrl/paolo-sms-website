import { INDEXABLE, SITE_URL } from '../config';

// Statisch erzeugt (robots.txt). Folgt dem Schalter INDEXABLE in config.ts.
export function GET() {
  const body = INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
