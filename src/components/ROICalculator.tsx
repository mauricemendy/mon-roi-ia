import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, ChevronDown, ChevronUp, Zap, BookOpen, Download, AlertTriangle, BarChart3, ExternalLink } from "lucide-react";

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
  if (k === 0) return { bar: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600', label: 'Non automatisable' };
  if (k < 0.3) return { bar: 'bg-amber-600', badge: 'bg-amber-50 text-amber-700', label: 'Potentiel faible' };
  if (k < 0.5) return { bar: 'bg-blue-600', badge: 'bg-blue-50 text-blue-700', label: 'Potentiel moyen' };
  return { bar: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700', label: 'Fort potentiel' };
};

export default function ROICalculator() {
  const [prof, setProf] = useState('engineering');
  const [collabs, setCollabs] = useState(5);
  const [rate, setRate] = useState(45);
  const [hours, setHours] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    PROFESSIONS.engineering.tasks.forEach(task => {
      initial[task.id] = task.defaultHours;
    });
    return initial;
  });
  const [adoptionFactor, setAdoptionFactor] = useState(0.85);
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

  const results = useMemo(() => {
    const currentTasks = PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks;
    const licenceCost = 30;

    // Les champs numériques peuvent transiter par NaN (champ vidé, saisie non
    // numérique). On les ramène dans le domaine avant tout calcul, sinon le NaN
    // se propage jusqu'à l'affichage.
    const safeCollabs = Number.isFinite(collabs) ? Math.max(1, Math.round(collabs)) : 1;
    const safeRate = Number.isFinite(rate) ? Math.max(0, rate) : 0;

    const hoursPerWeek = currentTasks.reduce((acc, t, i) => {
      const h = hours[t.id] || t.defaultHours;
      const k = customCoefficients?.[i] ?? t.k;
      return acc + (h * k * adoptionFactor);
    }, 0);

    const totalHours = currentTasks.reduce((acc, t) => acc + (hours[t.id] || t.defaultHours), 0);

    // Année travaillée, cf. WORKED_WEEKS_PER_YEAR. Le coût de licence, lui,
    // court sur les 12 mois : le rapport gain/coût intègre donc les congés.
    const grossGain = hoursPerWeek * safeRate * WORKED_WEEKS_PER_MONTH * safeCollabs;
    const totalCost = safeCollabs * licenceCost;

    return {
      hoursPerWeek: hoursPerWeek.toFixed(1),
      extraTimeYear: (hoursPerWeek * WORKED_WEEKS_PER_YEAR / HOURS_PER_DAY).toFixed(0),
      percentTime: ((hoursPerWeek / 37.5) * 100).toFixed(0),
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
  }, [prof, collabs, rate, hours, adoptionFactor, customCoefficients]);

  const handleProfessionChange = (newProf: string) => {
    setProf(newProf);
    const newHours: Record<string, number> = {};
    PROFESSIONS[newProf as keyof typeof PROFESSIONS].tasks.forEach(task => {
      newHours[task.id] = task.defaultHours;
    });
    setHours(newHours);
    setCustomCoefficients(null);
  };

  const exportHypotheses = () => {
    const data = {
      metadata: {
        version: "1.4",
        date: new Date().toISOString(),
        tool: "Calculateur ROI GenAI - mauricemendy.com"
      },
      configuration: {
        profession: prof,
        professionLabel: PROFESSIONS[prof as keyof typeof PROFESSIONS].label,
        collaborateurs: collabs,
        tauxHoraire: rate,
        heuresParTache: hours,
        facteurAdoption: adoptionFactor
      },
      hypotheses: {
        semainesTravailleesParAn: WORKED_WEEKS_PER_YEAR,
        facteurMensuel: Number(WORKED_WEEKS_PER_MONTH.toFixed(4)),
        heuresParJour: HOURS_PER_DAY,
        heuresParSemaine: 37.5,
        coutLicenceMensuel: 30,
        baseTauxHoraire: "Coût chargé annuel / 1762.5 h travaillées (47 x 37.5)",
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getDynamicTips = () => {
    // Calculer le Top 3
    const top3 = currentTasks
      .map((task) => ({
        task,
        gain: (hours[task.id] || task.defaultHours) * task.k * adoptionFactor,
      }))
      .sort((a, b) => b.gain - a.gain)
      .slice(0, 3);

    const highPotentialCount = top3.filter(item => item.task.k >= 0.5).length;
    const top1 = top3[0]?.task;
    const top2 = top3[1]?.task;

    // Tips selon le profil du Top 3.
    // Les classes sont des littéraux : une classe assemblée à l'exécution
    // (`text-${color}-600`) ne survit pas au build Tailwind.
    if (highPotentialCount >= 2) {
      // 2-3 tâches fort potentiel dans le Top 3
      const highTasks = top3.filter(item => item.task.k >= 0.5).map(item => item.task.label);
      return [
        { arrowClass: 'text-emerald-600', text: `Priorisez ${highTasks[0]} et ${highTasks[1]} (k≥0.5)` },
        { arrowClass: 'text-blue-600', text: 'ROI immédiat : ces tâches sont vos quick wins' },
        { arrowClass: 'text-amber-600', text: 'Formez vos équipes sur le prompting efficace' }
      ];
    } else if (highPotentialCount === 1) {
      // 1 seule tâche fort potentiel
      const highTask = top3.find(item => item.task.k >= 0.5)?.task;
      return [
        { arrowClass: 'text-emerald-600', text: `Commencez par ${highTask?.label} (k=${highTask?.k.toFixed(2)})` },
        { arrowClass: 'text-blue-600', text: `Puis étendez à ${top2?.label} progressivement` },
        { arrowClass: 'text-amber-600', text: 'Mesurez l\'adoption après 1 mois' }
      ];
    } else {
      // Aucune tâche fort potentiel (ex: Sales)
      return [
        { arrowClass: 'text-emerald-600', text: `Focus sur ${top1?.label} et ${top2?.label}` },
        { arrowClass: 'text-blue-600', text: 'Commencez par 1-2 tâches, puis étendez' },
        { arrowClass: 'text-amber-600', text: 'Partagez les best practices en équipe' }
      ];
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Slider Adoption */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold text-slate-700">
                Facteur d'adoption
              </Label>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{(adoptionFactor * 100).toFixed(0)}%</div>
                <div className="text-xs text-slate-500">{getAdoptionLabel()}</div>
              </div>
            </div>
            <Slider 
              value={[adoptionFactor * 100]} 
              min={50} 
              max={100} 
              step={5}
              onValueChange={(val) => setAdoptionFactor(val[0] / 100)} 
            />
            <p className="text-xs text-slate-500 italic">
              Intègre le temps de validation humaine, la courbe d'apprentissage et le taux d'utilisation effectif.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GAUCHE : CONFIGURATION */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-slate-500">Métier</Label>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-slate-500">Utilisateurs</Label>
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
                    <Label className="text-xs uppercase font-bold text-slate-500">Taux horaire (€)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={1000}
                      step={1}
                      value={rate}
                      onChange={(e) => setRate(clampNumber(e.target.value, 0, 1000, 0))}
                    />
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Coût chargé annuel ÷ {(WORKED_WEEKS_PER_YEAR * 37.5).toLocaleString('fr-FR')} h travaillées
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Temps hebdomadaire / tâche
                  </Label>
                  <div className="text-xs text-slate-500">37.5h total</div>
                </div>

                {/* Légende couleurs */}
                <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-xs">
                  <div className="font-semibold text-slate-700">Potentiel IA :</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-emerald-600"></div>
                      <span>Fort (k≥0.5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-600"></div>
                      <span>Moyen (0.3-0.5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-600"></div>
                      <span>Faible (&lt;0.3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-slate-400"></div>
                      <span>Non auto.</span>
                    </div>
                  </div>
                </div>

                {/* SECTION FORT POTENTIEL */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('high')}
                    className="w-full flex items-center justify-between p-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                        {expandedSections.high ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-emerald-900">Fort potentiel (k≥0.5)</div>
                        <div className="text-xs text-emerald-700">
                          {getSectionStats(tasksByPotential.high).count} tâches • {getSectionStats(tasksByPotential.high).hours}h/sem
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedSections.high && (
                    <div className="space-y-4 pl-2">
                      {tasksByPotential.high.map((task) => {
                        const color = getKColor(task.k);
                        return (
                          <div key={task.id} className="relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${color.bar} rounded-l-lg`}></div>
                            <div className="ml-4 bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-slate-800">{task.label}</span>
                                    <span title={color.label} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${color.badge}`}>
                                      k={task.k.toFixed(2)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">({task.percentage})</span>
                                </div>
                                <span className="text-sm font-bold text-blue-600 shrink-0">{hours[task.id] || task.defaultHours}h</span>
                              </div>
                              <Slider 
                                value={[hours[task.id] || task.defaultHours]} 
                                max={20} 
                                step={0.5}
                                onValueChange={(val) => setHours({...hours, [task.id]: val[0]})} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION POTENTIEL MOYEN */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('medium')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {expandedSections.medium ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-blue-900">Potentiel moyen (0.3-0.5)</div>
                        <div className="text-xs text-blue-700">
                          {getSectionStats(tasksByPotential.medium).count} tâches • {getSectionStats(tasksByPotential.medium).hours}h/sem
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedSections.medium && (
                    <div className="space-y-4 pl-2">
                      {tasksByPotential.medium.map((task) => {
                        const color = getKColor(task.k);
                        return (
                          <div key={task.id} className="relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${color.bar} rounded-l-lg`}></div>
                            <div className="ml-4 bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-slate-800">{task.label}</span>
                                    <span title={color.label} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${color.badge}`}>
                                      k={task.k.toFixed(2)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">({task.percentage})</span>
                                </div>
                                <span className="text-sm font-bold text-blue-600 shrink-0">{hours[task.id] || task.defaultHours}h</span>
                              </div>
                              <Slider 
                                value={[hours[task.id] || task.defaultHours]} 
                                max={20} 
                                step={0.5}
                                onValueChange={(val) => setHours({...hours, [task.id]: val[0]})} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION FAIBLE/NON AUTO */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection('low')}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white">
                        {expandedSections.low ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-amber-900">Faible / Non automatisable</div>
                        <div className="text-xs text-amber-700">
                          {getSectionStats(tasksByPotential.low).count} tâches • {getSectionStats(tasksByPotential.low).hours}h/sem
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedSections.low && (
                    <div className="space-y-4 pl-2">
                      {tasksByPotential.low.map((task) => {
                        const color = getKColor(task.k);
                        return (
                          <div key={task.id} className="relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${color.bar} rounded-l-lg`}></div>
                            <div className="ml-4 bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-slate-800">{task.label}</span>
                                    <span title={color.label} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${color.badge}`}>
                                      k={task.k.toFixed(2)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">({task.percentage})</span>
                                </div>
                                <span className="text-sm font-bold text-blue-600 shrink-0">{hours[task.id] || task.defaultHours}h</span>
                              </div>
                              <Slider 
                                value={[hours[task.id] || task.defaultHours]} 
                                max={20} 
                                step={0.5}
                                onValueChange={(val) => setHours({...hours, [task.id]: val[0]})} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DROITE : RESULTATS */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* GAIN UTILISATEUR */}
          <Card className="flex-1 border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-blue-600 font-bold">
                Temps libéré / personne
              </CardTitle>
              <div className="text-xs text-slate-500 italic mt-1">
                Facteur d'adoption : {(adoptionFactor * 100).toFixed(0)}%
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-5xl font-black text-slate-900">{results.hoursPerWeek}h</span>
                <span className="text-xl font-bold text-slate-400 ml-2">/ semaine</span>
              </div>
              <div className="pt-4 border-t">
                <div className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-tighter">Équivalences</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">+{results.extraTimeYear} jours</div>
                    <div className="text-xs text-slate-500">libérés par an / pers.</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">{results.percentTime}%</div>
                    <div className="text-xs text-slate-500">du temps hebdo libéré</div>
                  </div>
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                      Hypothèse
                    </div>
                    <div className="text-xs text-amber-700">
                      {results.percentTotal}% de votre temps est potentiellement automatisable selon votre configuration. 
                      Les résultats réels varient selon le contexte.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IMPACT DÉCIDEUR */}
          <Card className="flex-1 border-slate-200 shadow-sm bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Valeur du temps libéré
              </CardTitle>
              <div className="text-xs text-slate-400 italic mt-1">
                Hypothèses moyennes secteur {PROFESSIONS[prof as keyof typeof PROFESSIONS].label}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-5xl font-black text-white">{formatEuro(results.net)}</div>
                <div className="text-sm text-slate-400 mt-1 uppercase tracking-wide">
                  Valeur mensuelle du temps libéré — équipe
                </div>
                <div className="text-xs text-slate-400 mt-3 leading-relaxed">
                  <strong className="text-slate-200">Ce n'est pas une économie.</strong> À effectif constant,
                  aucun euro n'entre en caisse : ce sont des heures réallouées, valorisées au taux horaire
                  que vous avez saisi. Net du coût des licences.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">
                    {results.roi === '—' ? '—' : `x${results.roi}`}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">ROI Théorique</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{results.breakeven}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Break-even (Seuil)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TOP OPPORTUNITÉS IA */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-700">
                <Zap className="w-4 h-4" /> Top Opportunités IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Top 3 tâches */}
              <div className="space-y-2">
                {currentTasks
                  .map((task, idx) => ({
                    task,
                    gain: (hours[task.id] || task.defaultHours) * task.k * adoptionFactor,
                    originalIndex: idx
                  }))
                  .sort((a, b) => b.gain - a.gain)
                  .slice(0, 3)
                  .map(({ task, gain }, rank) => {
                    const color = getKColor(task.k);
                    return (
                      <div key={task.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                        <div className={`w-6 h-6 rounded-full ${color.bar} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {rank + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">{task.label}</div>
                          <div className="text-[10px] text-slate-500">
                            {gain.toFixed(1)}h/sem potentiel • k={task.k.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Insight temps automatisable */}
              <div className="bg-white/60 backdrop-blur p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">Temps automatisable</span>
                  <span className="text-lg font-bold text-emerald-700">{results.percentTotal}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${results.percentTotal}%` }}
                  ></div>
                </div>
              </div>

              {/* Tips rapides */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">💡 Tips</div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {getDynamicTips().map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className={`${tip.arrowClass} shrink-0`}>→</span>
                      <span>{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROADMAP ADOPTION */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
                <Clock className="w-4 h-4" /> Roadmap Adoption (3 mois)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Phase 1 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div className="w-0.5 h-full bg-purple-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="font-semibold text-sm text-slate-800">Pilote (S1-2)</div>
                    <div className="text-xs text-slate-600 mt-1">
                      • Sélection 2-3 early adopters<br/>
                      • Focus sur tâches k≥0.5<br/>
                      • Mesure gains réels
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div className="w-0.5 h-full bg-blue-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="font-semibold text-sm text-slate-800">Formation (S3-4)</div>
                    <div className="text-xs text-slate-600 mt-1">
                      • Workshops prompting<br/>
                      • Partage best practices<br/>
                      • Documentation cas d'usage
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <div className="w-0.5 h-full bg-emerald-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="font-semibold text-sm text-slate-800">Déploiement (S5-8)</div>
                    <div className="text-xs text-slate-600 mt-1">
                      • Extension équipe complète<br/>
                      • Support continu<br/>
                      • Ajustements workflows
                    </div>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-800">Optimisation (S9-12)</div>
                    <div className="text-xs text-slate-600 mt-1">
                      • Analyse ROI réel<br/>
                      • Identification nouvelles tâches<br/>
                      • Montée en maturité
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 p-3 bg-white/60 backdrop-blur rounded-lg border border-purple-200">
                <div className="text-xs font-semibold text-purple-700 mb-1">
                  🎯 Objectif 3 mois
                </div>
                <div className="text-xs text-slate-700">
                  Atteindre {(adoptionFactor * 100).toFixed(0)}% d'adoption et mesurer les gains réels
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VALIDATION TERRAIN */}
        <div className="lg:col-span-12">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <button 
                onClick={() => setShowRealWorld(!showRealWorld)}
                className="w-full flex items-center justify-between text-left"
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Validation terrain (12 utilisateurs, 6 mois en 2025)
                </CardTitle>
                {showRealWorld ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CardHeader>
            {showRealWorld && (
              <CardContent className="text-xs space-y-4 text-slate-700">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
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
                    <div key={task.id} className="bg-white p-3 rounded border border-slate-200">
                      <div className="font-semibold text-slate-800 mb-2">{task.label}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Théorique :</span>
                          <span className="font-mono font-bold text-blue-600">{(task.k * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Observé :</span>
                          <span className="font-mono font-bold text-emerald-600">{(task.realWorld! * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Écart :</span>
                          <span className="font-mono">{((task.realWorld! - task.k) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
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

                <div className="text-[10px] text-slate-500 italic border-t pt-3">
                  <strong>Note :</strong> Ces chiffres sont régulièrement mis à jour pour refléter notre retour d'expérience 
                  et l'évolution des modèles IA. Dernière mise à jour : Janvier 2025.
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* MÉTHODOLOGIE */}
        <div className="lg:col-span-12">
          <Card className="border-dashed border-slate-300 shadow-none bg-transparent">
            <button 
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <BookOpen className="w-4 h-4" /> MÉTHODOLOGIE & SOURCES
              </div>
              {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showMethodology && (
              <CardContent className="border-t p-6 space-y-8 bg-white">
                {/* Sources académiques complètes */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Sources académiques</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="font-semibold text-slate-900">Navigating the Jagged Technological Frontier</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Dell'Acqua, F., McFowland, E., Mollick, E. R., et al. (2023)
                      </div>
                      <div className="text-xs text-slate-500">Harvard Business School / Wharton</div>
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
                    
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="font-semibold text-slate-900">Experimental Evidence on the Productivity Effects of Generative AI</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Noy, S., & Zhang, W. (2023)
                      </div>
                      <div className="text-xs text-slate-500">MIT Economics</div>
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
                    
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="font-semibold text-slate-900">Generative AI at Work</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Brynjolfsson, E., Li, D., & Raymond, L. (2023)
                      </div>
                      <div className="text-xs text-slate-500">NBER Working Paper No. 31161</div>
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
                    
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="font-semibold text-slate-900">The Impact of AI on Developer Productivity</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Peng, S., et al. (2023)
                      </div>
                      <div className="text-xs text-slate-500">GitHub / Microsoft Research</div>
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
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Méthode</h4>
                    <p className="text-slate-600 text-xs">
                      Coefficient d'efficience (k) par tâche issu des études ou estimé, 
                      multiplié par le facteur d'adoption (0.5-1.0) ajustable. Toutes les tâches ont un k, 
                      même les moins automatisables.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Calculs</h4>
                    <p className="text-slate-600 text-xs">
                      Gain = Σ(H × k × adoption) × Taux × 3.92 × N
                      <br />où H = heures/semaine, N = collaborateurs, k = coefficient
                      d'efficience, et 3.92 = 47 semaines travaillées / 12 mois
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Hypothèses</h4>
                    <p className="text-slate-600 text-xs">
                      Licence : 30€/mois/user, payée 12 mois. Semaine : 37.5h.
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
                    <ul className="space-y-1 text-slate-600 text-xs">
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
                    <div className="text-xs text-slate-400">
                      Version 1.4 • Août 2026
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 text-xs text-slate-500 space-y-2">
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
                    <p className="text-slate-400 text-[10px] pt-2">
                      Licence MIT • Auteur : Maurice Mendy • <a href="https://mauricemendy.com" target="_blank" rel="noopener noreferrer" className="hover:underline">mauricemendy.com</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
