# METRON

**Mesurer l'impact de l'IA, tâche par tâche.**

Un instrument de mesure — non un calculateur de ROI. METRON estime le temps que
l'IA générative peut libérer dans une équipe, tâche par tâche, à partir de
coefficients issus d'études publiées, en affichant ses conditions de mesure et
son domaine de validité.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

🔗 **Demo live :** [https://mauricemendy.github.io/mon-roi-ia/](https://mauricemendy.github.io/mon-roi-ia/)

---

## 🎯 Objectif

Contrairement aux calculateurs ROI "marketing" produits par les éditeurs SaaS, cet outil adopte une approche **académique et challengeable** :

✅ Coefficients issus d'**études peer-reviewed** (MIT, Harvard, NBER, Stanford)  
✅ **Sources complètes** avec liens vers les papers  
✅ **Export JSON** des hypothèses pour reproductibilité  
✅ Section **"Ce qui n'est PAS comptabilisé"** (coûts cachés)  
✅ Comparaison **théorique vs. données observées**  

> ⚠️ **Non encore implémenté :** l'ajustement des coefficients par l'utilisateur est
> prévu (le moteur sait déjà consommer des coefficients personnalisés) mais aucune
> interface ne l'expose à ce jour. Voir la [roadmap](#-roadmap).

**Public cible :** Managers, Directeurs Techniques, Consultants cherchant à **quantifier** l'impact de l'IA générative avec des hypothèses transparentes et défendables.

---

## 📊 Méthodologie

### Sources Académiques

Le calculateur s'appuie sur 4 études majeures publiées en 2023 :

1. **Dell'Acqua et al. (Harvard/Wharton)** - 758 consultants BCG  
   → [Navigating the Jagged Technological Frontier](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)

2. **Noy & Zhang (MIT Economics)** - 444 professionnels  
   → [Experimental Evidence on Productivity Effects](https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf)

3. **Brynjolfsson et al. (NBER/Stanford)** - 5,179 agents support  
   → [Generative AI at Work](https://www.nber.org/papers/w31161)

4. **Peng et al. (GitHub/Microsoft)** - 95,000+ développeurs  
   → [Impact of AI on Developer Productivity](https://arxiv.org/abs/2302.06590)

📖 **Documentation complète :** [SOURCES.md](./SOURCES.md)

### Formule de Calcul

```
Gain = Σ(Heures_tâche × k_tâche × Facteur_adoption) × Taux_horaire × 3.92 × N_collaborateurs
```

Où :
- **k_tâche** : Coefficient d'efficience issu des études (ex: 0.56 pour du code, 0.37 pour de la rédaction)
- **Facteur_adoption** : 0.5 à 1.0 (intègre validation humaine, courbe d'apprentissage, taux d'usage)
- **3.92** : Semaines travaillées par mois (**47 / 12**)
- **Taux_horaire** : coût chargé annuel rapporté aux heures *travaillées*, soit ÷ **1 762,5 h** (47 × 37,5).
  Le rapporter à 52 semaines sous-estimerait le coût réel d'une heure et annulerait l'effet des 47 semaines.

### Ce que le résultat en euros représente

**La valeur du temps libéré, pas une économie de trésorerie.** À effectif constant, aucun euro
n'entre en caisse : les heures sont réallouées à d'autres travaux, et valorisées au taux horaire
saisi. L'économie n'est réelle que si l'effectif ou la dépense de sous-traitance diminue
effectivement.

### Pourquoi 47 semaines et non 52

L'année de référence est l'année **travaillée** : 52 semaines moins les 5 semaines
de congés payés. Un collaborateur en congé ne produit aucun gain, alors que la
licence se paie douze mois sur douze — retenir 52 surestimerait le résultat
d'environ 9,5 %.

Ces 47 semaines ne déduisent que les congés payés : ni les jours fériés
(~11 jours), ni les RTT. L'estimation reste donc un majorant à ce titre.

---

## 🚀 Installation & Utilisation

### En local

```bash
# Clone
git clone https://github.com/mauricemendy/mon-roi-ia.git
cd mon-roi-ia

# Install
npm install

# Run
npm run dev
```

### Intégration dans votre projet

```tsx
import ROICalculator from './ROICalculator';

function App() {
  return <ROICalculator />;
}
```

**Prérequis :**
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Mesure d'audience (optionnelle)

L'instrumentation cible **Umami auto-hébergé**, sans cookie et sans bandeau de
consentement. Elle est **inerte par défaut** : sans les deux variables
ci-dessous, aucun script n'est chargé et aucune requête n'est émise.

```bash
cp .env.example .env.local   # puis renseigner les deux valeurs
```

| Variable | Rôle |
|---|---|
| `VITE_UMAMI_URL` | URL du serveur Umami |
| `VITE_UMAMI_WEBSITE_ID` | Identifiant du site dans Umami |

Six événements sont relevés : `parcours_demarre`, `etape_franchie`,
`mesure_affichee`, `affinage_ouvert`, `hypotheses_exportees`, `lien_copie`.

### Lien de mesure

Toute la configuration voyage dans l'URL. Un lien partagé rouvre exactement le
même relevé, **sans dépendre d'aucun serveur** — il reste donc valide si la base
est indisponible, et fonctionne sur un hébergement statique. Une URL invalide
retombe sur l'assistant plutôt que d'appliquer un état partiel.

### Parcours de lecture

Le résultat renvoie vers les articles qui traitent **les tâches où la mesure
indique le plus de potentiel** — classés par contribution, pas par date, et en
accès libre. C'est le levier que rien ne remplace : une échelle de potentiel se
copie en une semaine, un corpus non.

Le mapping vit dans `src/data/lectures.ts`. Tant qu'il est vide, le bloc
n'apparaît pas. La grille à remplir, classée par levier, est dans
[docs/mapping-taches-articles.md](./docs/mapping-taches-articles.md).

Les identifiants de tâche (`t1`, `t2`…) étant positionnels, chaque entrée
rappelle le libellé attendu. En cas de dérive, le mapping est ignoré et un
avertissement s'affiche en développement : mieux vaut ne rien proposer qu'un
lien faux.

### Inscription (optionnelle)

`VITE_METRON_SUBSCRIBE_URL` pointe vers un Worker qui capte vers **Brevo en
double opt-in**. Le dépôt ne connaît qu'une URL : la clé, la liste et le routage
vivent dans le Worker.

Sans la variable, le bloc n'apparaît pas et rien n'est émis. Elle restera vide
jusqu'à la migration de domaine — le Worker n'a pas d'origine CORS stable tant
que l'outil vit sur `github.io`.

La mesure reste **entière et gratuite** : l'inscription propose la suite, pas
l'accès. Contrat d'attributs, routage et points ouverts :
[docs/capture-contrat.md](./docs/capture-contrat.md).

### Table des relevés (optionnelle)

`VITE_METRON_COLLECT_URL` reçoit un relevé anonyme par configuration mesurée,
sans retour et sans bloquer l'écran. Schéma de la table, requêtes du baromètre
et consigne de sauvegarde : [docs/barometre-schema.md](./docs/barometre-schema.md).

**Les charges utiles ne transportent aucune donnée identifiante** — uniquement
le métier, le numéro d'étape et des ordres de grandeur. C'est ce qui maintient
le dispositif dans les conditions d'exemption de consentement de la CNIL. Une
mention dans la politique de confidentialité et un moyen de refus restent
néanmoins dus.

---

## 📸 Captures d'écran

### Interface principale
*(à ajouter)*

### Section Sources
*(à ajouter)*

---

## ⚠️ Limites Reconnues

Le calculateur **NE prend PAS en compte** :
- ❌ Temps de formation initiale (2-4 semaines)
- ❌ Courbe d'apprentissage du prompt engineering
- ❌ Coûts de setup technique (API, intégrations)
- ❌ Résistance organisationnelle au changement
- ❌ Échecs sur tâches très spécialisées
- ❌ Maintenance des prompts dans le temps

---

## 🔬 Validation

Des données observées sur un échantillon anonymisé de **12 professionnels** (ingénieurs, consultants, marketeurs) ayant adopté les automatisations  et l'usage de l'ia générative pendant 6 mois montrent :

- **Écart moyen théorique/observé : -7%**
- Scripts & automatisation : 52% observé vs 56% théorique
- Rédaction rapports : 33% vs 37%
- Recherche normative : 38% vs 40%

**Explication :** Temps de relecture systématique (~10%) + cas d'échec (~5%).

---

## 🛠️ Stack Technique

- **Framework :** React 18 + TypeScript
- **Styling :** Tailwind CSS
- **Components :** shadcn/ui (Radix UI)
- **Icons :** Lucide React
- **Build :** Vite

---

## 📦 Export des Données

L'outil permet d'**exporter un JSON** complet contenant :
- Configuration (métier, collaborateurs, taux horaire)
- Coefficients appliqués (avec sources)
- Facteur d'adoption
- Résultats calculés
- Références académiques complètes

**Format :** `hypotheses-roi-genai-{metier}-{adoption}.json`

Exemple :
```json
{
  "metadata": {
    "version": "1.4",
    "date": "2026-08-25T14:30:00Z",
    "tool": "METRON - mauricemendy.com"
  },
  "configuration": {
    "profession": "engineering",
    "collaborateurs": 5,
    "tauxHoraire": 45,
    "facteurAdoption": 0.85
  },
  "coefficients": [...],
  "resultats": {...},
  "sources": [...]
}
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des améliorations :

1. **Fork** le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m 'Ajout de X'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une **Pull Request**

**Types de contributions appréciées :**
- 📚 Ajout de nouvelles sources académiques
- 🔢 Affinage des coefficients par secteur
- 🌍 Traductions (EN, ES, DE)
- 🐛 Corrections de bugs
- 📊 Améliorations UI/UX

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](./LICENSE) pour plus de détails.

**En résumé :** Vous pouvez utiliser, modifier et distribuer ce code librement, y compris dans des projets commerciaux, à condition de conserver l'attribution.

---

## ✍️ Auteur

**Maurice Mendy**  
Ingénieur Calcul Senior @ Air Liquide Engineering & Construction
Développeur python
Spécialisé en optimisation de process, automatisation et analyse stratégique des outils IA/no-code

🌐 [mauricemendy.com](https://mauricemendy.com)  
💼 [LinkedIn](https://www.linkedin.com/in/mauricemendy)  

---

## 🙏 Remerciements

- Équipes de recherche MIT, Harvard, Stanford, NBER pour les études source
- Communauté open-source pour les outils utilisés (React, Tailwind, shadcn/ui)
- Bêta-testeurs pour leurs retours

---

## 📈 Roadmap

- [ ] Ajustement des coefficients par l'utilisateur (interface manquante)
- [ ] Page de résultat partageable par URL
- [ ] Version multilingue (EN, ES, DE)
- [ ] Export PDF avec graphiques
- [ ] Comparaison inter-secteurs
- [ ] API REST pour intégrations
- [ ] Mode "équipe" avec agrégation multi-utilisateurs
- [ ] Dashboard d'évolution dans le temps

---

## ⭐ Star History

Si ce projet vous est utile, n'hésitez pas à lui donner une ⭐ sur GitHub !

---

**Version actuelle :** 1.4  
**Dernière mise à jour :** Août 2026
