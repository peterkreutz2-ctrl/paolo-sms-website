import type { APIRoute } from 'astro';
import { PROTOTYPE } from '../config';

export const GET: APIRoute = () => new Response(
  PROTOTYPE
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
