'use client';

import { useState, useCallback, useRef, type FormEvent } from 'react';

const COOLDOWN_MS = 30_000;

type Status = 'idle' | 'sending' | 'sent' | 'activate' | 'error' | 'cooldown';

type Props = {
  onDone?: () => void;
};

/** Mobile / dark portfolio compose → POST /api/contact (FormSubmit). */
export default function ContactForm({ onDone }: Props) {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [activateHint, setActivateHint] = useState('');
  const lastSentAt = useRef(0);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorText('');
      setActivateHint('');

      if (honeypot.trim()) return;
      if (!subject.trim() || !body.trim()) return;
      if (!fromEmail.trim()) {
        setStatus('error');
        setErrorText('Please enter your email so I can reply.');
        return;
      }

      const now = Date.now();
      if (now - lastSentAt.current < COOLDOWN_MS) {
        setStatus('cooldown');
        return;
      }

      try {
        setStatus('sending');
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fromName,
            email: fromEmail,
            subject,
            message: body,
            company_website: honeypot,
          }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          needsActivation?: boolean;
          message?: string;
        };

        if (!res.ok) {
          setStatus('error');
          setErrorText(data.error || 'Failed to send. Try again.');
          return;
        }

        lastSentAt.current = Date.now();
        if (data.needsActivation) {
          setActivateHint(
            data.message ||
              'Check your Gmail (and Spam) for FormSubmit’s Activate email, then click it.'
          );
          setStatus('activate');
          return;
        }
        setStatus('sent');
      } catch {
        setStatus('error');
        setErrorText('Failed to send. Check your connection and try again.');
      }
    },
    [fromName, fromEmail, subject, body, honeypot]
  );

  if (status === 'sent' || status === 'activate') {
    return (
      <div className="mps-contact-done">
        <div className={`mps-contact-done-title${status === 'activate' ? ' is-activate' : ''}`}>
          {status === 'activate' ? 'ONE MORE STEP' : 'MESSAGE SENT!'}
        </div>
        <p className="mps-contact-done-copy">
          {status === 'activate'
            ? activateHint
            : "Thanks for reaching out. I'll get back to you soon."}
        </p>
        <button
          type="button"
          className="cyber-btn-secondary"
          onClick={() => {
            setStatus('idle');
            if (status === 'sent') {
              setSubject('');
              setBody('');
            }
            onDone?.();
          }}
        >
          {status === 'activate' ? 'Back' : 'Send another'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mps-contact-form">
      <div aria-hidden className="mps-contact-honeypot">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <input
        type="text"
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
        placeholder="Your name"
        className="mps-contact-input"
        autoComplete="name"
      />
      <input
        type="email"
        value={fromEmail}
        onChange={(e) => setFromEmail(e.target.value)}
        placeholder="your@email.com *"
        required
        className="mps-contact-input"
        autoComplete="email"
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject *"
        required
        className="mps-contact-input"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Your message… *"
        required
        rows={5}
        className="mps-contact-textarea"
      />

      <button type="submit" disabled={status === 'sending'} className="cyber-btn-primary mps-contact-submit">
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && <p className="mps-contact-status is-error">{errorText || 'Failed to send.'}</p>}
      {status === 'cooldown' && (
        <p className="mps-contact-status">Please wait a moment before sending again.</p>
      )}
    </form>
  );
}
