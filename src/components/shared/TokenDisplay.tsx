import type { ScoreView } from '../../types/game';
import './TokenDisplay.css';

interface TokenDisplayProps {
  label: string;
  score: ScoreView;
  highlight?: boolean;
}

export function TokenDisplay({ label, score, highlight }: TokenDisplayProps) {
  return (
    <div className={`token-display ${highlight ? 'token-highlight' : ''}`} data-testid={`score-${label}`}>
      <span className="token-team">{label}</span>
      <div className="token-values">
        <div className="token-group" title="Jetons longs (Trut)">
          <div className="token-grands-row">
            {Array.from({ length: score.grands }, (_, i) => (
              <span key={i} className="token-grand">TRUT</span>
            ))}
            {score.grands === 0 && <span className="token-empty">—</span>}
          </div>
          <span className="token-count">{score.grands}/7</span>
        </div>
        <div className="token-group" title="Petits (Pigeon)">
          <div className="token-petits-row">
            {Array.from({ length: score.petits }, (_, i) => (
              <span key={i} className="token-petit">Pigeon</span>
            ))}
            {score.petits === 0 && <span className="token-empty">—</span>}
          </div>
          <span className="token-count">{score.petits}/3</span>
        </div>
      </div>
    </div>
  );
}
