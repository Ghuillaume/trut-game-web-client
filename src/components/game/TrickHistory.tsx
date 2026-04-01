import type { CompletedTrickView } from '../../types/game';
import './TrickHistory.css';

interface TrickHistoryProps {
  completedTricks: CompletedTrickView[];
  myTeam: string;
  maxTricks: number;
}

export function TrickHistory({ completedTricks, myTeam, maxTricks }: TrickHistoryProps) {
  const slots = Array.from({ length: maxTricks }, (_, i) => {
    const trick = completedTricks[i];
    if (!trick) return { icon: '⬜', cls: 'trick-empty', label: `Pli ${i + 1}` };
    if (trick.winnerTeam === null) return { icon: '💀', cls: 'trick-pourri', label: `Pli ${i + 1}` };
    if (trick.winnerTeam === myTeam) return { icon: '✅', cls: 'trick-won', label: `Pli ${i + 1}` };
    return { icon: '❌', cls: 'trick-lost', label: `Pli ${i + 1}` };
  });

  return (
    <div className="trick-history" data-testid="trick-history">
      {slots.map((slot, i) => (
        <div key={i} className={`trick-slot ${slot.cls}`}>
          <span className="trick-dot">{slot.icon}</span>
          <span className="trick-label">{slot.label}</span>
        </div>
      ))}
    </div>
  );
}
