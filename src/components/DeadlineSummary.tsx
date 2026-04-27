"use client";

import Link from "next/link";
import { toggleDeadlineAction } from "../actions/toggle-deadline";
import { deleteDeadlineAction } from "../actions/alerts";
import { Edit3, Trash2, User, Calendar, Building2 } from "lucide-react";

export default function DeadlineSummary({ deadlines }: { deadlines: any[] }) {
  if (deadlines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
        <span className="text-4xl mb-3">🎉</span>
        <p className="text-slate-500 font-medium">Aucune obligation pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deadlines.map((item) => {
        const isOverdue = new Date(item.dueDate) < new Date() && item.status === "PENDING";
        
        return (
          <div 
            key={item.id} 
            className={`group relative bg-white p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-xl ${
              isOverdue ? "border-red-100 bg-red-50/20" : "border-slate-100"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Checkbox Custom */}
                <button 
                  onClick={async () => await toggleDeadlineAction(item.id, item.status)}
                  className={`mt-1 shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.status === 'COMPLETED' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                      : 'border-slate-200 group-hover:border-blue-400 bg-white'
                  }`}
                >
                  {item.status === 'COMPLETED' && <span className="text-xs font-bold">✓</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className={`font-black text-base truncate tracking-tight ${
                      item.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h4>
                    
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                      item.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                      item.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={14} className="text-slate-400" /> 
                      {new Date(item.dueDate).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}
                    </span>
                    
                    <span className="flex items-center gap-1.5 text-slate-400 uppercase tracking-widest text-[10px]">
                      <Building2 size={14} /> {item.type}
                    </span>

                    {item.client && (
                      <Link 
                        href={`/dashboard/clients/${item.clientId}`}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <User size={14} />
                        {item.client.firstName} {item.client.lastName}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION ACTIONS */}
              <div className="flex items-center gap-1 ml-4">
                {isOverdue && (
                  <span className="hidden lg:block mr-2 text-[10px] font-black text-red-500 animate-pulse uppercase tracking-widest">
                    En retard
                  </span>
                )}

                {/* Bouton Modifier */}
                <Link 
                  href={`/dashboard/deadlines/edit/${item.id}`}
                  className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  title="Modifier"
                >
                  <Edit3 size={18} />
                </Link>

                {/* Bouton Supprimer */}
                <button 
                  onClick={async () => {
                    if(confirm("Supprimer cette obligation ?")) {
                      await deleteDeadlineAction(item.id);
                    }
                  }}
                  className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}