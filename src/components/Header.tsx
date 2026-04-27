"use client";

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import GlobalSearch from "./GlobalSearch";
import Link from "next/link";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();

  // On attend que Clerk soit chargé pour éviter le "flicker" (clignotement)
  if (!isLoaded) return <header className="h-16 border-b bg-white" />;

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-blue-600">
                CADS<span className="text-slate-300">.</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            {isSignedIn ? (
              /* Équivalent de <SignedIn> */
              <>
                <div className="w-full max-w-sm hidden md:block">
                  <GlobalSearch />
                </div>
                <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                  <UserButton />
                </div>
              </>
            ) : (
              /* Équivalent de <SignedOut> */
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2">
                    Connexion
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 text-white rounded-xl font-bold text-sm h-10 px-5 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    S'inscrire
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}