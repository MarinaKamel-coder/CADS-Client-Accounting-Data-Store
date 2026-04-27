import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>
      
      <main className="flex-1 ml-64 min-h-screen">
        {/* max-w-7xl centre le contenu proprement */}
        <div className="max-w-7xl mx-auto p-8 2xl:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}