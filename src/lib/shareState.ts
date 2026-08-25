/**
 * Lien de mesure — encodage de l'état dans l'URL.
 *
 * Le lien ne dépend d'aucun serveur : tout l'état voyage dans les paramètres.
 * Une mesure partagée reste donc lisible même si la base est indisponible, et
 * fonctionne dès aujourd'hui sur un hébergement statique.
 *
 * Corollaire : rien de ce qui transite ici ne doit être personnel. Ce sont des
 * conditions de mesure, pas un profil.
 */

export type ShareState = {
  prof: string;
  collabs: number;
  rate: number;
  adoption: number;
  rateMode: 'horaire' | 'annuel';
  /** Heures par tâche, dans l'ordre des tâches du métier. Absent si inchangé. */
  hours?: number[];
};

const P = {
  metier: 'm',
  effectif: 'n',
  taux: 'r',
  adoption: 'a',
  base: 'b',
  heures: 'h'
} as const;

/** Arrondi court, pour que les URL restent lisibles. */
const short = (n: number) => Math.round(n * 100) / 100;

export function encodeState(s: ShareState): string {
  const q = new URLSearchParams();
  q.set(P.metier, s.prof);
  q.set(P.effectif, String(s.collabs));
  q.set(P.taux, String(short(s.rate)));
  q.set(P.adoption, String(Math.round(s.adoption * 100)));
  if (s.rateMode === 'annuel') q.set(P.base, 'an');
  // Les heures ne sont transmises que si elles s'écartent des valeurs de
  // référence : un lien issu du parcours express reste court.
  if (s.hours) q.set(P.heures, s.hours.map(short).join(','));
  return q.toString();
}

/** Nombre fini borné, ou null. Rien venant de l'URL n'est cru sur parole. */
function num(raw: string | null, min: number, max: number): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

/**
 * Relit une URL. Retourne null si le métier est inconnu ou absent — c'est le
 * seul paramètre sans repli possible. Les autres retombent sur leur défaut.
 */
export function decodeState(
  search: string,
  isKnownProfession: (key: string) => boolean,
  expectedTaskCount: (key: string) => number
): ShareState | null {
  const q = new URLSearchParams(search);

  const prof = q.get(P.metier);
  if (!prof || !isKnownProfession(prof)) return null;

  const collabs = num(q.get(P.effectif), 1, 10000);
  const rate = num(q.get(P.taux), 0, 1000);
  const adoptionPct = num(q.get(P.adoption), 50, 100);

  let hours: number[] | undefined;
  const rawHours = q.get(P.heures);
  if (rawHours) {
    const parsed = rawHours.split(',').map(v => num(v, 0, 20));
    // Une liste incomplète ou invalide est ignorée en bloc plutôt que
    // partiellement appliquée : mieux vaut les valeurs de référence qu'un
    // mélange silencieux.
    if (parsed.length === expectedTaskCount(prof) && parsed.every(v => v !== null)) {
      hours = parsed as number[];
    }
  }

  return {
    prof,
    collabs: collabs === null ? 5 : Math.round(collabs),
    rate: rate === null ? 45 : rate,
    adoption: adoptionPct === null ? 0.85 : adoptionPct / 100,
    rateMode: q.get(P.base) === 'an' ? 'annuel' : 'horaire',
    hours
  };
}

/** URL complète de la mesure courante, base et chemin conservés. */
export function shareUrl(s: ShareState): string {
  if (typeof window === 'undefined') return '';
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${encodeState(s)}`;
}
