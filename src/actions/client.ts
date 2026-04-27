"use server"; 

import prisma from "../lib/prisma";
import { encrypt } from "../lib/encryption";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createClientAction(data: any) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return { error: "Veuillez vous reconnecter." };

  try {
    // Synchronisation de l'utilisateur
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || "Prénom",
        lastName: user.lastName || "Nom",
      },
    });

    // Création du client 
    const newClient = await prisma.client.create({
      data: {
        clientType: data.clientType, 
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        nasNumber: encrypt(data.nasNumber),
        phone: data.phone,
        address: data.address,
        status: data.status, 
        // Si c'est une entreprise, on garde le nom, sinon null
        companyName: data.clientType === "BUSINESS" ? data.companyName : null,
        userId: userId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur Prisma Create:", error);
    if (error.code === 'P2002') {
      return { error: "Erreur : Un client possède déjà ce courriel ou ce NAS." };
    }
    return { error: "Impossible de créer le client pour le moment." };
  }
}

export async function updateClientAction(clientId: string, data: any) {
  const { userId } = await auth();
  if (!userId) return { error: "Veuillez vous reconnecter." };

  try {
    await prisma.client.update({
      where: { 
        id: clientId,
        userId: userId 
      },
      data: {
        clientType: data.clientType,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        nasNumber: encrypt(data.nasNumber),
        phone: data.phone,
        address: data.address,
        status: data.status,
        // Mise à jour logique du nom d'entreprise
        companyName: data.clientType === "BUSINESS" ? data.companyName : null,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur Update Prisma:", error);
    return { error: "Impossible de modifier le client." };
  }
}

export async function deleteClientAction(clientId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  try {
    await prisma.client.delete({
      where: {
        id: clientId,
        userId: userId,
      },
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur Delete Prisma:", error);
    return { error: "Erreur lors de la suppression du client." };
  }
}