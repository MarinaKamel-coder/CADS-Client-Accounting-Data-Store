import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs' 
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CADS - Client Accounting Data Store',
  description: 'Gestion intelligente des documents et échéances comptables',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
          {/* On ne met plus de <main max-w-7xl> ici */}
          {children}
          
      {/* FOOTER CENTRÉ ET ÉPURÉ */}
      <footer className="relative  py-6 border-t border-white/5 bg-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          {/* Logo au centre */}
          <div className="mb-2">
            <span className="text-xl font-black tracking-tighter text-white">
              CADS<span className="text-[#38bdf8]">.</span>
            </span>
          </div>

          {/* Copyright au centre */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
            &copy; {new Date().getFullYear()} — Client Accounting Data Store
          </p>

          <div className="flex justify-center items-center gap-2 text-[10px] uppercase tracking-widest font-black text-emerald-500/80 mt-4">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Système Opérationnel
          </div>

        </div>
      </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}