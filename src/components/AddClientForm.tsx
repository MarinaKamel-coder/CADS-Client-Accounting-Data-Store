"use client";

import { useState } from "react";
import { createClientAction } from "../actions/client";
import { User, Building2 } from "lucide-react";

interface AddClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any; // Pour gérer la modification
}

export default function AddClientForm({ onSuccess, onCancel, initialData }: AddClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le type de client
  const [type, setType] = useState(initialData?.clientType || "INDIVIDUAL");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // On s'assure que le type est inclus dans les données envoyées
    const result = await createClientAction({ ...data, clientType: type });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  const inputStyle = "w-full border border-slate-200 p-3 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 bg-slate-50/50 focus:bg-white";
  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">
        {initialData ? "Modifier le Dossier" : "Nouveau Dossier Client"}
      </h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded-xl animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {/* SÉLECTEUR DE TYPE (TOGGLE) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setType("INDIVIDUAL")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
            type === "INDIVIDUAL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-500"
          }`}
        >
          <User size={16} />
          PARTICULIER
        </button>
        <button
          type="button"
          onClick={() => setType("BUSINESS")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
            type === "BUSINESS" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-500"
          }`}
        >
          <Building2 size={16} />
          ENTREPRISE
        </button>
      </div>

      {/* CHAMP ENTREPRISE CONDITIONNEL */}
      {type === "BUSINESS" && (
        <div className="flex flex-col animate-in zoom-in-95 duration-300">
          <label className={labelStyle}>Nom de l'entreprise</label>
          <input 
            name="companyName" 
            type="text" 
            className={inputStyle} 
            required 
            placeholder="Ex: Yulcom Technologies"
            defaultValue={initialData?.companyName}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelStyle}>Prénom</label>
          <input 
            name="firstName" 
            type="text" 
            className={inputStyle} 
            required 
            placeholder="Jean" 
            defaultValue={initialData?.firstName}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelStyle}>Nom</label>
          <input 
            name="lastName" 
            type="text" 
            className={inputStyle} 
            required 
            placeholder="Tremblay" 
            defaultValue={initialData?.lastName}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Courriel professionnel</label>
        <input 
          name="email" 
          type="email" 
          className={inputStyle} 
          required 
          placeholder="jean.t@exemple.com" 
          defaultValue={initialData?.email}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelStyle}>NAS (Numéro d'assurance sociale)</label>
          <input 
            name="nasNumber" 
            type="text" 
            className={inputStyle} 
            required 
            placeholder="000-000-000" 
            defaultValue={initialData?.nasNumber}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelStyle}>Téléphone</label>
          <input 
            name="phone" 
            type="tel" 
            className={inputStyle} 
            required 
            placeholder="514-000-0000" 
            defaultValue={initialData?.phone}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Adresse de résidence</label>
        <input 
          name="address" 
          type="text" 
          className={inputStyle} 
          required 
          placeholder="123 rue de la Paix, Longueuil" 
          defaultValue={initialData?.address}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Statut du dossier</label>
        <select 
          name="status" 
          aria-label="status"
          className={inputStyle} 
          defaultValue={initialData?.status || "ACTIVE"}
        >
          <option value="ACTIVE">Actif (Dossier en cours)</option>
          <option value="INACTIVE">Inactif (Archives)</option>
        </select>
      </div>

      <div className="flex gap-3 pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-slate-900 text-white py-4 rounded-[1.5rem] font-bold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          {loading ? "Traitement..." : initialData ? "Mettre à jour" : "Confirmer l'ajout"}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="px-8 py-4 border border-slate-200 rounded-[1.5rem] text-slate-500 font-bold hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}