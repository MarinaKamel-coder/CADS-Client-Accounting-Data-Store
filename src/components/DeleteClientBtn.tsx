"use client";

import { useState } from "react";
import { deleteClientAction } from "../actions/client";

export default function DeleteClientBtn({ clientId, clientName }: { clientId: string, clientName: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteClientAction(clientId);
    if (result?.error) {
      alert(result.error);
      setLoading(false);
      setIsConfirming(false);
    }
    // Si succès, revalidatePath rafraîchit la page automatiquement
  };

  // État initial : Affiche juste l'icône de poubelle
  if (!isConfirming) {
    return (
      <button 
        onClick={() => setIsConfirming(true)}
        className="text-slate-400 hover:text-red-600 transition-colors p-2"
        title="Supprimer"
      >
        <span>🗑️</span>
      </button>
    );
  }

  // État de confirmation : Affiche "Oui / Non"
  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
      <span className="text-xs font-medium text-red-600">Supprimer {clientName} ?</span>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "..." : "Oui"}
      </button>
      <button 
        onClick={() => setIsConfirming(false)}
        className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
      >
        Annuler
      </button>
    </div>
  );
}