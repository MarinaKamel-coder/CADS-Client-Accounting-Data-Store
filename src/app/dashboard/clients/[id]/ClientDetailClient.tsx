"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, CalendarClock, User as UserIcon, ArrowLeft, 
  Settings, Briefcase, Edit3, FileDown ,Eye, EyeOff
} from "lucide-react";
import { decrypt } from "../../../../lib/encryption";

import FileUpload from "../../../../components/FileUpload";
import DocumentList from "../../../../components/DocumentList";
import AddDeadlineForm from "../../../../components/AddDeadlineForm";
import DeadlineSummary from "../../../../components/DeadlineSummary";
import EditClientModal from "../../../../components/EditClientModal";

export default function ClientDetailClient({ client, activeTab }: { client: any, activeTab: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (client) {
  client.nasNumber = decrypt(client.nasNumber); 
}

  // Fonction d'exportation fonctionnelle
  const handleExport = () => {
    const content = `
      FICHE CLIENT - CADS
      ---------------------
      Nom complet : ${client.firstName} ${client.lastName}
      Email : ${client.email}
      NAS : ${client.nasNumber}
      Téléphone : ${client.phone}
      Statut : ${client.status}
      Date de création : ${new Date(client.createdAt).toLocaleDateString()}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fiche_${client.lastName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "infos", label: "Informations", icon: <UserIcon size={18} /> },
    { id: "docs", label: "Documents", icon: <FileText size={18} />, count: client._count.documents },
    { id: "deadlines", label: "Échéances", icon: <CalendarClock size={18} />, count: client._count.deadlines },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clients" className="p-3 bg-white border border-slate-100 shadow-sm hover:bg-slate-50 rounded-2xl transition-all">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {client.firstName} {client.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dossier #{client.id.slice(0,8)}</span>
               <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {client.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-[1.5rem] w-fit border border-slate-200/50 backdrop-blur-sm">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.id ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t.icon} {t.label}
            {t.count !== undefined && <span className="ml-1 opacity-50">{t.count}</span>}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "infos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Briefcase size={120} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                 Détails du profil
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {/* On ajoute l'indicateur isNAS ici */}
                <InfoItem 
                    label="Numéro d'assurance sociale" 
                    value={client.nasNumber} 
                    isNAS={true} 
                />
                
                <InfoItem label="Courriel" value={client.email} />
                <InfoItem label="Téléphone" value={client.phone} />
                <InfoItem label="Adresse" value={client.address} />
               </div>
            </div>
            
            <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                   <Settings className="text-blue-400" />
                </div>
                <h4 className="font-black text-2xl mb-3 tracking-tight">Actions Rapides</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Gérez les informations critiques du dossier ou exportez une fiche complète.
                </p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="w-full py-4 bg-blue-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                >
                  <Edit3 size={18} /> Modifier le client
                </button>
                <button 
                  onClick={handleExport}
                  className="w-full py-4 bg-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/5 active:scale-95"
                >
                  <FileDown size={18} /> Exporter la fiche
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "docs" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <FileUpload clientId={client.id} />
            <DocumentList documents={client.documents} />
          </div>
        )}

        {activeTab === "deadlines" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4"><AddDeadlineForm clientId={client.id} /></div>
            <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"><DeadlineSummary deadlines={client.deadlines} /></div>
          </div>
        )}
      </div>

      {/* Modale de modification */}
      {isEditOpen && <EditClientModal client={client} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
}

function InfoItem({ label, value, isNAS = false }: { label: string, value: string, isNAS?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

 
  const formatNAS = (nas: string) => {
    if (!nas) return "—";
    const cleaned = nas.replace(/\D/g, ""); 
    if (cleaned.length < 9) return nas; 
    return `***-***-${cleaned.slice(-3)}`;
  };

  return (
    <div className="group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-hover:text-blue-500 transition-colors">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        <p className={`text-slate-900 font-bold ${isNAS ? 'font-mono text-xl tracking-tighter' : 'text-lg'}`}>
          {isNAS && !isVisible ? formatNAS(value) : value || "—"}
        </p>

        {isNAS && value && (
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
            title={isVisible ? "Masquer" : "Afficher"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}