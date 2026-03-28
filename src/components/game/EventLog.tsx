import { CardComponent } from '../shared/CardComponent';
import { CARD_VALUES, SUITS } from '../../types/game';
import './EventLog.css';

interface EventLogProps {
  events: string[];
}

const CARD_ID_REGEX = /\b([A-Z]+_[A-Z]+)\b/g;
const VALID_VALUES = new Set(CARD_VALUES);
const VALID_SUITS = new Set(SUITS);

function isCardId(token: string): boolean {
  const parts = token.split('_');
  if (parts.length !== 2) return false;
  return VALID_VALUES.has(parts[0] as (typeof CARD_VALUES)[number])
      && VALID_SUITS.has(parts[1] as (typeof SUITS)[number]);
}

function renderEventWithCards(event: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(CARD_ID_REGEX);

  while ((match = regex.exec(event)) !== null) {
    if (isCardId(match[1])) {
      if (match.index > lastIndex) {
        parts.push(event.slice(lastIndex, match.index));
      }
      parts.push(
        <CardComponent key={match.index} cardId={match[1]} mini />
      );
      lastIndex = match.index + match[0].length;
    }
  }
  if (lastIndex < event.length) {
    parts.push(event.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [event];
}

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="event-log" data-testid="event-log">
      <h4>Événements</h4>
      <ul>
        {events.length === 0 && <li className="event-empty">Aucun événement</li>}
        {[...events].reverse().map((event, i) => (
          <li key={i} className="event-item">
            {renderEventWithCards(event)}
          </li>
        ))}
      </ul>
    </div>
  );
}
