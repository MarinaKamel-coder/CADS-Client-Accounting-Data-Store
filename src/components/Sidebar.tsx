"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, LayoutDashboard, Users, CalendarClock, ShieldCheck } from "lucide-react";
import { getAlertsCountAction } from "../actions/alerts";

// Définition de l'interface pour éviter l'erreur "count est peut-être non défini"
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  count?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [alertsCount, setAlertsCount] = useState<number>(0);

  // Récupération du nombre d'alertes en temps réel
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getAlertsCountAction();
        setAlertsCount(count);
      } catch (error) {
        console.error("Erreur Sidebar count:", error);
      }
    };

    fetchCount();
  }, [pathname]); // Se rafraîchit à chaque navigation

  const menuItems: MenuItem[] = [
    { 
        name: "Tableau de bord", 
        path: "/dashboard", 
        icon: <LayoutDashboard size={20} /> 
    },
    { 
        name: "Clients", 
        path: "/dashboard/clients", 
        icon: <Users size={20} /> 
    },
    { 
        name: "Obligations", 
        path: "/dashboard/deadlines", 
        icon: <CalendarClock size={20} /> 
    },
    { 
      name: "Alertes", 
      path: "/dashboard/alerts", 
      icon: <Bell size={20} />, 
      count: alertsCount 
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 fixed h-full flex flex-col p-6 shadow-2xl border-r border-slate-800">
      
      {/* LOGO & BRANDING */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/40">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight italic">
          CADS<span className="text-blue-500 font-normal">.</span>
        </h2>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          // Sécurité pour le badge : si count est undefined, on utilise 0
          const currentCount = item.count ?? 0;

          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "hover:bg-slate-800 hover:text-white"}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? "opacity-100 text-white" : "opacity-70 group-hover:opacity-100 group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm tracking-tight">
                  {item.name}
                </span>
              </div>

              {/* BADGE DYNAMIQUE */}
              {currentCount > 0 && (
                <span className={`
                  text-[10px] font-black px-2 py-0.5 rounded-lg animate-pulse
                  ${isActive ? "bg-blue-400 text-white" : "bg-red-500 text-white shadow-md shadow-red-900/40"}
                `}>
                  {currentCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE (FOOTER) */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center justify-start scale-105 origin-left bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
          <UserButton 
            showName 
            appearance={{
              elements: {
                userButtonBox: "flex-row-reverse gap-3 text-slate-200",
                userButtonOuterIdentifier: "text-slate-200 font-bold text-xs tracking-tight uppercase"
              }
            }} 
          />
        </div>
      </div>
    </aside>
  );
}