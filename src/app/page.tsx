"use client";

import Link from "next/link";
import { useUser} from "@clerk/nextjs";

import {ShieldCheck, FileSearch, Calendar, ArrowUpRight, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";


export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  return (
<div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      
      {/* Background System (Image / Overlay) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/bg-cads.jpg" 
          alt="CADS"
          className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-[#020617]/80 to-[#020617]" />
      </div>

      <main className="relative z-10">
        <section className="pt-32 pb-40 md:pt-48 md:pb-60">
          <div className="max-w-7xl mx-auto px-6 text-center">

            {/* UTILISATION DE LA CLASSE LOGO NÉON */}
            <h1 className="logo-cads-neon mb-6 animate-in fade-in slide-in-from-top-10 duration-1000">
              CADS
            </h1>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Solutions de Comptabilité <br /> et Gestion Fiscale
              </h2>
              <p className="text-lg md:text-xl text-blue-200/50 max-w-2xl mx-auto font-medium">
                Optimise vos finances. Simplifie la conformité.
              </p>
            </div>
            
            <div className="mt-16 flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              {/* UTILISATION DE LA CLASSE BOUTON NÉON */}
              <Link href="/dashboard" className="btn-neon-blue group">
                Se Connecter / S'inscrire
                <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

        {/* SECTION FEATURES - Style Bento-Grid Sombre / Navy */}
        <section id="features" className="py-32  backdrop-blur-sm ">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div className="text-left">
                <h2 className="text-sm font-black text-[#38bdf8] uppercase tracking-[0.4em] mb-4">L'Écosystème</h2>
                <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">Une gestion sans compromis</p>
              </div>
              <p className="text-blue-100/40 text-sm max-w-sm text-left md:text-right font-medium">
                Conçu pour les cabinets comptables et les entrepreneurs exigeants du Québec.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte Feature */}
              <Feature 
                icon={<ShieldCheck className="w-9 h-9 text-[#38bdf8]" />} 
                title="Conformité Totale" 
                desc="Protection de niveau bancaire AES-256 pour les NAS et données confidentielles." 
              />
              <Feature 
                icon={<FileSearch className="w-9 h-9 text-[#38bdf8]" />} 
                title="Accès Instantané" 
                desc="Recherche ultra-rapide par nom, entreprise ou courriel pour un suivi client optimal." 
              />
              <Feature 
                icon={<Calendar className="w-9 h-9 text-[#38bdf8]" />} 
                title="Calendrier Fiscal" 
                desc="Suivi automatisé des obligations gouvernementales (T1, TP1) en temps réel." 
              />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

/**
 * Sous-composant Feature
 */
function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-12 rounded-[3.5rem] bg-[#0d1117]/50 border border-white/5 hover:border-blue-500/30 hover:bg-[#0d1117] transition-all duration-500 group relative overflow-hidden">
      {/* Effet de lueur au survol */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem]" />
      
      {/* Icône Conteneur */}
      <div className="w-20 h-20 bg-[#020617] border border-white/10 rounded-3xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-105 group-hover:border-[#38bdf8]/30 transition-all">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        {title} 
        <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#38bdf8]" />
      </h3>
      
      <p className="text-blue-100/50 leading-relaxed text-base font-medium">
        {desc}
      </p>
    </div>
  );
}