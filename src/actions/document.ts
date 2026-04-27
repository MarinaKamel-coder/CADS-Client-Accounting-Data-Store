"use server";

import prisma  from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function uploadDocumentAction(formData: FormData, clientId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const file = formData.get("file") as File;
  if (!file) return { error: "Aucun fichier trouvé" };

  try {

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const newDoc = await prisma.document.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        filePath: `database_stored/${file.name}`, 
        fileContent: buffer,
        clientId: clientId,
        userId: userId,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, docId: newDoc.id };
  } catch (error: any) {
    console.error("Erreur upload:", error);
    return { error: "Erreur lors de la sauvegarde du fichier." };
  }
}