import prisma  from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) return new NextResponse("Non autorisé", { status: 401 });

  const doc = await prisma.document.findUnique({
    where: { id, userId },
  });

  if (!doc || !doc.fileContent) {
    return new NextResponse("Fichier non trouvé", { status: 404 });
  }

  // On transforme le Buffer stocké en Uint8Array pour la réponse
  return new NextResponse(doc.fileContent, {
    headers: {
      "Content-Type": doc.type,
      "Content-Disposition": `attachment; filename="${doc.name}"`,
    },
  });
}