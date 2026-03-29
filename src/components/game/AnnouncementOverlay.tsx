import { useEffect, useState } from 'react';
import './AnnouncementOverlay.css';

interface AnnouncementOverlayProps {
  text: string;
  type: 'trut' | 'deux-pareilles' | 'brellan' | 'pourri';
  onDone: () => void;
}

export function AnnouncementOverlay({ text, type, onDone }: AnnouncementOverlayProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('visible'), 50);
    const exitTimer = setTimeout(() => setPhase('exit'), 2200);
    const doneTimer = setTimeout(onDone, 2800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const icon = type === 'pourri' ? '💀' : type === 'brellan' ? '🃏' : type === 'deux-pareilles' ? '✌️' : '🤜';

  return (
    <div className={`announcement-overlay announcement-${phase} announcement-${type}`} data-testid="announcement-overlay">
      <div className="announcement-content">
        <span className="announcement-icon">{icon}</span>
        <span className="announcement-text">{text}</span>
      </div>
    </div>
  );
}
