/**
 * Mapping tâche → article.
 *
 * C'est le levier que rien ne remplace : un concurrent copie une échelle de
 * potentiel en une semaine, il ne copie pas trois ans d'écriture. Le résultat
 * ne renvoie donc pas vers un rapport générique, mais vers ce qui traite
 * précisément les tâches où la mesure indique du potentiel.
 *
 * Cette lecture est **gratuite et sans inscription** : la contrepartie retenue
 * est l'absence de péage. On ouvre un parcours de lecture, on ne pose pas une
 * barrière.
 *
 * Grille à remplir et priorités : docs/mapping-taches-articles.md
 */

export type Lecture = {
  titre: string;
  /** Chemin ou URL. Un chemin relatif est résolu sur SITE. */
  url: string;
  /** Ce que l'article apporte sur cette tâche précise, en une ligne. */
  angle?: string;
};

type Entree = {
  /**
   * Libellé attendu de la tâche. Garde-fou : les identifiants (`t1`, `t2`…)
   * sont positionnels et changent de sens si l'ordre des tâches change. Sans
   * ce contrôle, un article se retrouverait silencieusement rattaché à la
   * mauvaise tâche — une petite contrevérité dans un outil qui vend le
   * contraire.
   */
  tache: string;
  lectures: Lecture[];
};

const SITE = 'https://mauricemendy.com';

/** Clé : `<métier>:<id de tâche>`. */
export const LECTURES: Record<string, Entree> = {
  // À remplir depuis docs/mapping-taches-articles.md. Exemple de forme :
  //
  // 'engineering:t2': {
  //   tache: 'Scripts & Automatisation',
  //   lectures: [
  //     {
  //       titre: "…",
  //       url: '/slug-de-l-article/',
  //       angle: "Ce que l'article apporte sur cette tâche précise."
  //     }
  //   ]
  // },
};

export function lecturesPour(prof: string, taskId: string, tacheLabel: string): Lecture[] {
  const entree = LECTURES[`${prof}:${taskId}`];
  if (!entree) return [];

  // La dérive est signalée en développement et neutralisée en production :
  // mieux vaut ne rien proposer qu'un lien faux.
  if (entree.tache !== tacheLabel) {
    if (import.meta.env.DEV) {
      console.warn(
        `[lectures] ${prof}:${taskId} référence « ${entree.tache} » mais la tâche ` +
        `est désormais « ${tacheLabel} ». Mapping ignoré — corriger la clé.`
      );
    }
    return [];
  }

  return entree.lectures.map(l => ({
    ...l,
    url: l.url.startsWith('http') ? l.url : `${SITE}${l.url}`
  }));
}

/** Y a-t-il au moins une lecture à proposer ? Évite d'afficher un bloc vide. */
export const corpusRenseigne = Object.keys(LECTURES).length > 0;
