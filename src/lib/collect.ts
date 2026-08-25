/**
 * Relevés — alimentation du baromètre.
 *
 * Trois règles :
 *
 * 1. Inerte par défaut. Sans VITE_METRON_COLLECT_URL, aucune requête n'est
 *    émise. Le dépôt porte le mécanisme avant que la base existe.
 *
 * 2. Sans retour et sans blocage. L'envoi ne conditionne rien à l'écran : une
 *    base indisponible ne doit pas dégrader la mesure. C'est pourquoi le lien
 *    de partage n'en dépend pas non plus — il vit dans l'URL.
 *
 * 3. Rien d'identifiant. Ni adresse, ni saisie libre, ni identifiant de
 *    session. Ces lignes ne sont donc pas des données personnelles, ce qui
 *    permet de publier les agrégats sans retraitement et maintient le
 *    dispositif hors du champ du consentement.
 */

const ENDPOINT = import.meta.env.VITE_METRON_COLLECT_URL;

export type Releve = {
  metier: string;
  effectif: number;
  tauxHoraire: number;
  adoption: number;
  semainesTravaillees: number;
  heuresDeclarees: number;
  heuresLiberees: number;
  partMesuree: number;
  valeurMensuelleHaute: number;
  valeurMensuelleBasse: number;
  /** Les heures ont-elles été ajustées, ou sont-ce les valeurs de référence ? */
  affine: boolean;
  version: string;
};

const configured = Boolean(ENDPOINT);

// Un relevé par configuration distincte. Sans cette empreinte, chaque
// déplacement de curseur produirait une ligne et noierait le baromètre.
const sent = new Set<string>();

function signature(r: Releve): string {
  return [r.metier, r.effectif, r.tauxHoraire, r.adoption, r.heuresDeclarees, r.heuresLiberees].join('|');
}

/**
 * Enregistre un relevé, au plus une fois par configuration. Sans
 * configuration, ne fait rien.
 */
export function collect(releve: Releve) {
  if (!configured) return;

  const key = signature(releve);
  if (sent.has(key)) return;
  sent.add(key);

  const body = JSON.stringify(releve);

  try {
    // sendBeacon survit à la fermeture de l'onglet, ce que fetch ne garantit
    // pas. On retombe sur fetch keepalive quand il est absent.
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon(ENDPOINT!, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }
    void fetch(ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors'
    }).catch(() => {
      // Un relevé perdu n'est pas un incident : on ne réessaie pas, et on ne
      // le signale pas à l'utilisateur.
    });
  } catch {
    /* ignoré volontairement */
  }
}

export const collectEnabled = configured;
