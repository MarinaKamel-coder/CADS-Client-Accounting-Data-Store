"use server";

import prisma from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createDeadlineAction(formData: FormData, clientId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

try {
    const deadline = await prisma.deadline.create({
      data: {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || "",
        dueDate: new Date(formData.get("dueDate") as string),
        priority: formData.get("priority") as any,
        type: formData.get("type") as any,
        status: "PENDING",
        
        // C'EST ICI QUE ÇA CHANGE 🛡️
        // Au lieu de clientId: clientId, on utilise "connect"
        client: {
          connect: { id: clientId }
        },
        
        // Fais la même chose pour l'utilisateur si ton schéma le demande :
        user: {
          connect: { id: userId }
        }
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la création." };
  }
}