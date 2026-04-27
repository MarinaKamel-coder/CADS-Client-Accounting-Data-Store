import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const { userId } = await auth();

  if (!userId || !query) return NextResponse.json([]);

  const clients = await prisma.client.findMany({
    where: {
      userId: userId,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { nasNumber: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 5, // On limite à 5 résultats pour la rapidité
  });

  return NextResponse.json(clients);
}