import './ActionPanel.css';

interface ActionPanelProps {
  selectedCard: string | null;
  canPlayCard: boolean;
  canTrut: boolean;
  canCall: boolean;
  canFold: boolean;
  canBrellan: boolean;
  canDeuxPareilles: boolean;
  isMyTurn: boolean;
  onPlayCard: () => void;
  onTrut: () => void;
  onCall: () => void;
  onFold: () => void;
  onBrellan: () => void;
  onDeuxPareilles: () => void;
}

export function ActionPanel({
  selectedCard,
  canPlayCard,
  canTrut,
  canCall,
  canFold,
  canBrellan,
  canDeuxPareilles,
  isMyTurn,
  onPlayCard,
  onTrut,
  onCall,
  onFold,
  onBrellan,
  onDeuxPareilles,
}: ActionPanelProps) {
  if (!isMyTurn && !canTrut && !canBrellan && !canDeuxPareilles) {
    return (
      <div className="action-panel" data-testid="action-panel">
        <span className="action-waiting">En attente des autres joueurs…</span>
      </div>
    );
  }

  return (
    <div className="action-panel" data-testid="action-panel">
      {canPlayCard && (
        <button
          className="action-btn action-play"
          onClick={onPlayCard}
          disabled={!selectedCard}
          data-testid="play-card-btn"
        >
          Jouer la carte
        </button>
      )}
      {canTrut && (
        <button className="action-btn action-trut" onClick={onTrut} data-testid="trut-btn">
          Truter !
        </button>
      )}
      {canBrellan && (
        <button className="action-btn action-trut" onClick={onBrellan} data-testid="brellan-btn">
          Brelan !
        </button>
      )}
      {canDeuxPareilles && (
        <button className="action-btn action-trut" onClick={onDeuxPareilles} data-testid="deux-pareilles-btn">
          2 pareilles 1 fausse !
        </button>
      )}
      {canCall && (
        <button className="action-btn action-call" onClick={onCall} data-testid="call-btn">
          Aller voir
        </button>
      )}
      {canFold && (
        <button className="action-btn action-fold" onClick={onFold} data-testid="fold-btn">
          Se coucher
        </button>
      )}
    </div>
  );
}
