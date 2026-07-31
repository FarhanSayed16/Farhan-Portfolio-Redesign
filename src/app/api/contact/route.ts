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
};

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

/**
 * Contact → FormSubmit.
 * FormSubmit requires a real Origin/Referer (browser page). Server-only fetches
 * without those headers return a fake-looking 200 that never emails anyone.
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

  // Prefer Web3Forms when configured — more reliable than FormSubmit activation.
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

  const origin = request.headers.get('origin') || 'http://localhost:3000';
  const referer = request.headers.get('referer') || `${origin}/`;

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: origin,
        Referer: referer,
      },
      body: JSON.stringify({
        name: name || 'Portfolio visitor',
        email,
        _replyto: email,
        subject: `[Farhan OS] ${subject}`,
        message,
        _template: 'table',
        _captcha: 'false',
        _url: referer,
      }),
    });

    const raw = await res.text();
    let data: { success?: string | boolean; message?: string } = {};
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      console.error('FormSubmit non-JSON', raw.slice(0, 200));
      return bad('Failed to send message', 502);
    }

    const ok = data.success === true || data.success === 'true';
    const msg = (data.message || '').toLowerCase();

    // Activation pending — FormSubmit emailed the inbox owner; treat as soft success with instructions.
    if (!ok && msg.includes('activation')) {
      return NextResponse.json({
        ok: true,
        needsActivation: true,
        message:
          'Check farhanbuilds16@gmail.com (and Spam/Promotions) for a FormSubmit “Activate Form” email, then click Activate. After that, messages will arrive.',
      });
    }

    if (!ok) {
      console.error('FormSubmit rejected', data);
      return bad(data.message || 'Failed to send message', 502);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact send failed', err);
    return bad('Failed to send message', 502);
  }
}
