'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { sendContactMessage } from '@/lib/sendContactMessage';

type Status = 'idle' | 'sending' | 'sent' | 'activate' | 'error' | 'cooldown';

type Props = {
  onDone?: () => void;
};

/** Mobile / dark portfolio compose → FormSubmit from the browser (Vercel can't). */
export default function ContactForm({ onDone }: Props) {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [activateHint, setActivateHint] = useState('');

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorText('');
      setActivateHint('');
      setStatus('sending');

      const result = await sendContactMessage({
        name: fromName,
        email: fromEmail,
        subject,
        message: body,
        company_website: honeypot,
      });

      if (!result.ok) {
        setStatus(result.cooldown ? 'cooldown' : 'error');
        setErrorText(result.error);
        return;
      }

      if ('needsActivation' in result && result.needsActivation) {
        setActivateHint(result.message);
        setStatus('activate');
        return;
      }

      setStatus('sent');
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
        <p className="mps-contact-status">{errorText || 'Please wait a moment before sending again.'}</p>
      )}
    </form>
  );
}
