'use client';

import dynamic from 'next/dynamic';
import { usePhone } from '@/context/PhoneContext';
import { MobileControls } from './MobileControls';
import { X } from 'lucide-react';

const GameWrapper = dynamic(() => import('@/components/shared/GameWrapper'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'var(--nokia-green)',
        fontFamily: 'var(--font-pixel)',
        fontSize: '10px',
      }}
    >
      LOADING...
    </div>
  ),
});

export default function PhoneGame() {
  const { navigate } = usePhone();

  return (
    <div className="w-full h-full bg-black relative flex flex-col">
      <div className="flex-1 min-h-0 relative">
        <GameWrapper
          platform="mobile"
          onClose={() => navigate('menu')}
          onHire={() => navigate('contact')}
        />
      </div>
      <MobileControls />
      <button
        type="button"
        onClick={() => navigate('menu')}
        className="absolute top-1 right-1 w-7 h-7 bg-red-600/80 rounded-full flex items-center justify-center border border-white/50 z-50"
        aria-label="Exit game"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
