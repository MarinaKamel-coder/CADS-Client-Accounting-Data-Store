"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User, FileText, X } from "lucide-react"; 

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fermer si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logique de recherche (Appel API ou Action)
  useEffect(() => {
    const searchClients = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setIsOpen(true);
    };

    const timer = setTimeout(searchClients, 300); // Debounce pour économiser le serveur
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (clientId: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client (Nom, NAS...)"
          className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
        />
        {query && (
          <button type="button" title="closeButton" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Résultats Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {results.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelect(client.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{client.firstName} {client.lastName}</p>
                    <p className="text-[10px] text-slate-500 font-mono tracking-tight">{client.nasNumber}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">DOSSIER</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}