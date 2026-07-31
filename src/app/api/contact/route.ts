import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/apiRateLimit';
import { getEmailAddress } from '@/lib/content';

export const runtime = 'nodejs';

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company_website?: string;
  /** Client will FormSubmit itself when server path can't (CF blocks FormSubmit from Vercel). */
  clientFallback?: boolean;
};

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

/**
 * Contact API.
 * - With WEB3FORMS_ACCESS_KEY: sends from the server (reliable on Vercel).
 * - Without: rate-limits + validates, then tells the client to FormSubmit from the browser
 *   (FormSubmit blocks Vercel IPs with a Cloudflare challenge).
 */
export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, { limit: 8, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a minute.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad('Invalid request');
  }

  if (body.company_website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim().slice(0, 200);
  const subject = (body.subject || '').trim().slice(0, 200);
  const message = (body.message || '').trim().slice(0, 5000);

  if (!subject || !message) return bad('Subject and message are required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad('A valid reply email is required');
  }

  const to = getEmailAddress();
  if (!to) return bad('Inbox not configured', 500);

  const web3Key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (web3Key) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          name: name || 'Portfolio visitor',
          email,
          subject: `[Farhan OS] ${subject}`,
          message,
          from_name: 'Farhan OS Contact',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || data.success === false) {
        return bad(data.message || 'Failed to send message', 502);
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error('Web3Forms send failed', err);
      return bad('Failed to send message', 502);
    }
  }

  // No Web3Forms — client must FormSubmit (server → formsubmit.co hits Cloudflare).
  if (body.clientFallback) {
    return NextResponse.json({ ok: true, useClient: true });
  }

  return NextResponse.json(
    {
      error:
        'Email relay needs a browser submit, or set WEB3FORMS_ACCESS_KEY on the server.',
      useClient: true,
    },
    { status: 502 }
  );
}
