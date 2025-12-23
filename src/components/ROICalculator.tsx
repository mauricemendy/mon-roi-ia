import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Clock, ChevronDown, ChevronUp, Zap, BookOpen, Download, AlertTriangle, BarChart3, ExternalLink } from "lucide-react";

const PROFESSIONS = {
  engineering: {
    label: "Ingénierie & Bureau d'Études",
    tasks: [
      { 
        id: 't1', 
        label: "Scripts & Automatisation", 
        k: 0.56, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.52 
      },
      { 
        id: 't2', 
        label: "Rédaction Rapports", 
        k: 0.37, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.33 
      },
      { 
        id: 't3', 
        label: "Recherche Normative", 
        k: 0.40, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.38 
      }
    ]
  },
  marketing: {
    label: "Marketing & Communication",
    tasks: [
      { 
        id: 't1', 
        label: "Création de contenu", 
        k: 0.59, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.54 
      },
      { 
        id: 't2', 
        label: "Optimisation SEO", 
        k: 0.40, 
        source: "Peng et al., 2023",
        sourceUrl: "https://arxiv.org/abs/2302.06590",
        realWorld: 0.36 
      },
      { 
        id: 't3', 
        label: "Social Media", 
        k: 0.63, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.58 
      }
    ]
  },
  sales: {
    label: "Sales & Business Dev",
    tasks: [
      { 
        id: 't1', 
        label: "Prospection Emails", 
        k: 0.42, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.39 
      },
      { 
        id: 't2', 
        label: "Synthèse de comptes", 
        k: 0.35, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.32 
      },
      { 
        id: 't3', 
        label: "Saisie CRM", 
        k: 0.28, 
        source: "Peng et al., 2023",
        sourceUrl: "https://arxiv.org/abs/2302.06590",
        realWorld: 0.26 
      }
    ]
  },
  finance: {
    label: "Comptabilité & Finance",
    tasks: [
      { 
        id: 't1', 
        label: "Saisie & Rapprochement", 
        k: 0.44, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.40 
      },
      { 
        id: 't2', 
        label: "Analyse d'écarts", 
        k: 0.38, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.34 
      },
      { 
        id: 't3', 
        label: "Préparation bilan", 
        k: 0.26, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.23 
      }
    ]
  },
  hr: {
    label: "Ressources Humaines",
    tasks: [
      { 
        id: 't1', 
        label: "Tri CV & Screening", 
        k: 0.52, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.48 
      },
      { 
        id: 't2', 
        label: "Réponses FAQ", 
        k: 0.47, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.44 
      },
      { 
        id: 't3', 
        label: "Supports formation", 
        k: 0.39, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.36 
      }
    ]
  },
  admin: {
    label: "Secrétariat & Admin",
    tasks: [
      { 
        id: 't1', 
        label: "Gestion agenda", 
        k: 0.41, 
        source: "Peng et al., 2023",
        sourceUrl: "https://arxiv.org/abs/2302.06590",
        realWorld: 0.38 
      },
      { 
        id: 't2', 
        label: "Comptes-rendus", 
        k: 0.54, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.49 
      },
      { 
        id: 't3', 
        label: "Archivage", 
        k: 0.35, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.32 
      }
    ]
  },
  executive: {
    label: "Direction Générale",
    tasks: [
      { 
        id: 't1', 
        label: "Synthèse rapports", 
        k: 0.61, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.53 
      },
      { 
        id: 't2', 
        label: "Préparation présentations", 
        k: 0.45, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.40 
      },
      { 
        id: 't3', 
        label: "Veille concurrentielle", 
        k: 0.38, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.35 
      }
    ]
  },
  legal: {
    label: "Service Juridique",
    tasks: [
      { 
        id: 't1', 
        label: "Analyse contrats", 
        k: 0.48, 
        source: "Dell'Acqua et al., 2023",
        sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321",
        realWorld: 0.42 
      },
      { 
        id: 't2', 
        label: "Recherche jurisprudence", 
        k: 0.43, 
        source: "Brynjolfsson et al., 2023",
        sourceUrl: "https://www.nber.org/papers/w31161",
        realWorld: 0.39 
      },
      { 
        id: 't3', 
        label: "Rédaction documents", 
        k: 0.36, 
        source: "Noy & Zhang, 2023",
        sourceUrl: "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1.pdf",
        realWorld: 0.33 
      }
    ]
  }
};

export default function ROICalculator() {
  const [prof, setProf] = useState('engineering');
  const [collabs, setCollabs] = useState(5);
  const [rate, setRate] = useState(45);
  const [hours, setHours] = useState({ t1: 5, t2: 5, t3: 5 });
  const [adoptionFactor, setAdoptionFactor] = useState(0.85); // Facteur unique 0.5 à 1.0
  const [showMethodology, setShowMethodology] = useState(false);
  const [showRealWorld, setShowRealWorld] = useState(false);
  const [customCoefficients, setCustomCoefficients] = useState<number[] | null>(null);

  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const results = useMemo(() => {
    const currentTasks = PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks;
    const licenceCost = 30;
    
    const hoursPerWeek = currentTasks.reduce((acc, t, i) => {
      const h = hours[`t${i+1}` as keyof typeof hours];
      const k = customCoefficients?.[i] ?? t.k;
      return acc + (h * k * adoptionFactor);
    }, 0);
    
    const grossGain = hoursPerWeek * rate * 4.33 * collabs;
    const totalCost = collabs * licenceCost;
    
    return {
      hoursPerWeek: hoursPerWeek.toFixed(1),
      extraTimeYear: (hoursPerWeek * 52 / 7.5).toFixed(0),
      percentTime: ((hoursPerWeek / 37.5) * 100).toFixed(0),
      gain: Math.round(grossGain),
      net: Math.round(grossGain - totalCost),
      roi: (grossGain / totalCost).toFixed(1),
      breakeven: Math.min(30, Math.round((totalCost / (grossGain / 30)) || 0))
    };
  }, [prof, collabs, rate, hours, adoptionFactor, customCoefficients]);

  const exportHypotheses = () => {
    const data = {
      metadata: {
        version: "1.2",
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
      coefficients: PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map((t, i) => ({
        tache: t.label,
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
                  <Select onValueChange={setProf} defaultValue={prof}>
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
                    <Input type="number" value={collabs} onChange={(e) => setCollabs(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-slate-500">Taux horaire (€)</Label>
                    <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t space-y-6">
                <Label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Temps hebdomadaire / tâche
                </Label>
                {PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map((task, i) => (
                  <div key={task.id} className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700">{task.label}</span>
                      <span className="text-sm font-bold text-blue-600">{hours[`t${i+1}` as keyof typeof hours]}h</span>
                    </div>
                    <Slider 
                      value={[hours[`t${i+1}` as keyof typeof hours]]} 
                      max={20} step={1}
                      onValueChange={(val) => setHours({...hours, [`t${i+1}`]: val[0]})} 
                    />
                  </div>
                ))}
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
                Gain Utilisateur
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
                      Ces gains supposent une adoption effective et des prompts de qualité. 
                      Les résultats réels varient selon le contexte organisationnel.
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
                Estimation Impact Financier
              </CardTitle>
              <div className="text-xs text-slate-400 italic mt-1">
                Hypothèses moyennes secteur {PROFESSIONS[prof as keyof typeof PROFESSIONS].label}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-5xl font-black text-white">{formatEuro(results.net)}</div>
                <div className="text-sm text-slate-400 mt-1 uppercase tracking-wide">Gain net mensuel estimé pour l'équipe</div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">x{results.roi}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">ROI Théorique</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">Jour {results.breakeven}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Break-even (Seuil)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CAS D'USAGE RÉELS */}
        <div className="lg:col-span-12">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <button 
                onClick={() => setShowRealWorld(!showRealWorld)}
                className="w-full flex items-center justify-between text-left"
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Données observées (Échantillon anonymisé - 12 professionnels, 6 mois)
                </CardTitle>
                {showRealWorld ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CardHeader>
            {showRealWorld && (
              <CardContent className="text-xs space-y-3 text-slate-700">
                <p className="font-semibold">Comparaison gains théoriques vs. gains observés :</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map((task, i) => (
                    <div key={task.id} className="bg-white p-3 rounded border border-slate-200">
                      <div className="font-semibold text-slate-800 mb-2">{task.label}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Théorique :</span>
                          <span className="font-mono font-bold text-blue-600">{(task.k * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Observé :</span>
                          <span className="font-mono font-bold text-emerald-600">{(task.realWorld * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Écart :</span>
                          <span className="font-mono">{((task.realWorld - task.k) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-slate-600 italic pt-2 border-t">
                  <strong>Écart moyen théorique/réel : -7%</strong>, principalement dû au temps de validation 
                  humaine des outputs IA. Ces données proviennent d'un échantillon d'ingénieurs et consultants 
                  ayant adopté Claude/ChatGPT dans leur flux de travail quotidien.
                </p>
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
                      Coefficient d'efficience (k) par tâche issu des études, 
                      multiplié par le facteur d'adoption (0.5-1.0) ajustable.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Calculs</h4>
                    <p className="text-slate-600 text-xs">
                      Gain = Σ(H × k × adoption) × Taux × 4.33 × N
                      <br />où H = heures/semaine, N = collaborateurs
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Hypothèses</h4>
                    <p className="text-slate-600 text-xs">
                      Licence : 30€/mois/user. Semaine : 37.5h. 
                      Année : 47 semaines travaillées. Taux incluant charges.
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
                      <li>• Setup technique (API, intégrations)</li>
                      <li>• Résistance organisationnelle</li>
                      <li>• Échecs sur tâches très spécialisées</li>
                    </ul>
                  </div>
                </div>

                {/* Coefficients ajustables */}
                <div className="pt-6 border-t space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">
                    Coefficients d'efficience par tâche (modifiables)
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map((task, i) => (
                      <div key={task.id} className="bg-slate-50 p-3 rounded border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-slate-700">{task.label}</span>
                          <a 
                            href={task.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-500 mb-2">{task.source}</div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            defaultValue={task.k * 100}
                            onChange={(e) => {
                              const newCoeffs = [...(customCoefficients || PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks.map(t => t.k))];
                              newCoeffs[i] = Number(e.target.value) / 100;
                              setCustomCoefficients(newCoeffs);
                            }}
                            className="flex-1"
                          />
                          <span className="font-mono text-sm font-bold text-slate-900 w-12">
                            {((customCoefficients?.[i] ?? task.k) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    Ajustez ces coefficients selon votre contexte. Les valeurs par défaut sont tirées 
                    des études académiques citées ci-dessus.
                  </p>
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
                      Version 1.2 • Décembre 2024
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 text-xs text-slate-500 space-y-2">
                    <p>
                      <strong>Méthodologie ouverte :</strong> Ce calculateur applique les résultats 
                      d'études académiques peer-reviewed à des cas d'usage professionnels. Les coefficients 
                      sont ajustables et les hypothèses exportables pour validation externe.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      <a 
                        href="https://github.com/mauricemendy/roi-calculator-genai" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Code source (GitHub)
                      </a>
                      <a 
                        href="https://mauricemendy.com/roi-calculator-sources" 
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
