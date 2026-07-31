/**
 * Browser → FormSubmit. Server-side FormSubmit from Vercel is blocked by Cloudflare
 * (“Just a moment…” HTML), so contact forms must post from the client.
 */
import { getEmailAddress } from '@/lib/content';

const COOLDOWN_MS = 30_000;
let lastSentAt = 0;

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — if filled, pretend success and skip send */
  company_website?: string;
};

export type ContactSendResult =
  | { ok: true }
  | { ok: true; needsActivation: true; message: string }
  | { ok: false; error: string; cooldown?: true };

export async function sendContactMessage(payload: ContactPayload): Promise<ContactSendResult> {
  if (payload.company_website?.trim()) {
    return { ok: true };
  }

  const name = payload.name.trim().slice(0, 120);
  const email = payload.email.trim().slice(0, 200);
  const subject = payload.subject.trim().slice(0, 200);
  const message = payload.message.trim().slice(0, 5000);

  if (!subject || !message) return { ok: false, error: 'Subject and message are required' };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'A valid reply email is required' };
  }

  const now = Date.now();
  if (now - lastSentAt < COOLDOWN_MS) {
    return { ok: false, error: 'Please wait a moment before sending again.', cooldown: true };
  }

  const to = getEmailAddress();
  if (!to) return { ok: false, error: 'Inbox not configured' };

  // Prefer server Web3Forms when available (no CF issue). Falls through to FormSubmit.
  try {
    const apiRes = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        company_website: payload.company_website || '',
        clientFallback: true,
      }),
    });
    const data = (await apiRes.json().catch(() => ({}))) as {
      ok?: boolean;
      useClient?: boolean;
      error?: string;
      needsActivation?: boolean;
      message?: string;
    };

    if (apiRes.ok && data.ok && !data.useClient) {
      lastSentAt = Date.now();
      if (data.needsActivation) {
        return {
          ok: true,
          needsActivation: true,
          message:
            data.message ||
            'Check farhanbuilds16@gmail.com (and Spam) for FormSubmit’s Activate email, then click it.',
        };
      }
      return { ok: true };
    }

    // 429 / validation from API
    if (apiRes.status === 429 || (apiRes.status === 400 && data.error)) {
      return apiRes.status === 429
        ? { ok: false, error: data.error || 'Failed to send.', cooldown: true }
        : { ok: false, error: data.error || 'Failed to send.' };
    }

    // useClient or FormSubmit-blocked 502 → browser FormSubmit below
    if (!data.useClient && apiRes.ok === false && apiRes.status !== 502) {
      // unexpected — still try client FormSubmit
    }
  } catch {
    // offline API — try FormSubmit directly
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name || 'Portfolio visitor',
        email,
        _replyto: email,
        subject: `[Farhan OS] ${subject}`,
        message,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const raw = await res.text();
    let data: { success?: string | boolean; message?: string } = {};
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      return { ok: false, error: 'Failed to send message. Try again in a moment.' };
    }

    const ok = data.success === true || data.success === 'true';
    const msg = (data.message || '').toLowerCase();

    if (!ok && msg.includes('activation')) {
      lastSentAt = Date.now();
      return {
        ok: true,
        needsActivation: true,
        message:
          'Check farhanbuilds16@gmail.com (and Spam/Promotions) for a FormSubmit “Activate Form” email, then click Activate. After that, messages will arrive.',
      };
    }

    if (!ok) {
      return { ok: false, error: data.message || 'Failed to send message' };
    }

    lastSentAt = Date.now();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Failed to send. Check your connection and try again.' };
  }
}
