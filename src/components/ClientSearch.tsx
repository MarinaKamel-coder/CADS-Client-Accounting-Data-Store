"use client";

import { useState, useMemo } from "react";
import { Search, User, Building2, FileText, Calendar, ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";

interface ClientSearchProps {
  initialClients: any[];
  activeFilter: string; // "ALL", "INDIVIDUAL", "BUSINESS"
}

export default function ClientSearch({ initialClients, activeFilter }: ClientSearchProps) {
  const [query, setQuery] = useState("");

  // Logique de filtrage combinée (Recherche + Type)
  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      // 1. Filtrage par texte (Nom, Prénom, Email, Compagnie)
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const searchLower = query.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.companyName?.toLowerCase().includes(searchLower);

      // 2. Filtrage par type de client
      // Note: On assume que ton modèle Prisma a un champ 'clientType' 
      // ou on peut vérifier la présence de 'companyName'
      const isBusiness = client.clientType === "BUSINESS" || !!client.companyName;
      const matchesType = 
        activeFilter === "ALL" || 
        (activeFilter === "BUSINESS" && isBusiness) || 
        (activeFilter === "INDIVIDUAL" && !isBusiness);

      return matchesSearch && matchesType;
    });
  }, [query, activeFilter, initialClients]);

  return (
    <div className="space-y-6">
      {/* BARRE DE RECHERCHE INTERNE */}
      <div className="relative group">
        <Search 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Rechercher un nom, un courriel ou une entreprise..."
          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all text-slate-700 font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* LISTE DES RÉSULTATS */}
      <div className="grid grid-cols-1 gap-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Link 
              key={client.id} 
              href={`/dashboard/clients/${client.id}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Avatar / Icône Type */}
                <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${
                  client.companyName ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {client.companyName ? <Building2 size={24} /> : <User size={24} />}
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">
                    {client.firstName} {client.lastName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {client.companyName && (
                      <span className="text-xs font-bold text-purple-600 bg-purple-100/50 px-2 py-0.5 rounded-md">
                        {client.companyName}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      {client.email || "Aucun courriel"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats rapides (Badge Documents & Échéances) */}
              <div className="flex items-center gap-6 mt-4 md:mt-0 px-2">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5" title="Documents">
                      <FileText size={16} />
                      <span className="text-sm font-bold text-slate-600">{client._count?.documents || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Échéances">
                      <Calendar size={16} />
                      <span className="text-sm font-bold text-slate-600">{client._count?.deadlines || 0}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="p-6 bg-white rounded-full shadow-sm text-slate-200 mb-4">
              <Inbox size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun client trouvé</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
              Essayez de modifier vos termes de recherche ou vos filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}