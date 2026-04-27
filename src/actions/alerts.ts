"use server";

import prisma from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Récupère le nombre d'échéances urgentes (dans les 30 prochains jours)
 * Utilisé principalement pour le badge de la Sidebar.
 */
export async function getAlertsCountAction() {
  const { userId } = await auth();
  if (!userId) return 0;

  const today = new Date();
  const oneweekLater = new Date();
  oneweekLater.setDate(today.getDate() + 7);

  try {
    const count = await prisma.deadline.count({
      where: {
        userId: userId,
        status: "PENDING",
        dueDate: {
          lte: oneweekLater,
          gte: today, 
        },
      },
    });
    return count;
  } catch (error) {
    console.error("Erreur lors du comptage des alertes:", error);
    return 0;
  }
}


export async function getDetailedAlertsAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  try {
    const alerts = await prisma.deadline.findMany({
      where: {
        userId: userId,
        dueDate: {
          lte: thirtyDaysLater,
          gte: today,
        },
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc", 
      },
    });

    return { success: true, data: alerts };
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes détaillées:", error);
    return { success: false, error: "Impossible de récupérer les alertes." };
  }
}
export async function completeDeadlineAction(deadlineId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  try {
    await prisma.deadline.update({
      where: { id: deadlineId, userId: userId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath(`/dashboard/client/${deadlineId}`); // Pour rafraîchir la page client
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la validation de l'échéance." };
  }
}

/**
 * ARCHIVER (DÉSACTIVER)
 * Utilise le statut INACTIVE de ton enum pour masquer l'alerte sans la supprimer.
 */
export async function archiveDeadlineAction(deadlineId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  try {
    await prisma.deadline.update({
      where: { id: deadlineId, userId: userId },
      data: { status: "INACTIVE" },
    });

    revalidatePath("/dashboard/alerts");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de l'archivage." };
  }
}

/**
 * SUPPRIMER DÉFINITIVEMENT
 */
export async function deleteDeadlineAction(deadlineId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  try {
    await prisma.deadline.delete({
      where: { id: deadlineId, userId: userId },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression définitive." };
  }
}

export async function dismissAlertAction(deadlineId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  try {
    await prisma.deadline.delete({
      where: {
        id: deadlineId,
        userId: userId,
      },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression de l'échéance." };
  }
}