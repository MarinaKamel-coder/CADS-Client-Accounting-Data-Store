"use client";

import { useState, useMemo } from "react";
import { Plus, Users, Filter, Search as SearchIcon } from "lucide-react";
import ClientSearch from "../../../components/ClientSearch";
import AddClientForm from "../../../components/AddClientForm";
import Toast from "../../../components/Toast";

export default function ClientsClientPage({ initialClients }: { initialClients: any[] }) {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [filterType, setFilterType] = useState("ALL"); // ALL, INDIVIDUAL, BUSINESS

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION AVEC ACTIONS RAPIDES */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/40 p-8 rounded-[2.5rem] border border-slate-100 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Mes <span className="text-blue-600">Clients</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {initialClients.length} dossiers enregistrés au total.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* FILTRE RAPIDE */}
          <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
             <button 
                onClick={() => setFilterType("ALL")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Tous
             </button>
             <button 
                onClick={() => setFilterType("INDIVIDUAL")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'INDIVIDUAL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Particuliers
             </button>
             <button 
                onClick={() => setFilterType("BUSINESS")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'BUSINESS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Entreprises
             </button>
          </div>

          <button 
            onClick={() => setOpen(true)} 
            className="flex-1 xl:flex-none group flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Nouveau Dossier
          </button>
        </div>
      </div>

      {/* LISTE ET RECHERCHE FILTRÉE */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[600px]">
        {/* On passe le filterType au composant ClientSearch pour qu'il filtre la liste */}
        <ClientSearch 
            initialClients={initialClients} 
            activeFilter={filterType} 
        />
      </div>

      {/* MODAL D'AJOUT (Inchangé) */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 relative z-10 animate-in zoom-in-95 duration-300">
            <AddClientForm 
              onSuccess={() => { setOpen(false); setShowToast(true); }} 
              onCancel={() => setOpen(false)} 
            />
          </div>
        </div>
      )}

      {showToast && (
        <Toast message="Le nouveau dossier client a été créé." onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}