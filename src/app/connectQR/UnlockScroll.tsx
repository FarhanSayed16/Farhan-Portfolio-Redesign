'use client';

import { useEffect } from 'react';

/** Farhan OS locks html/body overflow — restore scrolling for this route only. */
export default function UnlockScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
    };

    html.style.overflow = 'auto';
    html.style.height = 'auto';
    body.style.overflow = 'auto';
    body.style.height = 'auto';
    html.classList.add('cq-unlocked');
    body.classList.add('cq-unlocked');

    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.height = prev.htmlHeight;
      body.style.overflow = prev.bodyOverflow;
      body.style.height = prev.bodyHeight;
      html.classList.remove('cq-unlocked');
      body.classList.remove('cq-unlocked');
    };
  }, []);

  return null;
}
