import prisma from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import DashboardClient from "../../components/DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const clients = await prisma.client.findMany({
    where: { userId },
    include: { _count: { select: { documents: true, deadlines: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full">
      <DashboardClient initialClients={clients} />
    </div>
  );
}