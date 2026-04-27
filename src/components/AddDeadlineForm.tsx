"use client";

import { useState } from "react";
import { createDeadlineAction } from "../actions/deadline";
import { Plus, X, CalendarDays, AlertCircle } from "lucide-react";

export default function AddDeadlineForm({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // On capture la référence du formulaire AVANT le await
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const result = await createDeadlineAction(formData, clientId);
    
    if (result.success) {
      setIsOpen(false);
      form.reset(); // Fonctionne maintenant car 'form' n'est pas nul
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      {/* BOUTON D'OUVERTURE - Style Dash-border cohérent */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group"
      >
        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
        Ajouter une échéance
      </button>

      {/* MODALE */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            
            {/* Bouton Fermer */}
            <button 
              type="button"
              title="fermButton"
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Nouvelle Échéance
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre de l'obligation</label>
                <input 
                  name="title" 
                  placeholder="ex: Déclaration TPS/TVQ" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date limite</label>
                  <input 
                    name="dueDate" 
                    type="date" 
                    aria-label="dueDate"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Palier</label>
                  <select 
                    name="type" 
                    aria-label="type"
                    defaultValue="FEDERAL" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                  >
                    <option value="FEDERAL">Fédéral</option>
                    <option value="PROVINCIAL">Provincial</option>
                    <option value="MUNICIPAL">Municipal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Priorité</label>
                <div className="relative">
                  <select 
                    name="priority" 
                    defaultValue="MEDIUM"
                    aria-label="priority"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute (Critique)</option>
                  </select>
                  <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-4 px-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-4 px-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 active:scale-95"
                >
                  {loading ? "Création..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}