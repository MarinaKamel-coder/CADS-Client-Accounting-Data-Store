import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. On définit quelles routes sont protégées
// (.*) permet de protéger /dashboard mais aussi /dashboard/clients, /dashboard/settings, etc.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 2. Si la route actuelle correspond à une route protégée...
  if (isProtectedRoute(req)) {
    // 3. On force l'authentification. 
    // Si l'utilisateur n'est pas connecté, il est redirigé vers le Sign-in.
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // On garde ton matcher par défaut qui est très bien configuré
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};