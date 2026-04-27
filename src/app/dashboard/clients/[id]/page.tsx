import prisma from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import ClientDetailClient from "./ClientDetailClient";
import { decrypt } from "../../../../lib/encryption"; // 1. Importe ta fonction decrypt

export default async function ClientDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ tab?: string }> 
}) {
  const { userId } = await auth();
  const { id } = await params;
  const { tab } = await searchParams;

  if (!id) return notFound();

  const client = await prisma.client.findUnique({
    where: { id: id, userId: userId! },
    include: {
      documents: { orderBy: { uploadedAt: 'desc' } },
      deadlines: { orderBy: { dueDate: 'asc' }, include: { client: true } },
      _count: { select: { documents: true, deadlines: true } }
    }
  });

  if (!client) return notFound();

  // 2. Déchiffre le NAS ici côté serveur
  let decryptedNas = "Erreur de déchiffrement";
  try {
    decryptedNas = decrypt(client.nasNumber);
  } catch (error) {
    console.error("Échec du déchiffrement du NAS pour le client:", id);
  }

  // 3. Prépare l'objet client avec le NAS déchiffré
  const clientWithDecryptedData = {
    ...client,
    nasNumber: decryptedNas
  };

  // 4. Envoie l'objet modifié au composant client
  return <ClientDetailClient client={clientWithDecryptedData} activeTab={tab || "infos"} />;
}