import prisma from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeadlineFilters from "../../../components/DeadlineFilters";
import { CalendarClock, AlertCircle, Target } from "lucide-react";

export default async function ObligationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Récupération de toutes les échéances liées à l'utilisateur
  const allDeadlines = await prisma.deadline.findMany({
    where: { 
        userId: userId 
    },
    include: { 
        client: true 
    },
    orderBy: { 
        dueDate: 'asc' 
    },
  });

  // Calcul des statistiques pour l'en-tête
  const pending = allDeadlines.filter(d => d.status === "PENDING");
  const completed = allDeadlines.filter(d => d.status === "COMPLETED");
  const highPriorityCount = pending.filter(d => d.priority === "HIGH").length;
  
  const completionRate = allDeadlines.length > 0 
    ? Math.round((completed.length / allDeadlines.length) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <CalendarClock size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                Gestion du Cabinet
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Obligations <span className="text-blue-600">Fiscales</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Vue d'ensemble et suivi des échéances pour l'ensemble de vos clients.
          </p>
        </div>

        {/* Badge Urgence */}
        {highPriorityCount > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-6 py-3 rounded-2xl shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-black text-red-700 uppercase tracking-wider">
                {highPriorityCount} Urgences critiques
            </span>
          </div>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">En attente</p>
            <p className="text-5xl font-black mt-2">{pending.length}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 text-slate-800 opacity-50 group-hover:scale-110 transition-transform">
             <AlertCircle size={120} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Terminées</p>
          <p className="text-5xl font-black text-slate-900 mt-2">{completed.length}</p>
          <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform">
             <Target size={120} />
          </div>
        </div>

        <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-between">
          <p className="text-emerald-100 text-xs font-black uppercase tracking-widest">Performance</p>
          <div>
            <p className="text-5xl font-black">{completionRate}%</p>
            <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                    className="bg-white h-full transition-all duration-1000" 
                    style={{ width: `${completionRate}%` }}
                ></div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* COMPOSANT CLIENT : FILTRES + LISTE */}
      {/* C'est ici que la recherche et les boutons modifier/supprimer prennent vie */}
      <DeadlineFilters initialDeadlines={allDeadlines} />

    </div>
  );
}