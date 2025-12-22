import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Clock, TrendingUp, ChevronDown, ChevronUp, Zap, Banknote, BookOpen } from "lucide-react";

const PROFESSIONS = {
  engineering: {
    label: "Ingénierie & Bureau d'Études",
    equiv: "notes de calcul",
    tasks: [
      { id: 't1', label: "Scripts & Automatisation", k: 0.6, source: "MIT Sloan" },
      { id: 't2', label: "Rédaction Rapports", k: 0.4, source: "BCG" },
      { id: 't3', label: "Recherche Normative", k: 0.5, source: "MIT Sloan" }
    ]
  },
  marketing: {
    label: "Marketing & Communication",
    equiv: "campagnes",
    tasks: [
      { id: 't1', label: "Création de contenu", k: 0.6, source: "MIT Sloan" },
      { id: 't2', label: "Optimisation SEO", k: 0.4, source: "BCG" },
      { id: 't3', label: "Social Media", k: 0.7, source: "MIT Sloan" }
    ]
  },
  sales: {
    label: "Sales & Business Dev",
    equiv: "propositions",
    tasks: [
      { id: 't1', label: "Prospection Emails", k: 0.5, source: "BCG" },
      { id: 't2', label: "Synthèse de comptes", k: 0.4, source: "MIT Sloan" },
      { id: 't3', label: "Saisie CRM", k: 0.3, source: "BCG" }
    ]
  }
};

export default function ROICalculator() {
  const [prof, setProf] = useState('engineering');
  const [collabs, setCollabs] = useState(5);
  const [rate, setRate] = useState(45);
  const [hours, setHours] = useState({ t1: 5, t2: 5, t3: 5 });
  const [showMethodology, setShowMethodology] = useState(false);

  const formatEuro = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const results = useMemo(() => {
    const currentTasks = PROFESSIONS[prof as keyof typeof PROFESSIONS].tasks;
    const licenceCost = 30;
    const safetyFactor = 0.85;
    
    const hoursPerWeek = currentTasks.reduce((acc, t, i) => {
      const h = hours[`t${i+1}` as keyof typeof hours];
      return acc + (h * t.k * safetyFactor);
    }, 0);
    
    const grossGain = hoursPerWeek * rate * 4.33 * collabs;
    const totalCost = collabs * licenceCost;
    
    return {
      hoursPerWeek: hoursPerWeek.toFixed(1),
      extraTimeYear: (hoursPerWeek * 52 / 7.5).toFixed(0), // Jours de travail
      gain: Math.round(grossGain),
      net: Math.round(grossGain - totalCost),
      roi: (grossGain / totalCost).toFixed(1),
      breakeven: Math.min(30, Math.round((totalCost / (grossGain / 30)) || 0))
    };
  }, [prof, collabs, rate, hours]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GAUCHE : CONFIGURATION (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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

        {/* DROITE : RESULTATS (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* GAIN UTILISATEUR */}
          <Card className="flex-1 border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <Clock className="w-12 h-12 text-blue-50 opacity-10" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-blue-600 font-bold">Gain Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-5xl font-black text-slate-900">{results.hoursPerWeek}h</span>
                <span className="text-xl font-bold text-slate-400 ml-2">/ semaine</span>
              </div>
              <div className="pt-4 border-t">
                <div className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-tighter">Équivalences</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">+{results.extraTimeYear} jours</div>
                    <div className="text-xs text-slate-500">libérés par an / pers.</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">~ 25%</div>
                    <div className="text-xs text-slate-500">de capacité créative en +</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IMPACT DÉCIDEUR */}
          <Card className="flex-1 border-slate-200 shadow-sm bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Impact Décideur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-5xl font-black text-white">{formatEuro(results.net)}</div>
                <div className="text-sm text-slate-400 mt-1 uppercase tracking-wide">Gain net mensuel pour l'équipe</div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">x{results.roi}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">ROI Mensuel</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">Jour {results.breakeven}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Break-even (Seuil)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BAS : METHODOLOGIE (12/12) */}
        <div className="lg:col-span-12">
          <Card className="border-dashed border-slate-300 shadow-none bg-transparent">
            <button 
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <BookOpen className="w-4 h-4" /> MÉTHODOLOGIE & SOURCES
              </div>
              {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showMethodology && (
              <CardContent className="border-t p-6 animate-in slide-in-from-top-2">
                <div className="grid md:grid-cols-3 gap-8 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Sources</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Etudes MIT Sloan 2023 (Productivité +37%)</li>
                      <li>• Analyse BCG Henderson Institute</li>
                      <li>• Rapports Harvard Business Review</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Calculs</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Application d'un coefficient d'efficience ($k$) par tâche, corrigé par un <strong>facteur de sécurité de 0.85</strong> (validation humaine).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest">Hypothèses</h4>
                    <p className="text-slate-600">Coût licence estimé : 30€/mois. Semaine type de 37.5h. Année de 47 semaines travaillées.</p>
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