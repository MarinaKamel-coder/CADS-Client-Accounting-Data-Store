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
          
          <footer className="py-8 text-center text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} CADS - Logiciel de Gestion Comptable
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}