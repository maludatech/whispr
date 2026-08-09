"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteMedia } from "@/lib/storage";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function getLatestMessageInfo() {
  const session = await auth();
  if (!session) return { count: 0, latestId: null };

  const [count, latest] = await Promise.all([
    prisma.message.count({ where: { receiverId: session.user.id } }),
    prisma.message.findFirst({
      where: { receiverId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
  ]);

  return { count, latestId: latest?.id ?? null };
}

export async function deleteMessage(messageId: string) {
  const session = await auth();
  if (!session) return { error: "Not signed in" };

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { receiverId: true, attachments: { select: { mediaUrl: true } } },
  });

  if (!message || message.receiverId !== session.user.id) {
    return { error: "Message not found" };
  }

  await Promise.all(
    message.attachments.map((attachment) => deleteMedia(attachment.mediaUrl)),
  );

  await prisma.message.delete({ where: { id: messageId } });
  revalidatePath("/dashboard");

  return { success: true };
}
