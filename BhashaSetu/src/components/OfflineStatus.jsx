import { useEffect, useState } from 'react';
import { LuWifiOff } from 'react-icons/lu';
import { CloudCheck } from './icons';
import { useVoice } from '../context/VoiceContext';

function useOnline() {
  const [on, setOn] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const u = () => setOn(true);
    const d = () => setOn(false);
    window.addEventListener('online', u);
    window.addEventListener('offline', d);
    return () => {
      window.removeEventListener('online', u);
      window.removeEventListener('offline', d);
    };
  }, []);
  return on;
}

/**
 * Offline status component with live ML model readiness indicator.
 */
export default function OfflineStatus({ variant = 'pill' }) {
  const online = useOnline();
  const v = useVoice();
  const isMlReady = v?.isBackendLive;

  if (variant === 'card') {
    return (
      <div className="offline offline--card">
        <CloudCheck size={42} />
        <div>
          <p className="offline__title">
            {isMlReady ? 'mT5 Model Online' : 'Offline Mode'}{' '}
            <span className="offline__state">
              <i style={{ background: isMlReady ? '#16a36a' : undefined }} />{' '}
              {isMlReady ? 'Active ML' : 'Ready'}
            </span>
          </p>
          <p className="offline__sub">
            {isMlReady
              ? 'Local Hindi ↔ Mundari mT5 model connected'
              : 'Core features available without internet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`offline offline--${variant}`} role="status">
      {isMlReady ? (
        <i className="offline__dot" style={{ background: '#16a36a' }} />
      ) : online ? (
        <i className="offline__dot" />
      ) : (
        <LuWifiOff size={14} />
      )}
      <span>{isMlReady ? 'mT5 Model Active' : online ? 'Offline Ready' : 'Working offline'}</span>
    </div>
  );
}
