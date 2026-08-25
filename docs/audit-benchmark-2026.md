# Mon ROI IA — Benchmark marché, audit & cap stratégique

**Date :** Août 2026 · **Périmètre :** repo `mauricemendy/mon-roi-ia` (v1.3 au moment de l'audit) + recherche marché
**Objectif :** faire de l'outil un moteur de leads et de diagnostic.

> **Révision du 25 août 2026.** Ce document a été corrigé après un fact-check ligne à ligne
> du code et une revue critique. Les corrections portent sur trois constats techniques
> inexacts, le retrait de trois sources non défendables, l'abandon du score synthétique,
> et l'ajout de deux angles manquants (le corpus éditorial, la limite de périmètre du
> moteur). Le journal des corrections figure en fin de document.

---

## Verdict

**Un bon calculateur sur un marché qui n'achète plus de calculateurs.** Le segment « calculateur ROI IA » est saturé, la valeur s'est déplacée vers le **diagnostic personnalisé** : score, quick wins nommés, rapport, débrief.

L'atout de l'outil est réel et rare : **seul acteur du panel avec une méthodologie sourcée, transparente et falsifiable**, là où les concurrents vendent un « algorithme propriétaire » aux chiffres flatteurs. Mais cet atout ne convertit rien : aucune capture de lead, aucun diagnostic actionnable, aucune mesure d'usage, et un hébergement sur `github.io` où chaque backlink construit l'autorité de GitHub.

**Le plan : garder le moteur, changer l'emballage, brancher le tunnel — sur l'infrastructure Ghost déjà en place.**

---

## 1. Benchmark — quatre familles d'acteurs

### A. Calculateurs ROI d'éditeurs
Writer, DX, Google DORA, Mavvrik, AI4SP.
Entrées simplistes, gros chiffres, biais assumé vers leur produit. Conversion : « Talk to sales ».

### B. Calculateurs d'agences françaises (segment direct)
Kairia (« algorithme propriétaire », benchmarks sectoriels, rapport PDF), Utilia AI, Made in AI, Calimeg, Nassim Belouar, Tensoria, BGB Formation (angle CPF).
Mécanique convergente : simulation « 2 minutes » → estimation → PDF téléchargeable → tunnel vers l'offre d'automatisation ou de formation.

### C. Diagnostics de maturité IA (le format qui génère les leads)
- **France Num / OMDIE** : 15 min, score 1–5, recommandations, gratuit et public.
- **Productivité.AI** : 30 questions, 6 dimensions, score immédiat + benchmark sectoriel + rapport PDF.
- **Seminaire.AI** : grille 5 niveaux, roadmap personnalisée.
- **Vertex Agility** : 18 questions / 6 axes, rapport personnalisé + consultation.
- **AI Readiness Partner** : modèle freemium — assessment gratuit → rapport payant → deep dive.
- **Microsoft AI Readiness** : self-assessment + positionnement + recommandations.

### D. Plateformes de diagnostic white-label
ScoreApp, Outgrow, Interact, Audity (white-label pour cabinets). Leur existence prouve que le « diagnostic funnel » est devenu un format standard du lead magnet B2B : résultat dynamique personnalisé plutôt que PDF statique, segmentation par réponse.

> **Sur les taux de conversion de ces plateformes.** ScoreApp et Outgrow publient des
> écarts spectaculaires entre formulaire interactif et contenu statique. Ce sont des
> chiffres d'éditeurs mesurés sur leur propre produit — exactement la catégorie de source
> que ce rapport disqualifie par ailleurs. Ils peuvent servir à cadrer une décision
> interne ; ils n'ont pas leur place dans une page signée, et ils ne suffisent pas à
> trancher entre inscription newsletter et rapport contre adresse.

### Une donnée utilisable
Le **payback médian par fonction** (Bain, 2026) va d'environ 4 mois pour le support client à environ 9 mois pour l'engineering. Cette source sert le propos mieux que les agrégats globaux, précisément parce qu'elle dit « ça dépend de la fonction » — ce qui est l'argument de la granularité par tâche.

> **Source écartée.** Le « 95 % des pilotes GenAI échouent » (MIT / initiative NANDA, été 2025)
> ne doit pas être repris. Le rapport n'est pas peer-reviewed, sa méthodologie a été
> largement contestée après sa circulation virale, et le chiffre mesure une absence
> d'impact P&L mesurable sur des pilotes — pas un taux d'échec. Adosser un positionnement
> anti-hype au chiffre le plus surexploité de la période offre la contradiction à qui la
> cherche, devant un lectorat qui vérifie.

### Positionnement comparé

| Acteur | Sources transparentes | Granularité par tâche | Plan d'action personnalisé | Capture de lead |
|---|---|---|---|---|
| Éditeurs | ✗ (étude sponsorisée) | ✗ | ✗ | ✓ vers sales |
| Agences FR | ✗ (« algo propriétaire ») | ✗ | générique | ✓ PDF + RDV |
| Diagnostics maturité | rarement | ✗ (dimensions org.) | ✓ recos par score | ✓ rapport + débrief |
| **Mon ROI IA** | **✓ unique sur le panel** | **✓ 8 métiers × ~10 tâches** | ✗ (roadmap statique) | **✗ aucune** |

**Enseignement central :** la position « diagnostic honnête, sourcé, qui dit aussi où l'IA ne marchera pas » est vacante. Il manque à l'outil le **format diagnostic**, le **tunnel**, et l'exploitation du **corpus éditorial** (§4).

---

## 2. Audit de l'outil

### Forces (à protéger)
- **Rigueur méthodologique unique** : 4 études peer-reviewed liées, section « non comptabilisé », écart théorique/observé, export des hypothèses.
- **Granularité tâche × métier** : 8 métiers × ~10 tâches — la matière première d'un vrai diagnostic, déjà construite.
- **Honnêteté = pré-qualification** : attire les décideurs sérieux, filtre naturel des leads.

### Produit
| Sévérité | Constat |
|---|---|
| 🔴 Critique | « Combien » est traité, « où chez moi » et « comment » non. La **roadmap 3 mois est un bloc JSX figé** (à partir de la ligne 752), identique quels que soient le métier, la taille d'équipe et l'adoption. |
| 🔴 Critique | **Aucune restitution mémorisable ni partageable** : ni profil, ni rapport, ni URL de résultat. Seul export : un JSON d'hypothèses, parfait pour un pair-review, inutilisable comme monnaie d'échange. |
| 🟠 Important | Densité d'interface qui sert l'analyste et fait fuir le décideur. Deux publics sur un seul écran : il faut deux vitesses. |
| 🟠 Important | **Coefficients ajustables annoncés, non implémentés** : `customCoefficients` est déclaré ligne 165, lu lignes 181, 200 et 232, et `setCustomCoefficients` n'est appelé nulle part. |
| 🟠 Important | Hypothèses figées et invisibles hors méthodologie : licence 30 € ligne 177, semaine 37,5 h, palier de break-even plafonné à 30. |
| 🟡 Nuance | **Les tips ne sont pas génériques.** `getDynamicTips` (ligne 304) a trois branches et injecte les libellés réels des tâches du Top 3. C'est superficiel, pas générique. Le reproche vaut pour la roadmap, pas pour les tips. |

### UX & design
| Sévérité | Constat |
|---|---|
| 🔴 Bug avéré | `getKColor` (lignes 144-149) retourne `{bg, text, border, label}` alors que le rendu lit `color.bar` et `color.badge` à **sept endroits** : 468, 474, 521, 527, 574, 580, 706. Ce sont des `undefined` injectés dans des chaînes de classe. Ligne 706, les numéros du Top 3 sont en `text-white` sur un fond inexistant. Le système visuel censé répondre à « où sont les gains » est hors service en production. |
| 🟠 Bug avéré | Classe Tailwind assemblée à l'exécution ligne 740 (`text-${tip.color}-600`) : purgée au build. |
| 🟠 Important | Légende incohérente avec l'échelle réelle (« moyen » bleu dans la légende, jaune dans `getKColor`). |
| 🟠 Important | Hiérarchie de lecture confuse : six cartes sans ordre narratif, aucun appel à l'action après le chiffre. |
| 🟡 Mineur | Pas d'état dans l'URL ni de persistance : simulation impartageable. |

### Acquisition
| Sévérité | Constat |
|---|---|
| 🔴 Critique | **Zéro capture de lead** et **zéro mesure d'usage**. |
| 🟠 Important | `index.html` : `lang="en"` sur un outil francophone, titre `mon-roi-ia`, aucune meta description, aucune balise OpenGraph (un partage LinkedIn s'affiche sans titre ni aperçu), favicon Vite. |
| 🟠 Important | Hébergé sur `github.io` : l'autorité SEO ne revient pas à mauricemendy.com. |
| 🟡 Mineur | Composant monolithique de 1 102 lignes, `recharts` jamais importé, README pointant sur `roi-calculator-genai` (dépôt renommé), versions incohérentes sur trois surfaces (README 1.2/déc. 2025, JSON 1.3, pied de page 1.3/janv. 2025). |

### Corrections apportées à une version antérieure de cet audit
- **`collabs = 0` produit `NaN`, pas `Infinity`.** Le gain brut (ligne 187) est multiplié par `collabs` : numérateur et dénominateur tombent à zéro ensemble.
- **47 contre 52 semaines n'est pas un désalignement à corriger mais un arbitrage.** Le facteur 4,33 vaut 52/12 et tout le moteur raisonnait en année pleine, alors que la méthodologie annonçait 47 semaines travaillées. *Arbitrage rendu : les 47 semaines étaient l'intention d'origine (52 moins 5 semaines de congés payés) ; c'est le moteur qui a été aligné sur le texte, et le choix est désormais explicité.*
- **Les tips ne sont pas génériques** (voir tableau produit).

### Défauts découverts après coup
- **Le build est cassé sur `main`.** `baseUrl` déprécié fait échouer `tsc -b`, donc `npm run build`, donc `npm run deploy`.
- **`src/App.tsx` n'est jamais rendu.** `main.tsx` importe `ROICalculator` directement. La page en production n'a **aucun `<h1>`**, et le hero « Estimez en 30 secondes » est du code mort — la promesse ne contredit pas l'interface, elle n'est jamais affichée.

---

## 3. Cap recommandé

> **« Le diagnostic IA de l'ingénieur : chiffré, sourcé, sans complaisance. »**
> Pendant que les agences promettent des économies miracles avec un algorithme opaque, l'outil dit la vérité du terrain — y compris là où l'IA ne marchera pas — avec des études citées et des hypothèses challengeables.

### De calculateur à diagnostic : trois actes
1. **Où ?** — Cartographie des gains (l'existant), en parcours à deux vitesses : express avec valeurs par défaut pour le décideur, expert avec les curseurs actuels pour l'analyste.
2. **Combien ?** — Quanti existant + quali manquant : niveau de confiance par estimation (source solide / extrapolée), risques, et **limite de périmètre énoncée** (§6).
3. **Comment ?** — Roadmap **dérivée des réponses**, et surtout **reliée au corpus** (§4).

### Pas de score synthétique
Un nombre unique de 0 à 100 agrégeant des coefficients hétérogènes produit exactement l'objet reproché aux concurrents : un chiffre dont personne ne peut reconstituer la formation. Il contredit le principe d'explicabilité qui fonde le positionnement.

La mémorisabilité recherchée s'obtient autrement : un **profil nommé assis sur des critères visibles** — concentration du temps sur des tâches à fort coefficient, taille d'équipe, adoption amorcée ou non. Même effet de restitution, défendable ligne à ligne.

---

## 4. Le levier principal : le corpus éditorial

Le calculateur produit une liste de tâches classées par potentiel. Le blog compte seize articles publiés et une série de cinq volets qui traitent exactement ces sujets.

Un utilisateur dont le Top 3 fait ressortir la gestion documentaire devrait sortir avec **le nom de la tâche, l'ordre de grandeur du gain, et le lien vers l'article qui traite ce cas précis**. Aucun acteur du panel ne peut faire ça, parce qu'aucun n'a de corpus. **Un concurrent copie un score en une semaine ; il ne copie pas trois ans d'écriture.**

Cela change la nature de l'échange : on ne demande plus une adresse contre un PDF générique, on ouvre un parcours de lecture personnalisé, et l'inscription devient la suite naturelle plutôt qu'un péage. C'est aussi le seul montage où la conversion est mesurable article par article dans Ghost.

**Travail préparatoire, à faire une fois :** le mapping tâche → article. Huit métiers, une dizaine de tâches chacun, à relier aux articles publiés et aux volets à paraître. Toutes les tâches n'auront pas d'article — c'est une information utile, elle indique où le corpus a des trous.

---

## 5. Infrastructure : partir de Ghost, ne rien reconstruire

Une version antérieure de ce rapport recommandait un webhook n8n, une génération de rapport, un envoi via Resend ou Brevo et une liste de diffusion dédiée. **C'était une erreur** : Ghost embarque nativement les membres, les newsletters, les tiers et les offres. Monter une base parallèle produirait deux fichiers de contacts à réconcilier, deux points de désabonnement et une conformité RGPD à tenir en double.

**Nuance à garder en tête :** Ghost envoie des *diffusions* à des segments, pas un *document généré par répondant*. Si la contrepartie retenue est un rapport personnalisé, il reste un besoin de rendu et d'envoi — qui peut s'appuyer sur l'Admin API Ghost pour créer le membre, sans base parallèle, mais qui n'est pas zéro infrastructure. **C'est donc la nature de la contrepartie qui détermine l'infrastructure, et non l'inverse.**

Le montage le plus léger — parcours de lecture affiché directement sur la page de résultat, inscription proposée mais optionnelle — ne demande aucune infrastructure supplémentaire.

### Deux extrémités à ouvrir avant tout tunnel
La newsletter Ghost n'est pas activée, et la page « Travailler avec moi » est en HTML prêt, non collée, avec ses placeholders. Un dispositif qui capture des adresses vers une newsletter absente et pointe vers une page non publiée ne convertit rien. Deux tâches courtes, et elles conditionnent le reste.

---

## 6. La limite de périmètre à énoncer

La formule modélise **l'assistance individuelle** : des humains qui gardent leurs tâches et vont plus vite avec une licence par siège.

Elle **ne modélise pas l'automatisation de processus**, où la tâche sort du périmètre humain. Dans ce second cas il n'y a ni heures de collaborateur ni effectif, mais un volume de transactions, un coût de construction ponctuel, un coût par exécution et une maintenance qui croît avec le nombre de workflows.

**Conséquence immédiate :** énoncer le périmètre dans l'outil — ce qu'il calcule, ce qu'il ne calcule pas. Une exclusion annoncée vaut mieux qu'une exclusion découverte, et c'est cohérent avec le reste de la démarche.

**À plus long terme :** un second moteur est possible, avec sa propre unité (le coût par transaction traitée). Mais il suppose des coûts d'exécution mesurés sur des cas réels — sans ces données, il produirait un moteur propre alimenté par des coefficients inventés.

---

## 7. Traitement des sources

| Source | Statut |
|---|---|
| Bain 2026, payback par fonction | **À garder** — sert l'argument de la granularité |
| MIT / NANDA « 95 % » | **À écarter** — non peer-reviewed, méthodologie contestée, mesure autre chose |
| ScoreApp, Outgrow, Interact | **Usage interne uniquement** — chiffres d'éditeurs sur leur propre produit |
| Dell'Acqua, Noy & Zhang, Brynjolfsson, Peng (2023) | **À garder, avec note de péremption** — sérieuses et c'est ce qui existe de plus solide, mais datées en contexte GPT-4. Deux lignes indiquant que les coefficients seront revus protègent l'argument |
| Validation terrain n=12 | **À requalifier** — douze professionnels auto-recrutés sur six mois, c'est une **observation sur un échantillon de convenance**, pas une validation. La formulation actuelle prête le flanc pour un bénéfice nul |

---

## 8. Séquence

### Étape 0 — Assainir *(faite, branche `claude/diagnostic-tool-benchmark-audit-8t1i85`)*
Sept occurrences de `color.bar`/`color.badge`, classe dynamique ligne 740, bornes d'entrée et `NaN` sur effectif nul, break-even « Jour 0 », `lang="fr"` + titre + meta description + OpenGraph avec image + favicon, `baseUrl` déprécié, `recharts`, versions alignées. Année travaillée de 47 semaines portée dans le moteur et explicitée.

**Reste à trancher :** la mesure d'usage (réutiliser la propriété GA existante pour un parcours blog ↔ outil unifié, ou dispositif séparé sans cookie).

### Étape 1 — Ouvrir les extrémités
Activer la newsletter Ghost. Publier « Travailler avec moi ». Migrer l'outil sous le domaine. Publier les volets en draft. **Rien de tout cela ne dépend d'une décision d'offre.**

### Étape 2 — Transformer
Parcours à deux vitesses. Résultats reliés au corpus (§4). Roadmap dérivée des réponses. Page de résultat partageable par URL — l'artefact réellement manquant pour un manager qui veut convaincre sa direction. Inscription via les membres Ghost. Coefficients ajustables, ou retrait définitif de la promesse.

### Étape 3 — Le flywheel
Agrégats anonymisés publiés en baromètre récurrent par métier. Contenu unique, auto-alimenté, impossible à produire sans l'outil — et ce qui justifie de poser la mesure dès l'étape 0.

---

## 9. Points à trancher

1. **Analytique** — propriété GA existante (parcours unifié) ou dispositif séparé sans cookie.
2. **Sous-domaine et nom public** — « Mon ROI IA » décrit un calculateur, pas un diagnostic. À arbitrer ensemble.
3. **Nature de la contrepartie** — parcours de lecture sans email, inscription newsletter, ou rapport contre adresse. Détermine l'infrastructure (§5).
4. **Coefficients ajustables** — fonctionnalité réellement utile pour un utilisateur avancé, ou promesse à retirer. Dépend du design retenu.
5. **Offre au bout du parcours** — reste ouverte, et n'a pas besoin d'être tranchée avant l'étape 3. Les données d'usage éclaireront la décision mieux qu'un arbitrage a priori.

---

## Journal des corrections (25 août 2026)

**Constats techniques rectifiés :** `Infinity` → `NaN` · « aligner 47/52 » → arbitrage, tranché en faveur de 47 · tips « génériques » → superficiels mais dynamiques.

**Retraits :** le « 95 % » du MIT · les statistiques de conversion des plateformes de quiz, reléguées à l'usage interne · le score synthétique 0–100, remplacé par un profil nommé sur critères visibles.

**Ajouts :** le corpus éditorial comme levier principal (§4) · l'infrastructure Ghost à la place de la pile n8n / Resend / Brevo (§5) · la limite de périmètre assistance vs automatisation (§6) · le traitement des sources (§7) · la requalification de la validation terrain · les deux défauts découverts après coup (build cassé, `App.tsx` mort).

---

## Sources du benchmark

- Writer — https://writer.com/ai-roi-calculator/
- DX — https://getdx.com/blog/ai-roi-calculator/
- Google Cloud / DORA — https://cloud.google.com/blog/products/ai-machine-learning/how-to-measure-the-business-value-of-generative-ai
- AI4SP — https://ai4sp.org/ai-roi-calculator/
- Kairia — https://kairia.fr/calculateur-roi
- Utilia AI — https://utilia-ai.fr/ressources/calculateur-roi/
- Made in AI — https://www.made-in-ai.fr/calculateur-roi-automatisation
- Calimeg — https://calimeg.com/roi.php
- Nassim Belouar — https://nassimbelouar.com/outils/calculateur-roi-ia/
- France Num / OMDIE — https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/diagnostic-numerique/quel-est-le-niveau-de-maturite-de-votre
- Productivité.AI — https://www.productivite.ai/diagnostic-ia
- Seminaire.AI — https://www.seminaire.ai/blog/diagnostic-maturite-ia-pme
- Vertex Agility — https://vertexagility.com/free-assessments/ai-readiness/
- AI Readiness Partner — https://aireadinesspartner.com/ai-readiness-audit/free-assessment
- Microsoft AI Readiness — https://info.microsoft.com/ww-landing-ai-maturity-model-website.html?lcid=en-us
- Audity — https://auditynow.com/blog/best-ai-readiness-assessment-tools
- Bain / IDC, statistiques de payback par fonction — https://www.digitalapplied.com/blog/ai-agent-productivity-statistics-2026-roi-data-points

*Sources consultées mais écartées de toute page signée : ScoreApp, Outgrow, Interact (chiffres d'éditeurs) ; MIT / NANDA « GenAI Divide » (non peer-reviewed, méthodologie contestée).*
