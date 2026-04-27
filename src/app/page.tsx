"use client";

import Link from "next/link";
import Header from "../components/Header"; 
import { ArrowRight, ShieldCheck, FileSearch, Calendar, CheckCircle, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <Header />

      <main>
        {/* Section Hero - Ajout d'un badge et d'un dégradé de fond */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Décoration d'arrière-plan */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">

            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Simplifiez votre <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                comptabilité.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
              CADS centralise vos clients, sécurise vos documents fiscaux et automatise le suivi de vos obligations légales en un seul endroit.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                Démarrer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="#features" 
                className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>

        {/* Section Bento-Grid style pour les Features */}
        <section id="features" className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Fonctionnalités</h2>
              <p className="text-3xl md:text-4xl font-bold text-slate-900">Tout ce dont vous avez besoin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Feature 
                icon={<ShieldCheck className="w-8 h-8 text-blue-600" />} 
                title="Sécurité Bancaire" 
                desc="Chiffrement AES-256 pour vos documents et authentification biométrique via Clerk." 
              />
              <Feature 
                icon={<FileSearch className="w-8 h-8 text-indigo-600" />} 
                title="Recherche Instantanée" 
                desc="Accédez aux dossiers clients par nom, courriel ou NAS en moins de 300ms." 
              />
              <Feature 
                icon={<Calendar className="w-8 h-8 text-blue-500" />} 
                title="Alertes Intelligentes" 
                desc="Notifications automatiques pour les dates limites de la TP1 et T1 au Québec." 
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        {title} 
        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
      </h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}