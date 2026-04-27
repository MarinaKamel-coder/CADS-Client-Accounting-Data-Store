"use client";

export default function DocumentList({ documents }: { documents: any[] }) {
  if (documents.length === 0) return (
    <p className="text-sm text-slate-400 italic mt-4">Aucun document pour le moment.</p>
  );

  return (
    <div className="mt-6 space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-semibold text-slate-700">{doc.name}</p>
              <p className="text-xs text-slate-400">{(doc.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          
          <a 
            href={`/api/documents/${doc.id}`} 
            download
            className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
            title="Télécharger"
          >
            📥
          </a>
        </div>
      ))}
    </div>
  );
}