import type { ScoreView, PlayerView } from '../../types/game';
import { teamPlayerNames } from '../../types/game';
import { TokenDisplay } from '../shared/TokenDisplay';
import './ScoreBoard.css';

interface ScoreBoardProps {
  score: Record<string, ScoreView>;
  myTeam: string;
  roundNumber: number;
  fortial: boolean;
  players: PlayerView[];
}

export function ScoreBoard({ score, myTeam, roundNumber, fortial, players }: ScoreBoardProps) {
  return (
    <div className="score-board" data-testid="score-board">
      <div className="score-round">Manche {roundNumber}</div>
      <div className="score-teams">
        {Object.entries(score).map(([team, sv]) => {
          const names = teamPlayerNames(players, team);
          const label = team === myTeam ? `${names} (Mon équipe)` : names;
          return (
            <TokenDisplay
              key={team}
              label={label}
              score={sv}
              highlight={team === myTeam}
            />
          );
        })}
      </div>
      {fortial && <div className="score-fortial" data-testid="fortial-indicator">⚡ Fortial !</div>}
    </div>
  );
}
