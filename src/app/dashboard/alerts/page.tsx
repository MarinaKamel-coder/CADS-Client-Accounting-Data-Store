import { auth } from "@clerk/nextjs/server";
import prisma from "../../../lib/prisma";
import { 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  Trash2, 
  Calendar, 
  User as UserIcon,
  Clock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { 
  completeDeadlineAction, 
  archiveDeadlineAction, 
  deleteDeadlineAction 
} from "../../../actions/alerts";

export default async function AlertsPage() {
  const { userId } = await auth();

  // On récupère les échéances PENDING prévues dans les 7 prochains jours
  const today = new Date();
  const oneweeklater = new Date();
  oneweeklater.setDate(today.getDate() + 7);

  const urgentDeadlines = await prisma.deadline.findMany({
    where: {
      userId: userId!,
      status: "PENDING",
      dueDate: {
        lte: oneweeklater,
        gte: today,
      },
    },
    include: {
      client: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Alertes <span className="text-blue-600">&</span> Priorités
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Vous avez <span className="text-blue-600 font-bold">{urgentDeadlines.length} échéances</span> critiques à traiter.
          </p>
        </div>
        <div className="hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                Mise à jour en temps réel
            </span>
        </div>
      </div>

      {/* LISTE DES ALERTES */}
      <div className="grid gap-4">
        {urgentDeadlines.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tout est sous contrôle !</h3>
            <p className="text-slate-500 max-w-xs mt-2 font-medium">
              Aucune échéance urgente n'a été trouvée pour les 30 prochains jours.
            </p>
          </div>
        ) : (
          urgentDeadlines.map((deadline) => (
            <div 
              key={deadline.id}
              className="group bg-white p-1 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                
                {/* Info Client & Titre */}
                <div className="flex items-start gap-5 flex-1">
                  <div className={`p-5 rounded-3xl shrink-0 ${
                    deadline.priority === 'HIGH' 
                    ? 'bg-red-50 text-red-500 shadow-inner' 
                    : 'bg-amber-50 text-amber-500'
                  }`}>
                    <AlertTriangle size={28} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                             deadline.type === 'FEDERAL' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                            {deadline.type}
                        </span>
                        {deadline.priority === 'HIGH' && (
                            <span className="animate-pulse flex h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                    </div>
                    <h4 className="font-black text-xl text-slate-900 leading-tight mb-1">
                      {deadline.title}
                    </h4>
                    <Link 
                        href={`/dashboard/client/${deadline.clientId}`}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-semibold transition-colors"
                    >
                      <UserIcon size={14} />
                      {deadline.client.firstName} {deadline.client.lastName}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-lg justify-end">
                      <Clock size={18} className="text-slate-400" />
                      {new Date(deadline.dueDate).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Échéance</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bouton Compléter */}
                    <form action={async () => {
                        "use server";
                        await completeDeadlineAction(deadline.id);
                    }}>
                        <button title="check" type="submit" className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm">
                            <CheckCircle size={20} />
                        </button>
                    </form>

                    {/* Bouton Archiver */}
                    <form action={async () => {
                        "use server";
                        await archiveDeadlineAction(deadline.id);
                    }}>
                        <button title="archive" type="submit" className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm">
                            <Archive size={20} />
                        </button>
                    </form>

                    {/* Bouton Supprimer */}
                    <form action={async () => {
                        "use server";
                        await deleteDeadlineAction(deadline.id);
                    }}>
                        <button title="trash" type="submit" className="p-4 bg-red-50 text-red-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm">
                            <Trash2 size={20} />
                        </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}