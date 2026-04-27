"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Plus, Users, CheckCircle2, XCircle, FileText, CalendarClock, AlertCircle, Target } from "lucide-react";
import AddClientForm from "./AddClientForm";
import ClientSearch from "./ClientSearch"; 
import Toast from "./Toast";

// Imports dynamiques pour Recharts (SSR: false car Recharts utilise window)
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });

export default function DashboardClient({ initialClients }: { initialClients: any[] }) {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // État pour le filtre de la liste dans le dashboard
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  if (!isMounted) return <div className="h-screen w-full bg-slate-50/50" />;

  // Calculs des statistiques
  const total = initialClients?.length || 0;
  const activeClients = initialClients?.filter(c => c.status === "ACTIVE").length || 0;
  const inactive = total - activeClients;
  const activeRate = total > 0 ? Math.round((activeClients / total) * 100) : 0;
  const totalDeadlines = initialClients?.reduce((acc, client) => acc + (client._count?.deadlines || 0), 0) || 0;

  const pieData = total > 0 
    ? [ 
        { name: 'Actifs', value: activeClients, fill: '#3b82f6' }, 
        { name: 'Inactifs', value: inactive, fill: '#f43f5e' } 
      ]
    : [ { name: 'Vide', value: 1, fill: '#e2e8f0' } ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 p-2 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Tableau de <span className="text-blue-600">Bord</span>
          </h2>
          <p className="text-slate-500 font-medium">Content de vous revoir ! Voici l'état de vos dossiers.</p>
        </div>
        <button 
          onClick={() => setOpen(true)} 
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Nouveau Dossier
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clients" value={total} icon={<Users size={20}/>} color="blue" />
        <StatCard title="Taux d'activité" value={`${activeRate}%`} icon={<CheckCircle2 size={20}/>} color="emerald" />
        <StatCard title="Inactifs" value={inactive} icon={<XCircle size={20}/>} color="rose" />
        <StatCard title="Échéances" value={totalDeadlines} icon={<FileText size={20}/>} color="indigo" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* GRAPHIQUE DE RÉPARTITION */}
        <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full flex justify-between items-center mb-8">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Répartition</h4>
            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase">Temps réel</span>
          </div>
          
          <div className="relative w-full aspect-square max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius="75%" 
                  outerRadius="100%" 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900">{activeRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actifs</span>
            </div>
          </div>

          <div className="flex gap-6 mt-8">
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-slate-600">Actifs ({activeClients})</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-xs font-bold text-slate-600">Inactifs ({inactive})</span>
             </div>
          </div>
        </div>

        {/* LISTE DES DOSSIERS RÉCENTS AVEC FILTRES */}
        <div className="xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dossiers récents</h4>
            
            {/* SÉLECTEUR DE FILTRE COMPACT */}
            <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
              <button 
                onClick={() => setActiveFilter("ALL")}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                TOUS
              </button>
              <button 
                onClick={() => setActiveFilter("INDIVIDUAL")}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeFilter === 'INDIVIDUAL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                PERSO
              </button>
              <button 
                onClick={() => setActiveFilter("BUSINESS")}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeFilter === 'BUSINESS' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                PRO
              </button>
            </div>
          </div>

          <div className="p-4 flex-1">
            <ClientSearch 
              initialClients={initialClients} 
              activeFilter={activeFilter} 
            />
          </div>
        </div>
      </div>

      {/* MODAL D'AJOUT */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 relative z-10 animate-in zoom-in-95 duration-300">
            <AddClientForm 
              onSuccess={() => { setOpen(false); setShowToast(true); }} 
              onCancel={() => setOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* TOAST DE CONFIRMATION */}
      {showToast && (
        <Toast 
          message="Client ajouté avec succès au cabinet." 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}

// Composant Interne StatCard
function StatCard({ title, value, icon, color }: any) {
  const themes: any = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50"
  };
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${themes[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}