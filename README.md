# Calculateur ROI GenAI

Un outil de simulation financière **transparent et méthodologiquement rigoureux** pour estimer le retour sur investissement de l'adoption d'outils d'IA générative (ChatGPT, Claude, etc.) dans des contextes professionnels.

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
    "tool": "Calculateur ROI GenAI - mauricemendy.com"
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
