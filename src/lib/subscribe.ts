/**
 * Inscription — capture vers Brevo, via un Worker.
 *
 * Le dépôt ne connaît qu'une URL. La clé Brevo, la liste de destination et le
 * routage vivent dans le Worker : rien de secret ne transite par un bundle
 * navigateur.
 *
 * Inerte sans VITE_METRON_SUBSCRIBE_URL, comme l'instrumentation et les
 * relevés. La variable ne sera renseignée qu'après la migration de domaine —
 * le Worker n'a pas d'origine stable à autoriser tant que l'outil vit sur
 * github.io.
 *
 * Double opt-in : le Worker appelle POST /v3/contacts/doubleOptinConfirmation
 * et non POST /contacts. Le contact n'entre donc dans la liste qu'après avoir
 * cliqué, ce qui constitue la trace de consentement. Conséquence pour
 * l'interface : après envoi, on ne dit pas « inscrit » mais « vérifiez votre
 * boîte » — ce serait faux autrement.
 *
 * Contrat d'attributs et routage : docs/capture-contrat.md
 */

const ENDPOINT = import.meta.env.VITE_METRON_SUBSCRIBE_URL;

export type Inscription = {
  email: string;
  /** Route vers la bonne liste côté Worker. Un seul Worker pour tous les outils. */
  source: 'metron';
  /** Socle commun à tous les outils. Bornes définies une seule fois, ci-dessous. */
  tranche_effectif: string;
  /** Spécifique METRON. */
  metier: string;
  part_mesuree: number;
  affine: boolean;
};

export const subscribeEnabled = Boolean(ENDPOINT);

/**
 * Tranches d'effectif — définies ici et nulle part ailleurs.
 *
 * METRON connaît l'effectif exact, d'autres outils demandent directement une
 * tranche. Si les bornes divergent, le socle n'est commun que de nom et aucune
 * séquence ne pourra segmenter dessus. Toute modification doit être répercutée
 * sur les options des autres formulaires.
 */
export function trancheEffectif(n: number): string {
  if (n <= 1) return '1';
  if (n <= 4) return '2-4';
  if (n <= 9) return '5-9';
  if (n <= 19) return '10-19';
  if (n <= 49) return '20-49';
  if (n <= 199) return '50-199';
  return '200+';
}

/** Validation volontairement permissive : le Worker et Brevo tranchent. */
export function emailPlausible(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export type Resultat = 'ok' | 'invalide' | 'erreur' | 'inactif';

export async function subscribe(inscription: Inscription): Promise<Resultat> {
  if (!subscribeEnabled) return 'inactif';
  if (!emailPlausible(inscription.email)) return 'invalide';

  try {
    const reponse = await fetch(ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // DATE_OPTIN n'est pas envoyée d'ici : l'horloge du navigateur n'est pas
      // une source de vérité pour une trace de consentement. Le Worker la pose.
      body: JSON.stringify({ ...inscription, email: inscription.email.trim().toLowerCase() })
    });
    return reponse.ok ? 'ok' : 'erreur';
  } catch {
    return 'erreur';
  }
}
