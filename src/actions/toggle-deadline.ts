"use server";

import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleDeadlineAction(id: string, currentStatus: string) {
  const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
  
  await prisma.deadline.update({
    where: { id },
    data: { status: newStatus }
  });

  revalidatePath("/dashboard/deadlines");
  revalidatePath("/dashboard/clients/[id]", "page");
}