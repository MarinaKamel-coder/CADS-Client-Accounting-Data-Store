"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nasNumber: string;
  status: string;
}

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
  if (initialClients.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">Aucun client trouvé.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4">
            <th className="pb-2 pl-4">Client</th>
            <th className="pb-2">Coordonnées</th>
            <th className="pb-2">NAS</th>
            <th className="pb-2">Statut</th>
            <th className="pb-2 text-right pr-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {initialClients.map((client) => (
            <tr 
              key={client.id} 
              className="bg-white hover:bg-slate-50 transition-colors group shadow-sm ring-1 ring-slate-100 rounded-xl"
            >
              <td className="py-4 pl-4 rounded-l-xl">
                <div className="font-bold text-slate-900">
                  {client.firstName} {client.lastName}
                </div>
              </td>
              <td className="py-4">
                <div className="text-sm text-slate-500">{client.email}</div>
              </td>
              <td className="py-4">
                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                  {client.nasNumber}
                </code>
              </td>
              <td className="py-4">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                  client.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {client.status === 'ACTIVE' ? 'Actif' : 'Archives'}
                </span>
              </td>
              <td className="py-4 pr-4 text-right rounded-r-xl">
                <Link 
                  href={`/dashboard/clients/${client.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 font-bold text-sm hover:underline"
                >
                  Voir fiche
                  <ChevronRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}