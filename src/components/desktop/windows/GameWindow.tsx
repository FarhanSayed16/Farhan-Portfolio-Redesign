import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useWindows } from '@/context/WindowContext';

const GameWrapper = dynamic(() => import('@/components/shared/GameWrapper'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#06b6d4',
        fontFamily: 'monospace',
      }}
    >
      Loading Game Engine...
    </div>
  ),
});

export default function GameWindow({ windowId }: { windowId?: string }) {
  const { dispatch } = useWindows();
  const id = windowId || 'game';

  const onClose = useCallback(() => dispatch({ type: 'CLOSE', id }), [dispatch, id]);
  const onHire = useCallback(() => {
    dispatch({ type: 'CLOSE', id });
    dispatch({
      type: 'OPEN',
      id: 'contact',
      title: 'Contact — New Message',
      component: 'contact',
    });
  }, [dispatch, id]);

  return <GameWrapper platform="desktop" onClose={onClose} onHire={onHire} />;
}
