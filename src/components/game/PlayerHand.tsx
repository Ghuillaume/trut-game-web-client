import { CardComponent } from '../shared/CardComponent';
import './PlayerHand.css';

interface PlayerHandProps {
  cards: string[];
  selectedCard: string | null;
  onSelectCard: (cardId: string) => void;
  canPlay: boolean;
}

export function PlayerHand({ cards, selectedCard, onSelectCard, canPlay }: PlayerHandProps) {
  return (
    <div className="player-hand" data-testid="player-hand">
      {cards.map((cardId) => (
        <CardComponent
          key={cardId}
          cardId={cardId}
          selected={selectedCard === cardId}
          onClick={canPlay ? () => onSelectCard(cardId) : undefined}
        />
      ))}
      {cards.length === 0 && <span className="hand-empty">Aucune carte</span>}
    </div>
  );
}
