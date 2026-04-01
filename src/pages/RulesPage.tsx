import { Link } from 'react-router-dom';
import './RulesPage.css';

const CARD_HIERARCHY = [
  { card: '7', rank: 'Suprême' },
  { card: '8', rank: 'Le Truand' },
  { card: 'As', rank: 'Noble' },
  { card: 'Roi', rank: 'Majesté' },
  { card: 'Dame', rank: 'Grâce' },
  { card: 'Valet', rank: 'Écuyer' },
  { card: '10', rank: 'Le Soldat' },
  { card: '9', rank: 'Le Paysan' },
];

export function RulesPage() {
  const scrollToScoring = () => {
    document.getElementById('scoring')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rules-page" data-testid="rules-page">
      {/* ─── Header ─── */}
      <header className="rules-header">
        <h1 className="rules-header-title">Les Lois du Trut</h1>
        <p className="rules-header-subtitle">
          Un guide du jeu de bluff et de stratégie du 19ème siècle pour quatre joueurs.
        </p>
        <span className="rules-divider">——— ♠ ———</span>
      </header>

      {/* ─── I. Les Fondements ─── */}
      <section className="rules-section">
        <span className="rules-section-number">§ I.</span>
        <h2 className="rules-section-title">Les Fondements</h2>
        <p className="rules-section-text">
          Le Trut est un jeu de cartes traditionnel pratiqué principalement dans l'ouest de la France.
          Apparenté au Truco sud-américain et au Put anglais, c'est avant tout un <strong>jeu de menteur</strong>.
          Ne vous fiez jamais à l'air affiché par vos adversaires, et ne montrez jamais vos cartes — même
          après avoir bluffé.
        </p>

        <div className="rules-info-grid">
          <div className="rules-info-box">
            <p className="rules-info-label">Joueurs</p>
            <p className="rules-info-value">2 vs 2</p>
          </div>
          <div className="rules-info-box">
            <p className="rules-info-label">Matériel</p>
            <p className="rules-info-value">32 Cartes</p>
          </div>
          <div className="rules-info-box">
            <p className="rules-info-label">Distribution</p>
            <p className="rules-info-value">3 cartes / joueur</p>
          </div>
          <div className="rules-info-box">
            <p className="rules-info-label">Objectif</p>
            <p className="rules-info-value">7 Truts</p>
          </div>
        </div>
      </section>

      {/* ─── II. L'Ordre Royal ─── */}
      <section className="rules-section">
        <span className="rules-section-number">§ II.</span>
        <div className="rules-hierarchy" data-testid="card-hierarchy">
          <h2 className="rules-hierarchy-title">L'Ordre Royal</h2>
          {CARD_HIERARCHY.map(({ card, rank }) => (
            <div className="rules-hierarchy-row" key={card}>
              <span className="rules-hierarchy-card">{card}</span>
              <span className="rules-hierarchy-rank">{rank}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── III. Le Jeu des Plis ─── */}
      <section className="rules-section">
        <span className="rules-section-number">§ III.</span>
        <h2 className="rules-section-title">Le Jeu des Plis</h2>

        <div className="rules-subsection">
          <h3 className="rules-subsection-title">La Donne</h3>
          <p className="rules-subsection-text">
            Le joueur qui a donné à la manche précédente coupe le jeu. Le joueur à sa gauche
            est le donneur : il distribue les cartes une par une, dans le sens des aiguilles d'une
            montre, en commençant par le joueur à sa gauche. Chaque joueur reçoit 3 cartes.
            Le reste forme le talon.
          </p>
        </div>

        <div className="rules-subsection">
          <h3 className="rules-subsection-title">Le Bluff</h3>
          <p className="rules-subsection-text">
            À tout moment, un joueur peut déclarer « Trut ! » pour augmenter les enjeux de la manche.
            Truter signifie : « Je pense être capable de remporter cette manche. » L'équipe adverse
            doit alors décider si elle relève le défi ou se couche.
          </p>
        </div>

        <div className="rules-subsection">
          <h3 className="rules-subsection-title">Le Déroulement</h3>
          <p className="rules-subsection-text">
            Le joueur à la gauche du donneur pose une carte en premier. Les autres suivent dans
            le sens des aiguilles d'une montre. L'équipe qui pose la carte la plus haute remporte le pli.
          </p>
        </div>

        <div className="rules-subsection">
          <h3 className="rules-subsection-title">Le Pli Pourri</h3>
          <p className="rules-subsection-text">
            Si les deux équipes posent la même carte la plus haute, le pli est « pourri » et
            mis de côté. Il reviendra à l'équipe qui remporte le pli suivant.
            Comme dit l'adage : « Qui pourrit dépourrit » — c'est le joueur qui a pourri
            le pli qui joue en premier au tour suivant.
          </p>
        </div>
      </section>

      {/* ─── IV. L'Art du Trut ─── */}
      <section className="rules-section">
        <span className="rules-section-number">§ IV.</span>
        <h2 className="rules-section-title" style={{ fontStyle: 'italic' }}>L'Art du Trut</h2>
        <p className="rules-section-text">
          À n'importe quel moment de la manche, un joueur peut truter — en frappant du poing
          sur la table ou en annonçant « Je trute ». L'équipe adverse doit alors répondre :
        </p>

        <div className="rules-responses">
          <div className="rules-response">
            <p className="rules-response-action">« Aller voir »</p>
            <p className="rules-response-desc">
              Le défi est relevé. La manche continue et le vainqueur remporte 1 jeton long (grand).
            </p>
          </div>
          <div className="rules-response">
            <p className="rules-response-action">« Se coucher »</p>
            <p className="rules-response-desc">
              L'équipe refuse le défi. L'équipe qui a truté remporte 1 petit.
            </p>
          </div>
        </div>

        <p className="rules-section-text">
          Si personne ne trute durant la manche, l'équipe gagnante ne remporte qu'un petit.
        </p>

        <button className="rules-learn-more" onClick={scrollToScoring}>
          EN SAVOIR PLUS
        </button>
      </section>

      {/* ─── V. La Main Gagnante ─── */}
      <section className="rules-section" id="scoring">
        <span className="rules-section-number">§ V.</span>
        <h2 className="rules-section-title">La Main Gagnante</h2>
        <p className="rules-section-text">
          La victoire s'obtient grâce au système de jetons :
        </p>

        <ul className="rules-scoring-list">
          <li className="rules-scoring-item">
            <strong>7 jetons longs (grands)</strong> = victoire de la partie
          </li>
          <li className="rules-scoring-item">
            <strong>3 petits (pigeons)</strong> = 1 jeton long
          </li>
          <li className="rules-scoring-item">
            Quand l'adversaire gagne un jeton long, <strong>vous perdez tous vos petits</strong>
          </li>
        </ul>

        <div className="rules-fortial">
          <h3 className="rules-fortial-title">Le Fortial</h3>
          <p className="rules-fortial-text">
            Une équipe est au fortial lorsqu'elle totalise 6 jetons longs et 2 pigeons.
            Lors de la manche suivante, seul le joueur à gauche du donneur peut regarder ses cartes
            en premier et décide seul s'il trute. Si l'un des deux joueurs trute, l'équipe adverse
            est obligée d'aller voir — se coucher signifie la défaite automatique.
          </p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="rules-cta">
        <h2 className="rules-cta-title">Prêt à relever le défi ?</h2>
        <div className="rules-cta-buttons">
          <Link to="/" className="rules-cta-primary" data-testid="cta-lobby">
            ENTRER AU LOBBY
          </Link>
          <Link to="/" className="rules-cta-secondary" data-testid="cta-training">
            MODE ENTRAINEMENT
          </Link>
        </div>
      </section>
    </div>
  );
}
