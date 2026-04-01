import { cardLabel, suitColor } from '../../types/game';
import './CardComponent.css';

interface CardComponentProps {
  cardId?: string;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
  mini?: boolean;
  disabled?: boolean;
}

export function CardComponent({ cardId, faceDown, selected, onClick, small, mini, disabled }: CardComponentProps) {
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
  const isDisabled = disabled && onClick;
  const clickable = onClick && !disabled;

  return (
    <div
      className={`card card-face ${color} ${selected ? 'card-selected' : ''} ${sizeClass} ${clickable ? 'card-clickable' : ''} ${isDisabled ? 'card-disabled' : ''}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === 'Enter' && onClick() : undefined}
      data-testid={`card-${cardId}`}
    >
      <span className="card-label">{label}</span>
    </div>
  );
}
