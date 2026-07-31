'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { getEmailAddress } from '@/lib/content';
import { sendContactMessage } from '@/lib/sendContactMessage';

/**
 * Contact — Outlook-style compose. Sends via FormSubmit from the browser
 * (Vercel serverless → FormSubmit is blocked by Cloudflare).
 */
export default function ContactWindow() {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'activate' | 'error' | 'cooldown'
  >('idle');
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: status === 'activate' ? '#0a246a' : '#006600',
            textAlign: 'center',
          }}
        >
          {status === 'activate' ? 'ONE MORE STEP' : 'MESSAGE SENT!'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 340 }}>
          {status === 'activate'
            ? activateHint
            : "Thanks for reaching out. I'll get back to you soon at your email."}
        </div>
        {status === 'activate' && (
          <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
            Look for mail from <b>FormSubmit</b> to <b>farhanbuilds16@gmail.com</b>. After you
            activate once, every future contact message lands in your inbox automatically.
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            if (status === 'sent') {
              setSubject('');
              setBody('');
            }
          }}
          className="os-button"
          style={{ marginTop: '0.5rem' }}
        >
          {status === 'activate' ? 'Back' : 'Compose Another'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
      >
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

      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--os-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <FieldRow label="From">
          <input
            type="text"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="Your Name"
            style={inputStyle}
          />
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="your@email.com *"
            required
            style={{ ...inputStyle, flex: 1 }}
          />
        </FieldRow>
        <FieldRow label="To">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 0' }}>
            {getEmailAddress()}
          </span>
        </FieldRow>
        <FieldRow label="Subject">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject *"
            required
            style={inputStyle}
          />
        </FieldRow>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your message here... *"
        required
        style={{
          flex: 1,
          padding: '12px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#000',
          fontSize: '13px',
          lineHeight: 1.6,
          fontFamily: 'var(--font-os)',
          resize: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderTop: '1px solid #c0c0c0',
          flexShrink: 0,
          background: '#ece9d8',
        }}
      >
        <button
          type="submit"
          disabled={status === 'sending'}
          className="os-button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Send size={13} />
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        <button type="button" className="os-button" style={{ opacity: 0.6 }} title="Decorative">
          <Paperclip size={13} /> Attach Resume
        </button>
        {status === 'error' && (
          <span style={{ fontSize: '11px', color: '#c00', marginLeft: 'auto', maxWidth: 220 }}>
            {errorText || 'Failed to send. Try again.'}
          </span>
        )}
        {status === 'cooldown' && (
          <span style={{ fontSize: '11px', color: '#666', marginLeft: 'auto' }}>
            {errorText || 'Please wait a moment before sending again.'}
          </span>
        )}
      </div>
    </form>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: 55, flexShrink: 0 }}>{label}:</span>
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '3px 6px',
  background: '#fff',
  borderTop: '1px solid #808080',
  borderLeft: '1px solid #808080',
  borderRight: '1px solid #fff',
  borderBottom: '1px solid #fff',
  boxShadow: 'inset 1px 1px 0 #000',
  borderRadius: 0,
  color: '#000',
  fontSize: '12px',
  outline: 'none',
  fontFamily: 'var(--font-os)',
};
