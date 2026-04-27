"use client";

import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import DeadlineSummary from "./DeadlineSummary";

interface DeadlineFiltersProps {
  initialDeadlines: any[];
}

export default function DeadlineFilters({ initialDeadlines }: DeadlineFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const filtered = useMemo(() => {
    return initialDeadlines.filter((d) => {
      const matchesSearch = 
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.client.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = filterPriority === "ALL" || d.priority === filterPriority;
      
      return matchesSearch && matchesPriority;
    });
  }, [searchTerm, filterPriority, initialDeadlines]);

  const pending = filtered.filter(d => d.status === "PENDING");
  const completed = filtered.filter(d => d.status === "COMPLETED");

  return (
    <div className="space-y-6">
      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par titre ou client..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none"
          aria-label="filter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="ALL">Toutes les priorités</option>
          <option value="HIGH">🔥 Haute Priorité</option>
          <option value="MEDIUM">⚡ Moyenne</option>
          <option value="LOW">🛡️ Basse</option>
        </select>

        {(searchTerm || filterPriority !== "ALL") && (
          <button 
            onClick={() => { setSearchTerm(""); setFilterPriority("ALL"); }}
            className="flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={18} /> <span className="text-sm font-bold uppercase">Réinitialiser</span>
          </button>
        )}
      </div>

      {/* RÉSULTATS */}
      <div className="grid grid-cols-1 gap-10">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
              Échéances Actives ({pending.length})
            </h2>
            <span className="h-px flex-1 bg-slate-100 mx-4"></span>
          </div>
          <DeadlineSummary deadlines={pending} />
        </section>

        {completed.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2 text-slate-400">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Historique ({completed.length})</h2>
              <span className="h-px flex-1 bg-slate-50 mx-4"></span>
            </div>
            <div className="opacity-75 grayscale-[0.5] hover:grayscale-0 transition-all">
              <DeadlineSummary deadlines={completed} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}