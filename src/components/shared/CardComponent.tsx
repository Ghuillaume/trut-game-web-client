import { cardLabel, suitColor } from '../../types/game';
import './CardComponent.css';

interface CardComponentProps {
  cardId?: string;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
  mini?: boolean;
}

export function CardComponent({ cardId, faceDown, selected, onClick, small, mini }: CardComponentProps) {
  const sizeClass = mini ? 'card-mini' : small ? 'card-small' : '';

  if (faceDown || !cardId) {
    return (
      <div className={`card card-back ${sizeClass}`}>
        <span className="card-back-design">🂠</span>
      </div>
    );
  }

  const color = suitColor(cardId);
  const label = cardLabel(cardId);

  return (
    <div
      className={`card card-face ${color} ${selected ? 'card-selected' : ''} ${sizeClass} ${onClick ? 'card-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      data-testid={`card-${cardId}`}
    >
      <span className="card-label">{label}</span>
    </div>
  );
}
