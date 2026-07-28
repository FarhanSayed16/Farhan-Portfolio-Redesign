'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { getEmailAddress, getMailtoHref } from '@/lib/content';

/**
 * Contact — Outlook-style compose form with EmailJS or mailto fallback.
 */
export default function ContactWindow() {
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) return;

    // Check if EmailJS env vars are set
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        setStatus('sending');
        const emailjs = await import('@emailjs/browser');
        await emailjs.send(serviceId, templateId, {
          from_name: fromName,
          from_email: fromEmail,
          subject,
          message: body,
        }, publicKey);
        setStatus('sent');
      } catch {
        setStatus('error');
      }
    } else {
      window.open(getMailtoHref(subject, body), '_blank');
      setStatus('mailto');
    }
  }, [fromName, fromEmail, subject, body]);

  if (status === 'sent' || status === 'mailto') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '2rem' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#006600' }}>
          {status === 'sent' ? 'MESSAGE SENT!' : 'MAIL CLIENT OPENED'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
          {status === 'sent'
            ? "Thanks for reaching out. I'll get back to you soon."
            : 'Finish sending in your mail app, or compose another message here.'}
        </div>
        <button onClick={() => { setStatus('idle'); setSubject(''); setBody(''); }} className="os-button" style={{ marginTop: '0.5rem' }}>
          Compose Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header fields */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--os-border)', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
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
            placeholder="your@email.com"
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

      {/* Body */}
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

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderTop: '1px solid #c0c0c0', flexShrink: 0, background: '#ece9d8' }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="os-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Send size={13} />
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        <button type="button" className="os-button" style={{ opacity: 0.6 }} title="Decorative">
          <Paperclip size={13} /> Attach Resume
        </button>
        {status === 'error' && (
          <span style={{ fontSize: '11px', color: '#c00', marginLeft: 'auto' }}>
            Failed to send. Try again.
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
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {children}
      </div>
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
