import { useState, useMemo, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { collect } from "@/lib/collect";
import { decodeState, shareUrl } from "@/lib/shareState";
import { Clock, ChevronDown, ChevronUp, BookOpen, Download, AlertTriangle, BarChart3, ExternalLink } from "lucide-react";

interface Task {
  id: string;
  label: string;
  percentage: string;
  defaultHours: number;
  k: number;
  source?: string;
  sourceUrl?: string;
  realWorld?: number;
}

const PROFESSIONS = {
  engineering: {
    label: "Ingénierie & Bureau d'Études",
    tasks: [
      { id: 't1', label: "Calculs & Études techniques", percentage: "32%", defaultHours: 12, k: 0.15 },
      { id: 't2', label: "Scripts & Automatisation", percentage: "13%", defaultHours: 5, k: 0.56, source: "Peng et al., 2023", sourceUrl: "https://arxiv.org/abs/2302.06590", realWorld: 0.52 },
      { id: 't3', label: "Recherche normative", percentage: "16%", defaultHours: 6, k: 0.40, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.38 },
      { id: 't4', label: "Rédaction rapports", percentage: "11%", defaultHours: 4, k: 0.37, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.33 },
      { id: 't5', label: "Réunions coordination", percentage: "11%", defaultHours: 4, k: 0.20 },
      { id: 't6', label: "Emails & suivi projets", percentage: "8%", defaultHours: 3, k: 0.35 },
      { id: 't7', label: "Vérification qualité", percentage: "5%", defaultHours: 2, k: 0.25 },
      { id: 't8', label: "Veille technique", percentage: "3%", defaultHours: 1, k: 0.45 },
      { id: 't9', label: "Formation", percentage: "1%", defaultHours: 0.5, k: 0.35 }
    ]
  },
  marketing: {
    label: "Marketing & Communication",
    tasks: [
      { id: 't1', label: "Création de contenu", percentage: "27%", defaultHours: 10, k: 0.59, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.54 },
      { id: 't2', label: "Social Media", percentage: "16%", defaultHours: 6, k: 0.63, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.58 },
      { id: 't3', label: "Optimisation SEO", percentage: "11%", defaultHours: 4, k: 0.40, source: "Peng et al., 2023", sourceUrl: "https://arxiv.org/abs/2302.06590", realWorld: 0.36 },
      { id: 't4', label: "Stratégie & Planning", percentage: "8%", defaultHours: 3, k: 0.20 },
      { id: 't5', label: "Réunions créatives", percentage: "11%", defaultHours: 4, k: 0.15 },
      { id: 't6', label: "Emails & coordination", percentage: "8%", defaultHours: 3, k: 0.40 },
      { id: 't7', label: "Gestion outils", percentage: "7%", defaultHours: 2.5, k: 0.30 },
      { id: 't8', label: "Veille concurrentielle", percentage: "5%", defaultHours: 2, k: 0.45 },
      { id: 't9', label: "Campagnes & A/B", percentage: "5%", defaultHours: 2, k: 0.35 },
      { id: 't10', label: "Formation", percentage: "3%", defaultHours: 1, k: 0.35 }
    ]
  },
  sales: {
    label: "Sales & Business Dev",
    tasks: [
      { id: 't1', label: "Prospection RDV clients", percentage: "32%", defaultHours: 12, k: 0 },
      { id: 't2', label: "Emails prospection", percentage: "13%", defaultHours: 5, k: 0.42, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.39 },
      { id: 't3', label: "Saisie CRM", percentage: "11%", defaultHours: 4, k: 0.28, source: "Peng et al., 2023", sourceUrl: "https://arxiv.org/abs/2302.06590", realWorld: 0.26 },
      { id: 't4', label: "Synthèse comptes", percentage: "8%", defaultHours: 3, k: 0.35, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.32 },
      { id: 't5', label: "Réunions équipe", percentage: "9%", defaultHours: 3.5, k: 0.20 },
      { id: 't6', label: "Préparation offres", percentage: "8%", defaultHours: 3, k: 0.40 },
      { id: 't7', label: "Négociation", percentage: "5%", defaultHours: 2, k: 0 },
      { id: 't8', label: "Suivi administratif", percentage: "5%", defaultHours: 2, k: 0.30 },
      { id: 't9', label: "Formation produits", percentage: "4%", defaultHours: 1.5, k: 0.30 },
      { id: 't10', label: "Reporting activité", percentage: "4%", defaultHours: 1.5, k: 0.45 }
    ]
  },
  finance: {
    label: "Comptabilité & Finance",
    tasks: [
      { id: 't1', label: "Saisie & Rapprochement", percentage: "27%", defaultHours: 10, k: 0.44, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.40 },
      { id: 't2', label: "Analyse d'écarts", percentage: "16%", defaultHours: 6, k: 0.38, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.34 },
      { id: 't3', label: "Préparation bilans", percentage: "13%", defaultHours: 5, k: 0.26, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.23 },
      { id: 't4', label: "Recherche infos fiscales", percentage: "8%", defaultHours: 3, k: 0.45 },
      { id: 't5', label: "Réunions clients/équipe", percentage: "8%", defaultHours: 3, k: 0.20 },
      { id: 't6', label: "Emails & relances", percentage: "7%", defaultHours: 2.5, k: 0.40 },
      { id: 't7', label: "Contrôles & validations", percentage: "5%", defaultHours: 2, k: 0.30 },
      { id: 't8', label: "Veille réglementaire", percentage: "5%", defaultHours: 2, k: 0.45 },
      { id: 't9', label: "Reporting", percentage: "5%", defaultHours: 2, k: 0.50 },
      { id: 't10', label: "Reprises dossiers", percentage: "4%", defaultHours: 1.5, k: 0.25 },
      { id: 't11', label: "Formation continue", percentage: "1%", defaultHours: 0.5, k: 0.35 }
    ]
  },
  hr: {
    label: "Ressources Humaines",
    tasks: [
      { id: 't1', label: "Tri CV & Screening", percentage: "21%", defaultHours: 8, k: 0.52, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.48 },
      { id: 't2', label: "Entretiens & évaluations", percentage: "16%", defaultHours: 6, k: 0 },
      { id: 't3', label: "Gestion administrative RH", percentage: "13%", defaultHours: 5, k: 0.35 },
      { id: 't4', label: "Réponses FAQ employés", percentage: "11%", defaultHours: 4, k: 0.47, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.44 },
      { id: 't5', label: "Réunions managers", percentage: "11%", defaultHours: 4, k: 0.20 },
      { id: 't6', label: "Supports formation", percentage: "8%", defaultHours: 3, k: 0.39, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.36 },
      { id: 't7', label: "Emails & coordination", percentage: "7%", defaultHours: 2.5, k: 0.40 },
      { id: 't8', label: "Gestion SIRH & paie", percentage: "5%", defaultHours: 2, k: 0.30 },
      { id: 't9', label: "Veille juridique RH", percentage: "4%", defaultHours: 1.5, k: 0.45 },
      { id: 't10', label: "Reporting RH", percentage: "4%", defaultHours: 1.5, k: 0.50 }
    ]
  },
  admin: {
    label: "Secrétariat & Admin",
    tasks: [
      { id: 't1', label: "Gestion agenda", percentage: "21%", defaultHours: 8, k: 0.41, source: "Peng et al., 2023", sourceUrl: "https://arxiv.org/abs/2302.06590", realWorld: 0.38 },
      { id: 't2', label: "Comptes-rendus", percentage: "16%", defaultHours: 6, k: 0.54, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.49 },
      { id: 't3', label: "Traitement emails", percentage: "13%", defaultHours: 5, k: 0.45 },
      { id: 't4', label: "Archivage", percentage: "11%", defaultHours: 4, k: 0.35, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.32 },
      { id: 't5', label: "Accueil physique", percentage: "9%", defaultHours: 3.5, k: 0 },
      { id: 't6', label: "Coordination réunions", percentage: "8%", defaultHours: 3, k: 0.35 },
      { id: 't7', label: "Saisie documents", percentage: "7%", defaultHours: 2.5, k: 0.40 },
      { id: 't8', label: "Suivi administratif", percentage: "5%", defaultHours: 2, k: 0.35 },
      { id: 't9', label: "Gestion fournitures", percentage: "4%", defaultHours: 1.5, k: 0.20 },
      { id: 't10', label: "Support technique", percentage: "3%", defaultHours: 1, k: 0.25 },
      { id: 't11', label: "Tâches ponctuelles", percentage: "3%", defaultHours: 1, k: 0.30 }
    ]
  },
  executive: {
    label: "Direction Générale",
    tasks: [
      { id: 't1', label: "Réunions stratégiques", percentage: "27%", defaultHours: 10, k: 0.15 },
      { id: 't2', label: "Synthèse rapports", percentage: "16%", defaultHours: 6, k: 0.61, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.53 },
      { id: 't3', label: "Interactions externes", percentage: "13%", defaultHours: 5, k: 0 },
      { id: 't4', label: "Préparation présentations", percentage: "11%", defaultHours: 4, k: 0.45, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.40 },
      { id: 't5', label: "Emails & communication", percentage: "9%", defaultHours: 3.5, k: 0.40 },
      { id: 't6', label: "Décisions stratégiques", percentage: "8%", defaultHours: 3, k: 0 },
      { id: 't7', label: "Veille concurrentielle", percentage: "5%", defaultHours: 2, k: 0.38, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.35 },
      { id: 't8', label: "1-on-1 directs", percentage: "5%", defaultHours: 2, k: 0 },
      { id: 't9', label: "Travail solo/réflexion", percentage: "4%", defaultHours: 1.5, k: 0.20 },
      { id: 't10', label: "Revue financière", percentage: "1%", defaultHours: 0.5, k: 0.35 }
    ]
  },
  legal: {
    label: "Service Juridique",
    tasks: [
      { id: 't1', label: "Analyse contrats", percentage: "27%", defaultHours: 10, k: 0.48, source: "Dell'Acqua et al., 2023", sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321", realWorld: 0.42 },
      { id: 't2', label: "Recherche jurisprudence", percentage: "16%", defaultHours: 6, k: 0.43, source: "Brynjolfsson et al., 2023", sourceUrl: "https://www.nber.org/papers/w31161", realWorld: 0.39 },
      { id: 't3', label: "Rédaction documents", percentage: "13%", defaultHours: 5, k: 0.36, source: "Noy & Zhang, 2023", sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf", realWorld: 0.33 },
      { id: 't4', label: "Conseil interne", percentage: "11%", defaultHours: 4, k: 0.15 },
      { id: 't5', label: "Réunions clients/équipe", percentage: "9%", defaultHours: 3.5, k: 0.20 },
      { id: 't6', label: "Emails & correspondance", percentage: "8%", defaultHours: 3, k: 0.40 },
      { id: 't7', label: "Veille réglementaire", percentage: "5%", defaultHours: 2, k: 0.45 },
      { id: 't8', label: "Gestion contentieux", percentage: "4%", defaultHours: 1.5, k: 0.25 },
      { id: 't9', label: "Suivi dossiers", percentage: "4%", defaultHours: 1.5, k: 0.35 },
      { id: 't10', label: "Formation continue", percentage: "3%", defaultHours: 1, k: 0.35 }
    ]
  }
};

// --- Hypothèses temporelles ---------------------------------------------
// On raisonne en année *travaillée*, pas en année pleine : 52 semaines moins
// les 5 semaines de congés payés. Un collaborateur en congé ne produit aucun
// gain, alors que la licence, elle, se paie douze mois sur douze — retenir 52
// surestimerait le gain d'environ 9,5 %.
// Ces 47 semaines ne déduisent que les congés payés : ni les jours fériés
// (~11 jours), ni les RTT. L'estimation reste donc un majorant à ce titre.
const WORKED_WEEKS_PER_YEAR = 47;
// Semaines travaillées ramenées au mois, pour les montants mensuels (≈ 3.92).
const WORKED_WEEKS_PER_MONTH = WORKED_WEEKS_PER_YEAR / 12;
// Journée de référence, pour convertir des heures en jours libérés.
const HOURS_PER_DAY = 7.5;
// Semaine de référence déclarée par l'utilisateur.
const HOURS_PER_WEEK = 37.5;
// Assiette du taux horaire : les heures réellement travaillées dans l'année.
// C'est le dénominateur qui rend le taux cohérent avec l'année travaillée —
// rapporter le coût chargé à 52 semaines sous-estimerait le coût d'une heure.
const WORKED_HOURS_PER_YEAR = WORKED_WEEKS_PER_YEAR * HOURS_PER_WEEK; // 1762.5

// Ramène une saisie de champ numérique dans [min, max]. Un champ vidé ou une
// saisie non numérique retombe sur la valeur de repli plutôt que sur NaN.
const clampNumber = (raw: string, min: number, max: number, fallback: number) => {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

// Échelle de potentiel. Les classes sont écrites en toutes lettres : Tailwind
// ne génère que ce qu'il trouve statiquement dans les sources.
// L'ordre des couleurs suit la légende affichée dans la colonne de configuration.
const getKColor = (k: number) => {
  if (k === 0) return { bar: 'bg-pot-hors', badge: 'bg-sunk text-ink-3', label: 'Hors domaine' };
  if (k < 0.3) return { bar: 'bg-pot-faible', badge: 'bg-sunk text-ink-2', label: 'Potentiel faible' };
  if (k < 0.5) return { bar: 'bg-pot-moyen', badge: 'bg-sunk text-ink-2', label: 'Potentiel moyen' };
  return { bar: 'bg-pot-fort', badge: 'bg-sunk text-ink', label: 'Fort potentiel' };
};

// Graduations de la règle : un trait tous les 2,5 h, chiffré tous les 5 h.
// Calées sur le total réellement déclaré, qui n'est pas forcément la semaine
// de référence — l'utilisateur peut déclarer plus ou moins.
const rulerTicks = (span: number) =>
  Array.from(
    { length: Math.floor(span / 2.5) + 1 },
    (_, i) => ({ h: i * 2.5, major: (i * 2.5) % 5 === 0 })
  );

// Séquence d'adoption. Encore identique pour tous : la dériver des réponses
// (métier, taille d'équipe, adoption) reste à faire — l'écran le dit en clair
// plutôt que de laisser croire à une recommandation personnalisée.
const ADOPTION_PHASES = [
  {
    title: 'Pilote',
    weeks: 'S1–S2',
    items: ['Sélection de 2-3 early adopters', 'Focus sur les tâches k ≥ 0,50', 'Mesure des gains réels']
  },
  {
    title: 'Formation',
    weeks: 'S3–S4',
    items: ['Ateliers de prompting', 'Partage des pratiques', "Documentation des cas d'usage"]
  },
  {
    title: 'Déploiement',
    weeks: 'S5–S8',
    items: ["Extension à l'équipe complète", 'Support continu', 'Ajustement des workflows']
  },
  {
    title: 'Optimisation',
    weeks: 'S9–S12',
    items: ['Analyse du ROI réel', 'Identification de nouvelles tâches', 'Montée en maturité']
  }
] as const;

// Les trois groupes repliables de la configuration, dérivés du même barème que
// la légende — c'est ce qui empêche les deux de rediverger comme auparavant.
const POTENTIAL_GROUPS = [
  { bucket: 'high', title: 'Fort potentiel — k ≥ 0,50', bar: 'bg-pot-fort' },
  { bucket: 'medium', title: 'Potentiel moyen — 0,30 à 0,49', bar: 'bg-pot-moyen' },
  { bucket: 'low', title: 'Faible ou hors domaine — k < 0,30', bar: 'bg-pot-faible' }
] as const;

// Bornes de l'échelle, réutilisées par la légende et la décomposition.
const POTENTIAL_SCALE = [
  { key: 'fort', bar: 'bg-pot-fort', label: 'Fort', rule: 'k ≥ 0,50' },
  { key: 'moyen', bar: 'bg-pot-moyen', label: 'Moyen', rule: '0,30 à 0,49' },
  { key: 'faible', bar: 'bg-pot-faible', label: 'Faible', rule: 'k < 0,30' },
  { key: 'hors', bar: 'bg-pot-hors', label: 'Hors domaine', rule: 'k = 0' }
] as const;

type ProfessionKey = keyof typeof PROFESSIONS;
const INITIAL_PROFESSION: ProfessionKey = 'engineering';

/** Relit une mesure partagée, si l'URL en porte une. */
function readSharedState() {
  if (typeof window === 'undefined') return null;
  return decodeState(
    window.location.search,
    key => Object.prototype.hasOwnProperty.call(PROFESSIONS, key),
    key => PROFESSIONS[key as ProfessionKey].tasks.length
  );
}

export default function ROICalculator() {
  // Parcours en trois étapes. L'affinage n'est pas une étape : c'est un
  // dépliage optionnel de l'étape 3, pour que l'analyste voie la mesure bouger
  // pendant qu'il règle, au lieu de régler à l'aveugle avant de la découvrir.
  // Une mesure partagée arrive complète : on ouvre directement sur le
  // résultat, sans repasser par l'assistant.
  const [restored] = useState(readSharedState);

  const [step, setStep] = useState<1 | 2 | 3>(restored ? 3 : 1);
  const [refining, setRefining] = useState(false);

  // Un relevé de parcours par visite. Le garde-fou évite le doublon que
  // StrictMode provoque en développement.
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    track('parcours_demarre');
  }, []);

  const advanceTo = (next: 1 | 2 | 3) => {
    setStep(next);
    track('etape_franchie', { etape: next });
  };

  const toggleRefining = () => {
    const open = !refining;
    setRefining(open);
    if (open) track('affinage_ouvert', { metier: prof });
  };

  const [prof, setProf] = useState<ProfessionKey>(
    (restored?.prof as ProfessionKey) ?? INITIAL_PROFESSION
  );
  const [collabs, setCollabs] = useState(restored?.collabs ?? 5);
  // Le coût se saisit au choix à l'heure ou à l'année. Une seule des deux
  // valeurs pilote le calcul à la fois — celle du mode actif — et la bascule
  // reporte la valeur courante dans l'autre, pour qu'elles ne divergent jamais.
  const [rateMode, setRateMode] = useState<'horaire' | 'annuel'>(restored?.rateMode ?? 'horaire');
  const [rate, setRate] = useState(restored?.rate ?? 45);
  const [annualCost, setAnnualCost] = useState(
    Math.round((restored?.rate ?? 45) * WORKED_HOURS_PER_YEAR)
  );
  // Dérivé du métier initial, et non figé sur « engineering » : sinon les
  // heures d'un métier fuient vers un autre si le défaut change.
  const [hours, setHours] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const key = (restored?.prof as ProfessionKey) ?? INITIAL_PROFESSION;
    PROFESSIONS[key].tasks.forEach((task, i) => {
      initial[task.id] = restored?.hours?.[i] ?? task.defaultHours;
    });
    return initial;
  });
  const [adoptionFactor, setAdoptionFactor] = useState(restored?.adoption ?? 0.85);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showRealWorld, setShowRealWorld] = useState(false);
  const [customCoefficients, setCustomCoefficients] = useState<number[] | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    high: true,
    medium: false,
    low: false
  });

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  // Taux horaire effectivement appliqué : saisi directement, ou dérivé du coût
  // chargé annuel divisé par les heures travaillées.
  const effectiveRate = useMemo(() => {
    if (rateMode === 'annuel') {
      return Number.isFinite(annualCost) ? annualCost / WORKED_HOURS_PER_YEAR : 0;
    }
    return rate;
  }, [rateMode, rate, annualCost]);

  // Contrepartie affichée sous le champ, pour que les deux bases restent visibles.
  const derivedAnnualCost = effectiveRate * WORKED_HOURS_PER_YEAR;

  const switchRateMode = (mode: 'horaire' | 'annuel') => {
    if (mode === rateMode) return;
    // On reporte la valeur courante dans la base cible avant de basculer.
    if (mode === 'annuel') setAnnualCost(Math.round(effectiveRate * WORKED_HOURS_PER_YEAR));
    else setRate(Math.round(effectiveRate * 100) / 100);
    setRateMode(mode);
  };

  const results = useMemo(() => {
    const currentTasks = PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks;
    const licenceCost = 30;

    // Les champs numériques peuvent transiter par NaN (champ vidé, saisie non
    // numérique). On les ramène dans le domaine avant tout calcul, sinon le NaN
    // se propage jusqu'à l'affichage.
    const safeCollabs = Number.isFinite(collabs) ? Math.max(1, Math.round(collabs)) : 1;
    const safeRate = Number.isFinite(effectiveRate) ? Math.max(0, effectiveRate) : 0;

    const hoursPerWeek = currentTasks.reduce((acc, t, i) => {
      const h = hours[t.id] || t.defaultHours;
      const k = customCoefficients?.[i] ?? t.k;
      return acc + (h * k * adoptionFactor);
    }, 0);

    // Borne basse de l'intervalle : on substitue le coefficient observé sur le
    // terrain là où il existe, et on garde le théorique ailleurs. On ne
    // décote donc que ce qui a effectivement été mesuré.
    const hoursPerWeekObserved = currentTasks.reduce((acc, t, i) => {
      const h = hours[t.id] || t.defaultHours;
      const k = customCoefficients?.[i] ?? t.realWorld ?? t.k;
      return acc + (h * k * adoptionFactor);
    }, 0);

    const totalHours = currentTasks.reduce((acc, t) => acc + (hours[t.id] || t.defaultHours), 0);

    // Année travaillée, cf. WORKED_WEEKS_PER_YEAR. Le coût de licence, lui,
    // court sur les 12 mois : le rapport gain/coût intègre donc les congés.
    const grossGain = hoursPerWeek * safeRate * WORKED_WEEKS_PER_MONTH * safeCollabs;
    const grossGainObserved = hoursPerWeekObserved * safeRate * WORKED_WEEKS_PER_MONTH * safeCollabs;
    const totalCost = safeCollabs * licenceCost;

    const sourcedCount = currentTasks.filter(t => t.source).length;

    return {
      hoursPerWeek: hoursPerWeek.toFixed(1),
      hoursPerWeekRaw: hoursPerWeek,
      // Lecture principale : deux décimales, séparateur français. C'est la
      // précision que l'affichage revendique, elle doit être tenue.
      hoursPerWeekPrecise: hoursPerWeek.toLocaleString('fr-FR', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }),
      hoursPerWeekFr: hoursPerWeek.toLocaleString('fr-FR', { maximumFractionDigits: 1 }),
      hoursTeam: (hoursPerWeek * safeCollabs).toLocaleString('fr-FR', { maximumFractionDigits: 1 }),
      totalHours,
      grossGain: Math.round(grossGain),
      netObserved: Math.round(grossGainObserved - totalCost),
      totalCost,
      sourcedCount,
      taskCount: currentTasks.length,
      extraTimeYear: (hoursPerWeek * WORKED_WEEKS_PER_YEAR / HOURS_PER_DAY).toFixed(0),
      percentTime: ((hoursPerWeek / HOURS_PER_WEEK) * 100).toFixed(0),
      percentTotal: totalHours > 0 ? ((hoursPerWeek / totalHours) * 100).toFixed(0) : '0',
      gain: Math.round(grossGain),
      net: Math.round(grossGain - totalCost),
      roi: grossGain > 0 ? (grossGain / totalCost).toFixed(1) : '—',
      // Plancher à 1 : un seuil franchi en moins d'une journée s'arrondissait à
      // « Jour 0 », qui ne veut rien dire.
      breakeven: grossGain > 0
        ? `Jour ${Math.min(30, Math.max(1, Math.round(totalCost / (grossGain / 30))))}`
        : '—'
    };
  }, [prof, collabs, effectiveRate, hours, adoptionFactor, customCoefficients]);

  // La mesure elle-même, relevée une fois par métier atteint. Le métier et la
  // part de temps mesurée sont les deux dimensions dont le baromètre aura
  // besoin ; l'effectif et le taux restent hors de la mesure d'audience.
  const measured = useRef<string | null>(null);
  useEffect(() => {
    if (step !== 3) return;
    if (measured.current === prof) return;
    measured.current = prof;
    track('mesure_affichee', { metier: prof, part_mesuree: Number(results.percentTotal) });
  }, [step, prof, results.percentTotal]);


  const handleProfessionChange = (newProf: ProfessionKey) => {
    setProf(newProf);
    const newHours: Record<string, number> = {};
    PROFESSIONS[newProf].tasks.forEach(task => {
      newHours[task.id] = task.defaultHours;
    });
    setHours(newHours);
    setCustomCoefficients(null);
  };

  const exportHypotheses = () => {
    track('hypotheses_exportees', { metier: prof });
    const data = {
      metadata: {
        version: "1.4",
        date: new Date().toISOString(),
        tool: "METRON - mauricemendy.com"
      },
      configuration: {
        profession: prof,
        professionLabel: PROFESSIONS[prof as keyof typeof PROFESSIONS].label,
        collaborateurs: collabs,
        baseDeSaisie: rateMode === 'annuel' ? "coût chargé annuel" : "taux horaire",
        tauxHoraire: Number(effectiveRate.toFixed(2)),
        coutChargeAnnuel: Math.round(derivedAnnualCost),
        heuresParTache: hours,
        facteurAdoption: adoptionFactor
      },
      hypotheses: {
        semainesTravailleesParAn: WORKED_WEEKS_PER_YEAR,
        facteurMensuel: Number(WORKED_WEEKS_PER_MONTH.toFixed(4)),
        heuresParJour: HOURS_PER_DAY,
        heuresParSemaine: HOURS_PER_WEEK,
        heuresTravailleesParAn: WORKED_HOURS_PER_YEAR,
        coutLicenceMensuel: 30,
        baseTauxHoraire: `Coût chargé annuel / ${WORKED_HOURS_PER_YEAR} h travaillées (${WORKED_WEEKS_PER_YEAR} x ${HOURS_PER_WEEK}). Valorisation au coût, non au taux de facturation.`,
        note: "47 semaines = 52 - 5 semaines de congés payés. Les jours fériés et les RTT ne sont pas déduits ; la licence est comptée sur 12 mois.",
        natureDuResultat: "Valeur du temps libéré, et non une économie de trésorerie : à effectif constant les heures sont réallouées, pas encaissées."
      },
      coefficients: PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map((t, i) => ({
        tache: t.label,
        pourcentageTemps: t.percentage,
        heuresDefaut: t.defaultHours,
        k_theorique: t.k,
        k_ajuste: customCoefficients?.[i] ?? t.k,
        source: t.source,
        sourceUrl: t.sourceUrl
      })),
      resultats: results,
      sources: [
        {
          title: "Navigating the Jagged Technological Frontier",
          authors: "Dell'Acqua, F., McFowland, E., Mollick, E. R., et al.",
          year: 2023,
          institution: "Harvard Business School / Wharton",
          url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321"
        },
        {
          title: "Experimental Evidence on the Productivity Effects of Generative AI",
          authors: "Noy, S., & Zhang, W.",
          year: 2023,
          institution: "MIT Economics",
          url: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf"
        },
        {
          title: "Generative AI at Work",
          authors: "Brynjolfsson, E., Li, D., & Raymond, L.",
          year: 2023,
          institution: "NBER",
          url: "https://www.nber.org/papers/w31161"
        },
        {
          title: "The Impact of AI on Developer Productivity",
          authors: "Peng, S., et al.",
          year: 2023,
          institution: "GitHub / Microsoft Research",
          url: "https://arxiv.org/abs/2302.06590"
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypotheses-roi-genai-${prof}-${adoptionFactor.toFixed(2)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAdoptionLabel = () => {
    if (adoptionFactor < 0.7) return "Déploiement pilote";
    if (adoptionFactor < 0.85) return "Adoption progressive";
    return "Équipe formée";
  };

  const currentTasks = PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks;

  // Grouper les tâches par niveau de potentiel
  const tasksByPotential = useMemo(() => {
    const high = currentTasks.filter(t => t.k >= 0.5);
    const medium = currentTasks.filter(t => t.k >= 0.3 && t.k < 0.5);
    const low = currentTasks.filter(t => t.k < 0.3);
    
    return { high, medium, low };
  }, [currentTasks]);

  const getSectionStats = (tasks: Task[]) => {
    const totalHours = tasks.reduce((acc, t) => acc + (hours[t.id] || t.defaultHours), 0);
    return { count: tasks.length, hours: totalHours.toFixed(1) };
  };

  // Décomposition par tâche, triée par contribution décroissante. Sert le
  // tableau à barres du résultat, qui remplace l'ancien « Top 3 ».
  // Les heures ont-elles été touchées ? Distingue dans le baromètre une mesure
  // express d'une mesure affinée par quelqu'un qui connaît son terrain.
  const hoursDifferFromDefaults = useMemo(
    () => currentTasks.some(t => (hours[t.id] ?? t.defaultHours) !== t.defaultHours),
    [currentTasks, hours]
  );

  const measureUrl = useMemo(
    () => shareUrl({
      prof,
      collabs,
      rate: effectiveRate,
      adoption: adoptionFactor,
      rateMode,
      hours: hoursDifferFromDefaults
        ? currentTasks.map(t => hours[t.id] ?? t.defaultHours)
        : undefined
    }),
    [prof, collabs, effectiveRate, adoptionFactor, rateMode, currentTasks, hours, hoursDifferFromDefaults]
  );

  // Relevé pour le baromètre. Temporisé : sans cela, chaque déplacement de
  // curseur en mode affinage produirait une ligne. Le module déduplique par
  // configuration, la temporisation évite seulement les envois inutiles.
  useEffect(() => {
    if (step !== 3) return;
    const t = setTimeout(() => {
      collect({
        metier: prof,
        effectif: collabs,
        tauxHoraire: Number(effectiveRate.toFixed(2)),
        adoption: adoptionFactor,
        semainesTravaillees: WORKED_WEEKS_PER_YEAR,
        heuresDeclarees: results.totalHours,
        heuresLiberees: Number(results.hoursPerWeekRaw.toFixed(2)),
        partMesuree: Number(results.percentTotal),
        valeurMensuelleHaute: results.net,
        valeurMensuelleBasse: results.netObserved,
        affine: hoursDifferFromDefaults,
        version: '1.4'
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [
    step, prof, collabs, effectiveRate, adoptionFactor,
    results.totalHours, results.hoursPerWeekRaw, results.percentTotal,
    results.net, results.netObserved, hoursDifferFromDefaults
  ]);

  const [copied, setCopied] = useState(false);
  const copyMeasureUrl = () => {
    track('lien_copie', { metier: prof });
    // Le champ reste sélectionnable si l'API presse-papiers échoue ou manque :
    // le lien n'est donc jamais inaccessible.
    navigator.clipboard?.writeText(measureUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => { /* le champ en lecture seule reste la solution de repli */ }
    );
  };

  const breakdown = useMemo(() => {
    const rows = currentTasks.map((task, i) => {
      const declared = hours[task.id] ?? task.defaultHours;
      const k = customCoefficients?.[i] ?? task.k;
      return { task, declared, k, gain: declared * k * adoptionFactor };
    });
    rows.sort((a, b) => b.gain - a.gain);
    // Échelle de l'axe : la plus forte contribution, arrondie au dixième
    // supérieur, pour que la barre la plus longue ne touche jamais le bord.
    const axisMax = Math.max(0.1, Math.ceil(Math.max(...rows.map(r => r.gain)) * 10) / 10);
    return { rows, axisMax };
  }, [currentTasks, hours, adoptionFactor, customCoefficients]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };


  // --- Fragments réutilisés par l'assistant et par le panneau d'affinage ---
  const fieldAdoption = (
    <div className="border border-rule-firm bg-surface rounded-sm px-5 py-4">
      <div className="space-y-3">
        <div className="flex justify-between items-baseline gap-3">
          <Label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
            Facteur d'adoption
          </Label>
          <div className="text-right">
            <span className="font-mono text-[15px] font-medium text-ink tabular-nums">
              {(adoptionFactor * 100).toFixed(0)} %
            </span>
            <span className="text-[11.5px] text-ink-3 ml-2">{getAdoptionLabel()}</span>
          </div>
        </div>
        <Slider
          value={[adoptionFactor * 100]}
          min={50}
          max={100}
          step={5}
          onValueChange={(val) => setAdoptionFactor(val[0] / 100)}
        />
        <p className="text-[11.5px] text-ink-3 leading-snug">
          Intègre le temps de validation humaine, la courbe d'apprentissage et le taux d'utilisation
          effectif.
        </p>
      </div>
    </div>
  );

  const fieldProfession = (
    <div className="space-y-2">
      <Label className="text-xs uppercase font-bold text-ink-3">Métier</Label>
      <Select onValueChange={handleProfessionChange} defaultValue={prof}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PROFESSIONS).map(([key, p]) => (
            <SelectItem key={key} value={key}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const fieldTeam = (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-xs uppercase font-bold text-ink-3">Utilisateurs</Label>
        <Input
          type="number"
          min={1}
          max={10000}
          step={1}
          value={collabs}
          onChange={(e) => setCollabs(clampNumber(e.target.value, 1, 10000, 1))}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs uppercase font-bold text-ink-3">
            {rateMode === 'horaire' ? 'Taux horaire (€)' : 'Coût annuel (€)'}
          </Label>
          <div className="flex rounded border border-rule overflow-hidden shrink-0">
            <button
              type="button"
              aria-pressed={rateMode === 'horaire'}
              onClick={() => switchRateMode('horaire')}
              className={`px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                rateMode === 'horaire'
                  ? 'bg-ink text-white'
                  : 'bg-surface text-ink-3 hover:bg-sunk'
              }`}
            >
              /h
            </button>
            <button
              type="button"
              aria-pressed={rateMode === 'annuel'}
              onClick={() => switchRateMode('annuel')}
              className={`px-2 py-0.5 text-[10px] font-semibold transition-colors border-l border-rule ${
                rateMode === 'annuel'
                  ? 'bg-ink text-white'
                  : 'bg-surface text-ink-3 hover:bg-sunk'
              }`}
            >
              /an
            </button>
          </div>
        </div>

        {rateMode === 'horaire' ? (
          <Input
            type="number"
            min={0}
            max={1000}
            step={1}
            value={rate}
            onChange={(e) => setRate(clampNumber(e.target.value, 0, 1000, 0))}
          />
        ) : (
          <Input
            type="number"
            min={0}
            max={1000 * WORKED_HOURS_PER_YEAR}
            step={1000}
            value={annualCost}
            onChange={(e) =>
              setAnnualCost(clampNumber(e.target.value, 0, 1000 * WORKED_HOURS_PER_YEAR, 0))
            }
          />
        )}

        <p className="text-[10px] text-ink-3 leading-snug">
          {rateMode === 'horaire' ? (
            <>
              soit <strong>{Math.round(derivedAnnualCost).toLocaleString('fr-FR')} €</strong> de
              coût chargé annuel
            </>
          ) : (
            <>
              soit{' '}
              <strong>
                {effectiveRate.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €/h
              </strong>{' '}
              travaillée
            </>
          )}
          <br />
          Base : coût <em>chargé</em> ÷ {WORKED_HOURS_PER_YEAR.toLocaleString('fr-FR')} h
          travaillées ({WORKED_WEEKS_PER_YEAR} × {HOURS_PER_WEEK})
        </p>
      </div>
    </div>
  );

  const fieldTaskHours = (
    <div className="pt-6 border-t border-rule space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Temps hebdomadaire / tâche
        </Label>
        <div className="font-mono text-[11px] text-ink-3 tabular-nums shrink-0">
          {results.totalHours.toLocaleString('fr-FR')} h déclarées
        </div>
      </div>

      {/* Légende de l'échelle — une seule source, celle du barème */}
      <div className="bg-sunk border border-rule rounded-sm p-3 space-y-2">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4">
          Échelle de potentiel
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px] text-ink-3">
          {POTENTIAL_SCALE.map(step => (
            <span key={step.key} className="flex items-center gap-2">
              <span className={`w-4 h-2 rounded-r-sm shrink-0 ${step.bar}`} />
              {step.label} <span className="font-mono text-ink-4">{step.rule}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Les trois groupes, dérivés du même barème que la légende */}
      {POTENTIAL_GROUPS.map(group => {
        const groupTasks = tasksByPotential[group.bucket];
        if (groupTasks.length === 0) return null;
        const stats = getSectionStats(groupTasks);
        const open = expandedSections[group.bucket];
        return (
          <div key={group.bucket} className="space-y-2">
            <button
              onClick={() => toggleSection(group.bucket)}
              aria-expanded={open}
              className="w-full flex items-center gap-3 p-3 bg-surface border border-rule-firm rounded-sm hover:bg-sunk transition-colors text-left"
            >
              <span className={`w-1 self-stretch rounded-sm shrink-0 ${group.bar}`} />
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-ink">{group.title}</span>
                <span className="block font-mono text-[11px] text-ink-3">
                  {stats.count} {stats.count > 1 ? 'tâches' : 'tâche'} · {stats.hours} h/sem
                </span>
              </span>
              {open
                ? <ChevronUp className="w-4 h-4 text-ink-4 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-ink-4 shrink-0" />}
            </button>

            {open && (
              <div className="space-y-2 pl-3">
                {groupTasks.map((task) => {
                  const color = getKColor(task.k);
                  const declared = hours[task.id] ?? task.defaultHours;
                  return (
                    <div key={task.id} className="flex gap-3">
                      <span className={`w-0.5 rounded-sm shrink-0 ${color.bar}`} />
                      <div className="flex-1 bg-surface border border-rule rounded-sm p-3 space-y-2.5">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] text-ink">{task.label}</span>
                              <span
                                title={color.label}
                                className={`text-[10px] px-1.5 py-px rounded-sm font-mono tabular-nums ${color.badge}`}
                              >
                                k {task.k.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-ink-4">{task.percentage} du temps</span>
                          </div>
                          <span className="font-mono text-[13px] font-medium text-ink shrink-0 tabular-nums">
                            {declared.toLocaleString('fr-FR')} h
                          </span>
                        </div>
                        <Slider
                          value={[declared]}
                          max={20}
                          step={0.5}
                          onValueChange={(val) => setHours({ ...hours, [task.id]: val[0] })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const measureBlock = (
    <>
    {/* ===== INSTRUMENT : LECTURE ===== */}
    <div className="border border-rule-firm bg-surface rounded-sm">

      {/* Identification du relevé */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 px-5 py-3 border-b border-rule-firm bg-sunk">
        <span className="text-[13px] font-semibold text-ink tracking-tight">
          {PROFESSIONS[prof as keyof typeof PROFESSIONS].label}
        </span>
        <span className="font-mono text-[11.5px] text-ink-3">
          <b className="font-medium text-ink-2">{collabs}</b> {collabs > 1 ? 'personnes' : 'personne'}
        </span>
        <span className="font-mono text-[11.5px] text-ink-3">
          <b className="font-medium text-ink-2">
            {effectiveRate.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
          </b>/h chargé
        </span>
        <span className="font-mono text-[11.5px] text-ink-3">
          adoption <b className="font-medium text-ink-2">{(adoptionFactor * 100).toFixed(0)} %</b>
        </span>
      </div>

      {/* Lecture principale + règle graduée */}
      <div className="px-5 py-6 border-b border-rule">
        <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 mb-4">
          Lecture principale — temps libéré
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-[clamp(40px,8vw,60px)] font-medium leading-none text-ink tracking-tight tabular-nums">
            {results.hoursPerWeekPrecise}
          </span>
          <span className="text-[15px] text-ink-3">h / semaine / personne</span>
          <span className="ml-auto text-right text-[11.5px] text-ink-3 leading-snug">
            <b className="block font-medium text-ink-2">
              sur {results.totalHours.toLocaleString('fr-FR')} h déclarées
            </b>
            soit {results.percentTotal} % du temps déclaré
          </span>
        </div>

        {/* La règle : un chiffre avec sa référence, plutôt qu'une barre de progression */}
        <div className="mt-6" aria-hidden="true">
          <div className="relative h-6 bg-sunk border border-rule rounded-[1px]">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gauge rounded-r-[1px]"
              style={{ width: `${Math.min(100, Number(results.percentTotal))}%` }}
            />
            <div
              className="absolute -top-[7px] -bottom-[7px] w-px bg-ink"
              style={{ left: `${Math.min(100, Number(results.percentTotal))}%` }}
            />
          </div>
          <div className="relative h-6 mt-px">
            {rulerTicks(results.totalHours).map(({ h, major }) => (
              <div key={h}>
                <div
                  className={`absolute top-0 w-px ${major ? 'h-2 bg-ink-4' : 'h-1 bg-rule-firm'}`}
                  style={{ left: `${(h / results.totalHours) * 100}%` }}
                />
                {major && (
                  <div
                    className="absolute top-[10px] -translate-x-1/2 font-mono text-[10px] text-ink-4"
                    style={{ left: `${(h / results.totalHours) * 100}%` }}
                  >
                    {h}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline mt-1.5 text-[11.5px] text-ink-3 gap-3">
            <span className="font-mono font-medium text-ink">0 h</span>
            <span className="text-center">Le reste de la semaine n'est pas adressé par cette mesure</span>
            <span className="font-mono font-medium text-ink">
              {results.totalHours.toLocaleString('fr-FR')} h
            </span>
          </div>
        </div>
      </div>

      {/* Lectures dérivées */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-rule">
        <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-rule">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1.5">
            Sur l'année
          </div>
          <div className="font-mono text-[22px] font-medium text-ink leading-none tabular-nums">
            {results.extraTimeYear} <span className="text-[13px] text-ink-3">jours</span>
          </div>
          <div className="text-[11px] text-ink-3 mt-1.5">
            par personne, sur {WORKED_WEEKS_PER_YEAR} semaines travaillées
          </div>
        </div>
        <div className="px-5 py-4 border-b sm:border-b-0 sm:border-r border-rule">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1.5">
            Équipe entière
          </div>
          <div className="font-mono text-[22px] font-medium text-ink leading-none tabular-nums">
            {results.hoursTeam} <span className="text-[13px] text-ink-3">h/sem</span>
          </div>
          <div className="text-[11px] text-ink-3 mt-1.5">
            {collabs} × {results.hoursPerWeekFr} h
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1.5">
            Rapport valeur / coût
          </div>
          <div className="font-mono text-[22px] font-medium text-ink leading-none tabular-nums">
            {results.roi === '—' ? '—' : `× ${Math.round(Number(results.roi))}`}
          </div>
          <div className="text-[11px] text-ink-3 mt-1.5">
            {formatEuro(results.grossGain)} pour {formatEuro(results.totalCost)} de licences
          </div>
        </div>
      </div>

      {/* Valeur, en intervalle plutôt qu'en chiffre unique */}
      <div className="px-5 py-5 border-b border-rule">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1.5">
          Valeur mensuelle du temps libéré — équipe
        </div>
        <div className="font-mono text-[26px] font-medium text-ink leading-none tabular-nums">
          {formatEuro(results.netObserved)}
          <span className="text-[15px] text-ink-3 mx-1.5">à</span>
          {formatEuro(results.net)}
        </div>
        <div className="text-[11px] text-ink-3 mt-3 leading-relaxed">
          Borne haute : coefficients théoriques. Borne basse : coefficients observés sur le terrain,
          substitués aux théoriques là où ils existent. Net de {formatEuro(results.totalCost)} de
          licences, prélevées 12 mois sur 12.
          <br />
          <b className="text-ink-2 font-semibold">Ce n'est pas une économie</b> : à effectif constant,
          aucun euro n'entre en caisse — ce sont des heures réallouées, valorisées au taux horaire
          que vous avez saisi.
        </div>
      </div>

      {/* Décomposition par tâche */}
      <div className="px-5 py-5 border-b border-rule">
        <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 mb-3">
          Décomposition par tâche — contribution au temps libéré
        </div>
        <p className="text-[11.5px] text-ink-3 leading-snug mb-3">
          Chaque barre est le produit heures × coefficient × adoption. Le carré indique la provenance
          du coefficient : <span className="inline-block w-[7px] h-[7px] align-[1px] border border-ink-3 bg-ink-3" />{' '}
          plein = étude publiée,{' '}
          <span className="inline-block w-[7px] h-[7px] align-[1px] border border-ink-3" /> vide =
          estimation raisonnée.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[420px]">
            <thead>
              <tr>
                <th scope="col" className="text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-4 pb-2 pr-2 border-b border-rule-firm whitespace-nowrap">
                  Tâche
                </th>
                <th scope="col" className="text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-4 pb-2 pr-3 border-b border-rule-firm w-[38%]">
                  Contribution
                </th>
                <th scope="col" className="text-right text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-4 pb-2 border-b border-rule-firm whitespace-nowrap">
                  h/sem
                </th>
                <th scope="col" className="text-right text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-4 pb-2 pl-3 border-b border-rule-firm whitespace-nowrap">
                  h décl.
                </th>
                <th scope="col" className="text-right text-[10px] font-semibold tracking-[0.08em] uppercase text-ink-4 pb-2 pl-3 border-b border-rule-firm whitespace-nowrap">
                  k
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdown.rows.map(({ task, declared, k, gain }) => {
                const color = getKColor(k);
                return (
                  <tr key={task.id} className="hover:bg-sunk transition-colors">
                    <td className="py-2 pr-2 border-b border-rule text-[13px] text-ink align-middle">
                      {task.label}
                      <span
                        title={task.source ? `Source : ${task.source}` : 'Estimation raisonnée, non sourcée'}
                        className={`inline-block w-[7px] h-[7px] ml-1.5 align-[1px] border border-ink-3 ${
                          task.source ? 'bg-ink-3' : ''
                        }`}
                      />
                    </td>
                    <td className="py-2 pr-3 border-b border-rule align-middle">
                      <div className="relative h-[11px]">
                        <div
                          className={`absolute left-0 top-0 bottom-0 rounded-r ${color.bar}`}
                          style={{ width: `${(gain / breakdown.axisMax) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-2 border-b border-rule text-right font-mono text-[12.5px] font-medium text-ink tabular-nums whitespace-nowrap">
                      {gain.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 pl-3 border-b border-rule text-right font-mono text-[12.5px] text-ink-2 tabular-nums whitespace-nowrap">
                      {declared.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-2 pl-3 border-b border-rule text-right font-mono text-[12.5px] text-ink-2 tabular-nums whitespace-nowrap">
                      {k.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 pt-3 border-t border-rule text-[11.5px] text-ink-3">
          {POTENTIAL_SCALE.map(step => (
            <span key={step.key} className="flex items-center gap-2">
              <span className={`w-4 h-2 rounded-r-sm shrink-0 ${step.bar}`} />
              {step.label} — {step.rule}
            </span>
          ))}
        </div>
      </div>

      {/* Conditions de mesure — sur l'écran, pas dans un accordéon */}
      <div className="px-5 py-5 border-b border-rule">
        <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 mb-3">
          Conditions de mesure
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          {[
            { t: 'Semaine de référence', v: `${HOURS_PER_WEEK.toLocaleString('fr-FR')} h` },
            { t: 'Année travaillée', v: `${WORKED_WEEKS_PER_YEAR} sem.`, n: '(52 − 5 de congés)' },
            { t: 'Facteur mensuel', v: WORKED_WEEKS_PER_MONTH.toFixed(2).replace('.', ','), n: `(${WORKED_WEEKS_PER_YEAR} / 12)` },
            { t: 'Licence', v: '30 €/mois', n: '× 12 mois' },
            { t: "Facteur d'adoption", v: adoptionFactor.toFixed(2).replace('.', ',') },
            { t: 'Coefficients', v: `${results.sourcedCount} sourcés`, n: `· ${results.taskCount - results.sourcedCount} estimés` }
          ].map(item => (
            <div key={item.t}>
              <dt className="text-[10px] tracking-[0.08em] uppercase text-ink-4 mb-0.5">{item.t}</dt>
              <dd className="font-mono text-[13px] text-ink tabular-nums">
                {item.v}
                {item.n && <span className="font-sans text-[11px] text-ink-3 ml-1">{item.n}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[11.5px] text-ink-4 leading-relaxed mt-4">
          Le gain court sur {WORKED_WEEKS_PER_YEAR} semaines, la licence sur 12 mois : chacun à sa
          cadence réelle, ramenés à la même année. Ces {WORKED_WEEKS_PER_YEAR} semaines ne déduisent
          ni les jours fériés ni les RTT — l'estimation reste un majorant à ce titre. Le taux horaire
          est un coût chargé rapporté aux heures <em>travaillées</em>.
          <br />
          <br />
          Coefficients issus de Dell'Acqua et al., Noy &amp; Zhang, Brynjolfsson et al. et Peng et al.,
          tous publiés en 2023 en contexte GPT-4.{' '}
          <b className="text-ink-3 font-semibold">À revoir</b> : ils ne reflètent pas les modèles ni
          les usages agentiques actuels.
        </p>
      </div>

      {/* Domaine de validité */}
      <div className="px-5 py-5">
        <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 mb-3">
          Domaine de validité
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-rule">
          <div className="p-4 text-[12.5px] text-ink-3 leading-relaxed border-b sm:border-b-0 sm:border-r border-rule">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gauge-ink mb-1.5">
              Ce que cette mesure couvre
            </div>
            <b className="text-ink-2 font-semibold">L'assistance individuelle.</b> Des personnes qui
            gardent leurs tâches et vont plus vite avec une licence par siège. Unité : l'heure de
            collaborateur.
          </div>
          <div className="p-4 text-[12.5px] text-ink-3 leading-relaxed">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1.5">
              Ce qu'elle ne couvre pas
            </div>
            <b className="text-ink-2 font-semibold">L'automatisation de processus</b>, où la tâche sort
            du périmètre humain : ni heures ni effectif, mais un volume de transactions, un coût de
            construction et un coût par exécution. Un autre instrument est nécessaire.
          </div>
        </div>
        <p className="text-[11.5px] text-ink-4 leading-relaxed mt-3">
          Non comptabilisé par ailleurs : formation initiale, courbe d'apprentissage, setup technique,
          maintenance des prompts, résistance organisationnelle.
        </p>
      </div>

      {/* Lien de la mesure — l'URL porte toute la configuration, donc il reste
          valide sans serveur et rouvre exactement le même relevé. */}
      <div className="px-5 py-4 border-t border-rule bg-sunk">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
            Lien de cette mesure
          </span>
          <button
            type="button"
            onClick={copyMeasureUrl}
            className="px-2.5 py-1 rounded-sm border border-rule-firm bg-surface text-[11.5px] text-ink-2 hover:bg-sunk transition-colors shrink-0"
          >
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>
        <input
          readOnly
          value={measureUrl}
          onFocus={e => e.currentTarget.select()}
          aria-label="Lien de cette mesure"
          className="w-full bg-surface border border-rule rounded-sm px-2.5 py-1.5 font-mono text-[11px] text-ink-3 tabular-nums"
        />
        <p className="text-[11px] text-ink-4 leading-snug mt-2">
          Toute la configuration voyage dans l'adresse : le lien rouvre le même relevé, sans compte
          et sans dépendre d'un serveur.
        </p>
      </div>
    </div>

    {/* SÉQUENCE D'ADOPTION — contenu encore générique, cf. commentaire ADOPTION_PHASES */}
    <div className="border border-rule-firm bg-surface rounded-sm">
      <div className="px-5 py-3 border-b border-rule-firm bg-sunk flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-ink-4" />
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
          Séquence d'adoption — 3 mois
        </span>
      </div>
      <div className="p-5">
        <ol className="space-y-0">
          {ADOPTION_PHASES.map((phase, i) => (
            <li key={phase.title} className="flex gap-3.5">
              <div className="flex flex-col items-center shrink-0">
                <span className="w-6 h-6 rounded-sm bg-ink text-surface font-mono text-[11px] font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                {i < ADOPTION_PHASES.length - 1 && <span className="w-px flex-1 bg-rule my-1" />}
              </div>
              <div className={i < ADOPTION_PHASES.length - 1 ? 'pb-5' : ''}>
                <div className="text-[13px] font-semibold text-ink">
                  {phase.title}
                  <span className="font-mono font-normal text-[11px] text-ink-4 ml-2">{phase.weeks}</span>
                </div>
                <ul className="text-[12px] text-ink-3 mt-1 space-y-0.5">
                  {phase.items.map(item => (
                    <li key={item} className="flex gap-1.5">
                      <span className="text-ink-4">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 p-3 bg-sunk border border-rule rounded-sm">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-ink-4 mb-1">
            Objectif à 3 mois
          </div>
          <div className="text-[12px] text-ink-2">
            Atteindre {(adoptionFactor * 100).toFixed(0)} % d'adoption et mesurer les gains réels
          </div>
        </div>

        <p className="text-[11px] text-ink-4 leading-snug mt-3">
          Cette séquence est générique : elle ne dépend pas encore du métier, de la taille d'équipe
          ni du niveau d'adoption saisis.
        </p>
      </div>
    </div>
    </>
  );

  const references = (
    <>
        {/* VALIDATION TERRAIN */}
        <div className="lg:col-span-12">
          <div className="border border-rule-firm bg-surface rounded-sm">
            <div className="px-5 py-3">
              <button 
                onClick={() => setShowRealWorld(!showRealWorld)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Validation terrain (12 utilisateurs, 6 mois en 2025)
                </span>
                {showRealWorld ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {showRealWorld && (
              <div className="px-5 pb-5 text-[12px] space-y-4 text-ink-2 border-t border-rule pt-4">
                <div className="bg-surface p-4 rounded-lg border border-blue-200">
                  <p className="font-medium mb-2">
                    Pour valider nos coefficients, nous avons mesuré les gains réels de 12 professionnels 
                    accompagnés ayant adopté Claude/Gemini pendant 6 mois.
                  </p>
                  <p className="mb-3">
                    <strong>Résultat :</strong> -7% d'écart en moyenne entre prévision et réalité.
                    <br />
                    Cet écart est dû au temps de validation humaine des outputs IA.
                  </p>
                </div>

                <p className="font-semibold">Comparaison gains théoriques vs. gains observés (tâches à fort potentiel uniquement) :</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentTasks.filter(t => t.realWorld).map((task) => (
                    <div key={task.id} className="bg-surface p-3 rounded border border-rule">
                      <div className="font-semibold text-ink mb-2">{task.label}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-ink-3">Théorique :</span>
                          <span className="font-mono font-bold text-blue-600">{(task.k * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-3">Observé :</span>
                          <span className="font-mono font-bold text-emerald-600">{(task.realWorld! * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-ink-3">
                          <span>Écart :</span>
                          <span className="font-mono">{((task.realWorld! - task.k) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-sunk border border-rule p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">Ce que cela signifie pour vous :</p>
                      <p className="text-amber-800">
                        Votre ROI réel sera probablement <strong>5-10% inférieur</strong> aux estimations affichées, 
                        mais restera <strong>largement positif</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-ink-3 italic border-t pt-3">
                  <strong>Note :</strong> Ces chiffres sont régulièrement mis à jour pour refléter notre retour d'expérience 
                  et l'évolution des modèles IA. Dernière mise à jour : Janvier 2025.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MÉTHODOLOGIE */}
        <div className="lg:col-span-12">
          <div className="border border-dashed border-rule-firm rounded-sm bg-transparent">
            <button 
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-4 hover:bg-sunk transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-ink-3">
                <BookOpen className="w-4 h-4" /> MÉTHODOLOGIE & SOURCES
              </div>
              {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMethodology && (
              <div className="border-t border-rule p-6 space-y-8 bg-surface">
                {/* Sources académiques complètes */}
                <div className="space-y-4">
                  <h4 className="font-bold text-ink uppercase text-xs tracking-widest">Sources académiques</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-sunk p-4 rounded border border-rule">
                      <div className="font-semibold text-ink">Navigating the Jagged Technological Frontier</div>
                      <div className="text-xs text-ink-3 mt-1">
                        Dell'Acqua, F., McFowland, E., Mollick, E. R., et al. (2023)
                      </div>
                      <div className="text-xs text-ink-3">Harvard Business School / Wharton</div>
                      <a 
                        href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Lire le paper
                      </a>
                    </div>

                    <div className="bg-sunk p-4 rounded border border-rule">
                      <div className="font-semibold text-ink">Experimental Evidence on the Productivity Effects of Generative AI</div>
                      <div className="text-xs text-ink-3 mt-1">
                        Noy, S., & Zhang, W. (2023)
                      </div>
                      <div className="text-xs text-ink-3">MIT Economics</div>
                      <a 
                        href="https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Lire le paper
                      </a>
                    </div>

                    <div className="bg-sunk p-4 rounded border border-rule">
                      <div className="font-semibold text-ink">Generative AI at Work</div>
                      <div className="text-xs text-ink-3 mt-1">
                        Brynjolfsson, E., Li, D., & Raymond, L. (2023)
                      </div>
                      <div className="text-xs text-ink-3">NBER Working Paper No. 31161</div>
                      <a 
                        href="https://www.nber.org/papers/w31161" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Lire le paper
                      </a>
                    </div>

                    <div className="bg-sunk p-4 rounded border border-rule">
                      <div className="font-semibold text-ink">The Impact of AI on Developer Productivity</div>
                      <div className="text-xs text-ink-3 mt-1">
                        Peng, S., et al. (2023)
                      </div>
                      <div className="text-xs text-ink-3">GitHub / Microsoft Research</div>
                      <a 
                        href="https://arxiv.org/abs/2302.06590" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Lire le paper
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4 colonnes méthodologie */}
                <div className="grid md:grid-cols-4 gap-8 text-sm pt-6 border-t">
                  <div className="space-y-2">
                    <h4 className="font-bold text-ink uppercase text-[10px] tracking-widest">Méthode</h4>
                    <p className="text-ink-3 text-xs">
                      Coefficient d'efficience (k) par tâche issu des études ou estimé, 
                      multiplié par le facteur d'adoption (0.5-1.0) ajustable. Toutes les tâches ont un k, 
                      même les moins automatisables.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-ink uppercase text-[10px] tracking-widest">Calculs</h4>
                    <p className="text-ink-3 text-xs">
                      Gain = Σ(H × k × adoption) × Taux × 3.92 × N
                      <br />où H = heures/semaine, N = collaborateurs, k = coefficient
                      d'efficience, et 3.92 = 47 semaines travaillées / 12 mois
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-ink uppercase text-[10px] tracking-widest">Hypothèses</h4>
                    <p className="text-ink-3 text-xs">
                      Licence : 30€/mois/user, payée 12 mois. Semaine : {HOURS_PER_WEEK.toLocaleString('fr-FR')} h.
                      <strong> Année travaillée : 47 semaines</strong> (52 moins 5 semaines
                      de congés payés), soit un facteur mensuel de 3.92 = 47/12. Un
                      collaborateur en congé ne produit aucun gain : retenir 52 surestimerait
                      le résultat d'environ 9,5%. Ces 47 semaines ne déduisent en revanche
                      ni les jours fériés (~11 jours) ni les RTT — l'estimation reste un
                      majorant à ce titre.
                      <br /><br />
                      <strong>Taux horaire :</strong> coût chargé annuel rapporté aux heures
                      <em> travaillées</em>, soit ÷ 1 762,5 h (47 × 37.5). Le rapporter à
                      52 semaines sous-estimerait le coût réel d'une heure et neutraliserait
                      l'effet des 47 semaines.
                      <br /><br />
                      Répartition temps basée sur études McKinsey 2011, Uplevel 2024, BLS.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-red-600 uppercase text-[10px] tracking-widest flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Non comptabilisé
                    </h4>
                    <ul className="space-y-1 text-ink-3 text-xs">
                      <li>• Formation initiale (2-4 sem.)</li>
                      <li>• Courbe d'apprentissage</li>
                      <li>• Debugging des outputs</li>
                      <li>• Setup technique (API)</li>
                      <li>• Résistance organisationnelle</li>
                      <li>• Échecs sur tâches spécialisées</li>
                    </ul>
                  </div>
                </div>

                {/* Export & Footer */}
                <div className="pt-6 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={exportHypotheses}
                      className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger mes hypothèses (JSON)
                    </button>
                    <div className="text-xs text-ink-4">
                      Version 1.4 • Août 2026
                    </div>
                  </div>

                  <div className="border-t pt-4 text-xs text-ink-3 space-y-2">
                    <p>
                      <strong>Méthodologie ouverte :</strong> Ce calculateur applique les résultats 
                      d'études académiques peer-reviewed et des estimations raisonnées pour toutes les tâches professionnelles. 
                      Les coefficients sont ajustables et les hypothèses exportables pour validation externe.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      <a 
                        href="https://github.com/mauricemendy/mon-roi-ia" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Code source (GitHub)
                      </a>
                      <a 
                        href="https://github.com/mauricemendy/mon-roi-ia/blob/main/docs/repartition-temps-metiers.md" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Documentation complète
                      </a>
                    </div>
                    <p className="text-ink-4 text-[10px] pt-2">
                      Licence MIT • Auteur : Maurice Mendy • <a href="https://mauricemendy.com" target="_blank" rel="noopener noreferrer" className="hover:underline">mauricemendy.com</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </>
  );

  const steps = ['Métier', 'Équipe et coût', 'Mesure'] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* ===== EN-TÊTE ===== */}
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-5 border-b border-rule-firm">
        <h1 className="text-[26px] font-semibold tracking-[0.16em] text-ink leading-none">
          METRON
        </h1>
        <p className="text-[13px] text-ink-3">
          Mesurer l'impact de l'IA, tâche par tâche
        </p>
      </header>

      {/* ===== PROGRESSION ===== */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px]">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const current = step === n;
          return (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => n < step && setStep(n as 1 | 2 | 3)}
                disabled={n > step}
                aria-current={current ? 'step' : undefined}
                className={`flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 transition-colors ${
                  n < step ? 'hover:bg-sunk cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-sm font-mono text-[10px] flex items-center justify-center ${
                    current ? 'bg-ink text-surface'
                      : done ? 'bg-gauge text-surface'
                      : 'bg-sunk text-ink-4 border border-rule'
                  }`}
                >
                  {n}
                </span>
                <span className={current ? 'text-ink font-medium' : done ? 'text-ink-3' : 'text-ink-4'}>
                  {label}
                </span>
              </button>
              {n < steps.length && <span className="w-6 h-px bg-rule" />}
            </li>
          );
        })}
      </ol>

      {/* ===== ÉTAPE 1 — MÉTIER ===== */}
      {step === 1 && (
        <div className="border border-rule-firm bg-surface rounded-sm">
          <div className="px-5 py-3 border-b border-rule-firm bg-sunk">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
              Quel métier mesure-t-on ?
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(Object.entries(PROFESSIONS) as [ProfessionKey, { label: string; tasks: Task[] }][]).map(
                ([key, p]) => {
                  const selected = prof === key;
                  const strong = p.tasks.filter(t => t.k >= 0.5).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleProfessionChange(key)}
                      aria-pressed={selected}
                      className={`text-left p-3 rounded-sm border transition-colors ${
                        selected
                          ? 'border-gauge bg-sunk'
                          : 'border-rule bg-surface hover:bg-sunk'
                      }`}
                    >
                      <span className={`block text-[13px] ${selected ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                        {p.label}
                      </span>
                      <span className="block font-mono text-[11px] text-ink-4 mt-0.5">
                        {p.tasks.length} tâches
                        {strong > 0 && ` · ${strong} à fort potentiel`}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-[11.5px] text-ink-4 leading-snug mt-4">
              La répartition du temps est pré-remplie avec des valeurs de référence. Vous pourrez
              l'ajuster à l'étape 3.
            </p>
          </div>
        </div>
      )}

      {/* ===== ÉTAPE 2 — ÉQUIPE ET COÛT ===== */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="border border-rule-firm bg-surface rounded-sm">
            <div className="px-5 py-3 border-b border-rule-firm bg-sunk">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
                Combien de personnes, et à quel coût ?
              </span>
            </div>
            <div className="p-5">
              {fieldTeam}
            </div>
          </div>
          {fieldAdoption}
        </div>
      )}

      {/* ===== ÉTAPE 3 — MESURE ===== */}
      {step === 3 && (
        refining ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-rule-firm bg-surface rounded-sm">
                <div className="px-5 py-3 border-b border-rule-firm bg-sunk">
                  <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-4">
                    Conditions saisies
                  </span>
                </div>
                <div className="p-5 space-y-6">
                  <div className="space-y-4">
                    {fieldProfession}
                    {fieldTeam}
                  </div>
                  {fieldTaskHours}
                </div>
              </div>
              {fieldAdoption}
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
              {measureBlock}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {measureBlock}
          </div>
        )
      )}

      {/* ===== NAVIGATION ===== */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as 1 | 2 | 3)}
            className="px-4 py-2 rounded-sm border border-rule-firm bg-surface text-[13px] text-ink-2 hover:bg-sunk transition-colors"
          >
            Retour
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={() => advanceTo((step + 1) as 1 | 2 | 3)}
            className="px-4 py-2 rounded-sm bg-ink text-surface text-[13px] font-medium hover:bg-ink-2 transition-colors"
          >
            {step === 1 ? 'Continuer' : 'Voir la mesure'}
          </button>
        )}
        {step === 3 && (
          <button
            type="button"
            onClick={() => toggleRefining()}
            aria-pressed={refining}
            className={`px-4 py-2 rounded-sm text-[13px] font-medium transition-colors border ${
              refining
                ? 'bg-ink text-surface border-ink'
                : 'bg-surface text-ink-2 border-rule-firm hover:bg-sunk'
            }`}
          >
            {refining ? 'Masquer l’affinage' : 'Affiner la répartition du temps'}
          </button>
        )}
        {step === 3 && !refining && (
          <span className="text-[11.5px] text-ink-4">
            Les heures par tâche sont celles de référence pour ce métier.
          </span>
        )}
      </div>

      {/* ===== RÉFÉRENCES — visibles une fois la mesure faite ===== */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {references}
        </div>
      )}
    </div>
  );
}
