"use client";

import { useState } from "react";
import { updateClientAction } from "../actions/client";
import { X, User, Save, Loader2, Building2 } from "lucide-react";

interface EditClientModalProps {
  client: any;
  onClose: () => void;
}

export default function EditClientModal({ client, onClose }: EditClientModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Initialisation du type basé sur les données existantes du client
  const [type, setType] = useState(client.clientType || (client.companyName ? "BUSINESS" : "INDIVIDUAL"));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // On injecte le type de client dans l'objet de données
    const result = await updateClientAction(client.id, { ...data, clientType: type });
    
    if (result.success) {
      onClose();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1";
  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        <button title="closeButton" type="button" onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            {type === "BUSINESS" ? <Building2 size={24} /> : <User size={24} />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Modifier le <span className="text-blue-600">Dossier</span></h2>
        </div>

        {/* TOGGLE TYPE CLIENT */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setType("INDIVIDUAL")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${
              type === "INDIVIDUAL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
            }`}
          >
            <User size={14} /> PARTICULIER
          </button>
          <button
            type="button"
            onClick={() => setType("BUSINESS")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${
              type === "BUSINESS" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400"
            }`}
          >
            <Building2 size={14} /> ENTREPRISE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          
          {/* CHAMP ENTREPRISE CONDITIONNEL */}
          {type === "BUSINESS" && (
            <div className="col-span-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
              <label className={labelStyle}>Nom de l'entreprise</label>
              <input 
                name="companyName" 
                defaultValue={client.companyName} 
                aria-label="companyName"
                className={`${inputStyle} border-purple-100 focus:border-purple-500 focus:ring-purple-500/20`} 
                required 
              />
            </div>
          )}

          <div className="space-y-1">
            <label className={labelStyle}>Prénom</label>
            <input name="firstName" defaultValue={client.firstName} aria-label="firstName" className={inputStyle} required />
          </div>
          
          <div className="space-y-1">
            <label className={labelStyle}>Nom de famille</label>
            <input name="lastName" defaultValue={client.lastName} aria-label="lastName" className={inputStyle} required />
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelStyle}>Courriel</label>
            <input name="email" type="email" defaultValue={client.email} aria-label="email" className={inputStyle} required />
          </div>

          <div className="space-y-1">
            <label className={labelStyle}>NAS</label>
            <input name="nasNumber" defaultValue={client.nasNumber} aria-label="nasNumber" className={`${inputStyle} font-mono`} required />
          </div>

          <div className="space-y-1">
            <label className={labelStyle}>Téléphone</label>
            <input name="phone" defaultValue={client.phone} aria-label="phone" className={inputStyle} />
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelStyle}>Statut du dossier</label>
            <select name="status" defaultValue={client.status} aria-label="status" className={`${inputStyle} font-bold appearance-none bg-white`}>
              <option value="ACTIVE">✅ Actif</option>
              <option value="INACTIVE">❌ Inactif</option>
            </select>
          </div>

          <div className="col-span-2 flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 shadow-xl shadow-slate-200 disabled:opacity-50 transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}