import type { ScoreView, PlayerView } from '../../types/game';
import './ScoreBoard.css';

interface ScoreBoardProps {
  score: Record<string, ScoreView>;
  myTeam: string;
  roundNumber: number;
  fortial: boolean;
  players: PlayerView[];
}

export function ScoreBoard({ score, myTeam, roundNumber, fortial }: ScoreBoardProps) {
  const myScore = score[myTeam] ?? { grands: 0, petits: 0 };
  const opponentTeam = Object.keys(score).find(t => t !== myTeam) ?? '';
  const opScore = score[opponentTeam] ?? { grands: 0, petits: 0 };

  return (
    <div className="score-board" data-testid="score-board">
      <div className="score-round">Manche {roundNumber}</div>
      <div className="score-row">
        <span className="score-label">Nous</span>
        <div className="score-bars">
          <div className="score-grands">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`score-grand-bar ${i < myScore.grands ? 'filled' : 'empty'}`} />
            ))}
          </div>
          <div className="score-separator" />
          <div className="score-petits">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={`score-petit-dot ${i < myScore.petits ? 'filled' : 'empty'}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="score-row">
        <span className="score-label">Eux</span>
        <div className="score-bars">
          <div className="score-grands">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`score-grand-bar ${i < opScore.grands ? 'filled' : 'empty'}`} />
            ))}
          </div>
          <div className="score-separator" />
          <div className="score-petits">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={`score-petit-dot ${i < opScore.petits ? 'filled' : 'empty'}`} />
            ))}
          </div>
        </div>
      </div>
      {fortial && <div className="score-fortial" data-testid="fortial-indicator">⚡ Fortial !</div>}
    </div>
  );
}
