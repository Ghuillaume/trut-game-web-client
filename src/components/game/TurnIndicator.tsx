import './TurnIndicator.css';

interface TurnIndicatorProps {
  isMyTurn: boolean;
  currentPlayerName: string;
}

export function TurnIndicator({ isMyTurn, currentPlayerName }: TurnIndicatorProps) {
  return (
    <div className="turn-indicator" data-testid="turn-indicator">
      {isMyTurn
        ? "C'est à vous de jouer !"
        : `C'est au tour de ${currentPlayerName}`}
    </div>
  );
}
