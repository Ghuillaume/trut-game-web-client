import type { ScoreView } from '../../types/game';
import { TokenDisplay } from '../shared/TokenDisplay';
import './ScoreBoard.css';

interface ScoreBoardProps {
  score: Record<string, ScoreView>;
  myTeam: string;
  roundNumber: number;
  fortial: boolean;
}

export function ScoreBoard({ score, myTeam, roundNumber, fortial }: ScoreBoardProps) {
  return (
    <div className="score-board" data-testid="score-board">
      <div className="score-round">Manche {roundNumber}</div>
      <div className="score-teams">
        {Object.entries(score).map(([team, sv]) => (
          <TokenDisplay
            key={team}
            label={team === myTeam ? `${team} (Moi)` : team}
            score={sv}
            highlight={team === myTeam}
          />
        ))}
      </div>
      {fortial && <div className="score-fortial" data-testid="fortial-indicator">⚡ Fortial !</div>}
    </div>
  );
}
