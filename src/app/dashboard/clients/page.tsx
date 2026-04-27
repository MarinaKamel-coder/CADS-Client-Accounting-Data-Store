import prisma from "../../../lib/prisma";
import ClientsClientPage from "./ClientsClientPage";
import { auth } from "@clerk/nextjs/server";

export default async function ClientsPage() {
  const { userId } = await auth();

  // Récupération sécurisée par userId
  const clients = await prisma.client.findMany({
    where: { userId: userId! },
    orderBy: { lastName: "asc" },
    include: {
      _count: {
        select: { documents: true, deadlines: true }
      }
    }
  });

  return <ClientsClientPage initialClients={clients} />;
}