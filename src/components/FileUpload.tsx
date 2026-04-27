"use client";

import { useState } from "react";
import { uploadDocumentAction } from "../actions/document";

export default function FileUpload({ clientId }: { clientId: string }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadDocumentAction(formData, clientId);

    if (result.success) {
      alert("Fichier enregistré dans la base de données !");
    } else {
      alert(result.error);
    }
    setUploading(false);
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-blue-500">📄</span> Ajouter un document (PDF/Image)
      </h3>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-100 rounded-xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all">
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl mb-1">{uploading ? "⏳" : "📤"}</span>
          <p className="text-sm font-semibold text-blue-600">
            {uploading ? "Transfert vers Neon..." : "Cliquez pour téléverser"}
          </p>
        </div>
        <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
      </label>
    </div>
  );
}