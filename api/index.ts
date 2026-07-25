import type { Request, Response } from 'express';
import { createApp } from '../server.js';

const appPromise = createApp();

export default async function handler(req: Request, res: Response) {
  // `vercel.json` forwards every /api/* request through this single function.
  // Restore the original Express route before handing the request to the app.
  const requestUrl = new URL(req.url || '/', 'https://vercel.local');
  const path = requestUrl.searchParams.get('path');
  if (path) {
    requestUrl.searchParams.delete('path');
    const query = requestUrl.searchParams.toString();
    req.url = `/api/${path}${query ? `?${query}` : ''}`;
  }

  const app = await appPromise;
  return app(req, res);
}
