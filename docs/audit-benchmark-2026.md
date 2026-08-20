# Mon ROI IA — Benchmark marché, audit & cap stratégique

**Date :** Août 2026 · **Périmètre :** repo `mauricemendy/mon-roi-ia` (v1.3) + recherche marché
**Objectif :** faire de l'outil un moteur de leads et de diagnostic.

---

## Verdict

**Un bon calculateur sur un marché qui n'achète plus de calculateurs.** Le segment « simulateur ROI IA » s'est commoditisé (des dizaines d'agences FR en proposent un identique) et la valeur s'est déplacée vers le **diagnostic personnalisé** : score, quick wins nommés, rapport contre email, débrief.

L'atout de l'outil est réel et rare : **seul acteur du panel avec une méthodologie sourcée, transparente et falsifiable**, là où les concurrents vendent un « algorithme propriétaire » aux chiffres flatteurs. Mais cet atout ne convertit rien : zéro capture de lead, zéro diagnostic actionnable, zéro mesure d'usage.

**Le plan : garder le moteur, changer l'emballage, brancher le tunnel.**

---

## 1. Benchmark — quatre familles d'acteurs

### A. Calculateurs ROI d'éditeurs
Writer (étude Forrester TEI, 333 % de ROI revendiqué), DX, Google DORA, Mavvrik, AI4SP.
Entrées simplistes, gros chiffres, biais assumé vers leur produit. Conversion : « Talk to sales ».

### B. Calculateurs d'agences françaises (segment direct)
Kairia (« algorithme propriétaire », benchmarks sectoriels, rapport PDF), Utilia AI, Made in AI, Calimeg, Nassim Belouar, Tensoria, BGB Formation (angle CPF).
Mécanique convergente : simulation « 2 minutes » → estimation → PDF téléchargeable → tunnel vers l'offre d'automatisation/formation.

### C. Diagnostics de maturité IA (le format qui génère les leads)
- **France Num / OMDIE** : 15 min, score 1–5, recommandations, gratuit et public.
- **Productivité.AI** : 30 questions, 6 dimensions, score immédiat + benchmark sectoriel + rapport PDF.
- **Seminaire.AI** : grille 5 niveaux, « 230+ PME », roadmap personnalisée.
- **Vertex Agility** : 18 questions / 6 axes, rapport personnalisé + consultation senior.
- **AI Readiness Partner** : modèle freemium — assessment gratuit 7 min → rapport complet 97 £ → deep dive 497 £.
- **Microsoft AI Readiness** : self-assessment + positionnement sur un spectre + recommandations.

### D. Plateformes de diagnostic white-label
ScoreApp, Outgrow, Interact, Audity (white-label pour cabinets). Leur existence prouve que le « diagnostic funnel » est devenu **le** lead magnet B2B standard : résultat dynamique personnalisé > PDF statique, segmentation par réponse, emails personnalisés par score.

### Les chiffres qui comptent
| Indicateur | Valeur | Source |
|---|---|---|
| Conversion formulaire interactif vs statique | ~47 % vs ~3 % | Outgrow 2025, ScoreApp 2026 (22 000 funnels) |
| Conversion quiz/diagnostic B2B (visiteur → email) | 30–50 % (38,5 % services pro B2B) | ScoreApp 2026 |
| Pilotes GenAI sans ROI mesurable | 95 % | MIT « GenAI Divide », 2025 |
| Payback médian par fonction | 4,1 mois (support) à 9,3 mois (engineering) | Bain Agentic AI Benchmark 2026 |

### Le tunnel standard du marché
1. **Hook court** (2–7 min, sans inscription)
2. **Valeur immédiate partielle** (score, top 3 à l'écran)
3. **Rapport complet contre email** (30–50 % des répondants)
4. **Débrief offert 30 min** (5–10 % des emails)
5. **Offre payante** (audit, mission, formation — certains monétisent le rapport 97–497 £)

### Positionnement comparé

| Acteur | Sources transparentes | Granularité par tâche | Plan d'action personnalisé | Capture de lead |
|---|---|---|---|---|
| Éditeurs | ✗ (étude sponsorisée) | ✗ | ✗ | ✓ vers sales |
| Agences FR | ✗ (« algo propriétaire ») | ✗ | générique | ✓ PDF + RDV |
| Diagnostics maturité | rarement | ✗ (dimensions org.) | ✓ recos par score | ✓ rapport + débrief |
| **Mon ROI IA** | **✓ unique sur le panel** | **✓ 8 métiers × ~10 tâches** | ✗ (roadmap statique) | **✗ aucune** |

**Enseignement central :** la faille du marché est exactement ton terrain. Personne n'occupe la position « diagnostic honnête, sourcé, qui dit aussi où l'IA ne marchera pas ». Depuis le rapport MIT, cette posture anti-hype — déjà celle de ton contenu — est la plus crédible du marché. Il manque à l'outil le **format diagnostic** et le **tunnel**.

---

## 2. Audit de l'outil

### Forces (à protéger)
- **Rigueur méthodologique unique** : 4 études peer-reviewed liées, section « non comptabilisé », écart théorique/observé (−7 %), export des hypothèses. Aucun concurrent ne fait ça.
- **Granularité tâche × métier** : 8 métiers × ~10 tâches — la matière première d'un vrai diagnostic, déjà construite.
- **Honnêteté = pré-qualification** : attire les décideurs sérieux, filtre naturel des leads.

### Produit — l'outil ne répond qu'à un tiers de la problématique
| Sévérité | Constat |
|---|---|
| 🔴 Critique | « Combien » est traité, « où chez moi » et « comment » non : tips génériques, **roadmap 3 mois strictement identique** pour tous (bloc JSX statique). |
| 🔴 Critique | **Aucune restitution mémorisable** : ni score, ni profil, ni rapport, ni URL partageable. Seul export : un JSON d'hypothèses. |
| 🟠 Important | Promesse « 30 secondes » vs interface expert (~10 sliders, accordéons). Deux publics mélangés : il faut un mode express ET un mode expert. |
| 🟠 Important | **« Coefficients ajustables » annoncés mais non implémentés** : `customCoefficients` n'est jamais alimenté, aucune UI. |
| 🟠 Important | Hypothèses figées et incohérences : licence 30 €/mois en dur, 52 semaines utilisées vs 47 annoncées, `collabs=0` → ROI `Infinity`, valeurs négatives acceptées. |
| 🟡 Mineur | Sources 2023 (ère pré-agents). Intégrer MIT GenAI Divide / Bain 2026 / DORA renforcerait l'argument « à jour et honnête ». Validation terrain (n=12) à re-dater. |

### UX & design
| Sévérité | Constat |
|---|---|
| 🔴 Bug avéré | `getKColor()` renvoie `{bg, text, border, label}` mais le rendu lit `color.bar` / `color.badge` (inexistants) → barres de potentiel invisibles, badges k sans couleur, numéros du Top 3 blancs sur fond transparent. |
| 🟠 Bug avéré | Classes Tailwind dynamiques `` text-${tip.color}-600 `` purgées au build → couleurs perdues en prod. |
| 🟠 Important | Légende incohérente avec l'échelle (« moyen » bleu dans la légende, jaune dans `getKColor` ; sections emerald/blue/amber ≠ échelle réelle). |
| 🟠 Important | Hiérarchie de lecture confuse : 6 cartes sans ordre narratif ; sur mobile, résultats sous la ligne de flottaison ; aucun CTA après le chiffre. |
| 🟡 Mineur | Pas d'état dans l'URL ni de persistance : simulation impartageable. |

### Acquisition — le chaînon manquant
| Sévérité | Constat |
|---|---|
| 🔴 Critique | **Zéro capture de lead** : pas d'email, pas de CTA, pas de Calendly, pas de newsletter. |
| 🔴 Critique | **Zéro analytics** : trafic, complétion, métiers simulés — tout est inconnu. |
| 🟠 Important | SEO/partage à zéro sur le mauvais domaine : titre « mon-roi-ia », `lang="en"`, pas de meta description ni OpenGraph (partage LinkedIn sans aperçu), hébergé sur github.io (l'autorité SEO ne revient pas à mauricemendy.com). |
| 🟡 Mineur | Dette d'hygiène : composant monolithique 1 100 lignes, `recharts` inutilisé, README obsolète (liens `roi-calculator-genai`, versions/dates incohérentes), pas de captures. |

---

## 3. Cap recommandé

> **« Le diagnostic IA de l'ingénieur : chiffré, sourcé, sans complaisance. »**
> Pendant que les agences promettent des économies miracles avec un algorithme opaque, l'outil dit la vérité du terrain — y compris là où l'IA ne marchera pas — avec des études citées et des hypothèses challengeables. 95 % des pilotes IA échouent ; le diagnostic sert à faire partie des 5 %.

### De calculateur à diagnostic : trois actes
1. **Où ?** — Cartographie des gains (l'existant), reformulée en parcours guidé : mode express 2 min / mode expert (sliders actuels).
2. **Combien ?** — Quanti existant + quali manquant : niveau de confiance par estimation, risques, et un **score de potentiel 0–100** mémorisable et benchmarkable.
3. **Comment ?** — Roadmap **dérivée des réponses** : 3 quick wins nommés avec familles d'outils concrètes, séquence pilote adaptée à la taille, pièges par métier. C'est le contenu du rapport email.

### Tunnel cible
LinkedIn/blog/SEO → diagnostic 2–5 min (score + top 3 gratuits) → rapport complet contre email → séquence 2–3 emails + débrief 30 min (profils à fort potentiel) → offre payante.

### Offre (encore ouverte — recommandation)
Premier produit : **diagnostic approfondi payant** (continuité logique du gratuit, se vend sans réputation d'agence), qui alimente les **missions d'automatisation** (n8n, agents, scripts — cœur de compétence) ; formation en upsell. Modèle freemium transposable : gratuit → rapport ~100 € → audit ~500 € → mission.

**Actif unique à construire :** les données agrégées des diagnostics → baromètre récurrent « potentiel IA par métier » = flywheel contenu ↔ outil.

---

## 4. Plan d'action

### P0 — Assainir (~1 jour, avant toute promotion)
- [ ] Corriger les bugs visuels (`bar`/`badge` dans `getKColor`, classes Tailwind dynamiques, légende ↔ échelle)
- [ ] Border les entrées (min/max, division par zéro) et aligner 47 vs 52 semaines
- [ ] SEO de base : `lang="fr"`, titre, meta description, OpenGraph + image, favicon
- [ ] Poser Plausible/Umami + événements (complétion, métier, export)
- [ ] CTA minimal : bloc auteur + mauricemendy.com + LinkedIn sous les résultats
- [ ] Hygiène repo : README, retirer `recharts`, extraire les données métiers dans un module dédié

### P1 — Transformer (1–2 semaines)
- [ ] Parcours guidé en étapes : express 2 min / expert complet
- [ ] Score de potentiel 0–100 + profil + top 3 quick wins avec outils et niveau de confiance
- [ ] Roadmap générée depuis les réponses (métier, taille, adoption)
- [ ] Rapport personnalisé contre email : front statique + webhook n8n (capture → génération → envoi Resend/Brevo → liste)
- [ ] Implémenter réellement les coefficients ajustables + état dans l'URL
- [ ] Qualification légère : secteur, taille, rôle

### P2 — Brancher (continu)
- [ ] Migrer sur le domaine (ex. `diagnostic.mauricemendy.com`)
- [ ] Boucle contenu ↔ outil (articles → diagnostic → rapport → newsletter)
- [ ] Séquence email post-diagnostic + CTA débrief pour scores élevés
- [ ] Rafraîchir la base scientifique (MIT GenAI Divide, Bain 2026, DORA) + re-dater la validation terrain
- [ ] Publier les agrégats anonymisés (baromètre par métier)
- [ ] KPIs : complétion > 40 %, email 30–50 % des complétions, RDV 5–10 % des emails

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
- France Num / OMDIE — https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/diagnostic-numerique/quel-est-le-niveau-de-maturite-de-votre et https://www.observatoire-data-ia.fr/maturite-data
- Productivité.AI — https://www.productivite.ai/diagnostic-ia
- Seminaire.AI — https://www.seminaire.ai/blog/diagnostic-maturite-ia-pme
- Vertex Agility — https://vertexagility.com/free-assessments/ai-readiness/
- AI Readiness Partner — https://aireadinesspartner.com/ai-readiness-audit/free-assessment
- Microsoft AI Readiness — https://info.microsoft.com/ww-landing-ai-maturity-model-website.html?lcid=en-us
- Audity — https://auditynow.com/blog/best-ai-readiness-assessment-tools
- ScoreApp — https://www.scoreapp.com/
- Outgrow — https://outgrow.co/blog/interactive-forms-lead-generation-2025/
- Interact — https://www.tryinteract.com/blog/quiz-conversion-rate-report/
- MIT GenAI Divide (via Forbes) — https://www.forbes.com/sites/jaimecatmull/2025/08/22/mit-says-95-of-enterprise-ai-failsheres-what-the-5-are-doing-right/
- Bain / IDC stats — https://www.digitalapplied.com/blog/ai-agent-productivity-statistics-2026-roi-data-points
