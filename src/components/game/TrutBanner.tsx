import type { TrutChallengeView, PlayerView } from '../../types/game';
import './TrutBanner.css';

interface TrutBannerProps {
  challenge: TrutChallengeView;
  players: PlayerView[];
}

function challengeLabel(type?: string): { icon: string; verb: string; className: string } {
  switch (type) {
    case 'DEUX_PAREILLES':
      return { icon: '✌️', verb: 'annonce deux pareilles une fausse !', className: 'trut-banner-deux-pareilles' };
    case 'BRELLAN':
      return { icon: '🃏', verb: 'annonce brelan !', className: 'trut-banner-brellan' };
    default:
      return { icon: '🤜', verb: 'a truté !', className: '' };
  }
}

export function TrutBanner({ challenge, players }: TrutBannerProps) {
  const challenger = players.find((p) => p.id === challenge.challengerId);
  const { icon, verb, className } = challengeLabel(challenge.challengeType);

  return (
    <div className={`trut-banner ${className}`} data-testid="trut-banner">
      <span className="trut-icon">{icon}</span>
      <span className="trut-text">
        <strong>{challenger?.pseudo ?? 'Quelqu\'un'}</strong> {verb}
      </span>
      <span className="trut-status">{challenge.status}</span>
    </div>
  );
}
