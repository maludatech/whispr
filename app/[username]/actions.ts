"use server";

import { prisma } from "@/lib/db";
import { TextMessageSchema } from "@/lib/validations/message";

export type SendMessageState =
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
    }
  | undefined;

export async function sendTextMessage(
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const validatedFields = TextMessageSchema.safeParse({
    username: formData.get("username"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: validatedFields.error.issues[0]?.message ?? "Invalid message",
    };
  }

  const { username, content } = validatedFields.data;

  const receiver = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!receiver) {
    return { status: "error", message: "This link doesn't exist anymore" };
  }

  await prisma.message.create({
    data: { receiverId: receiver.id, type: "text", content },
  });

  return { status: "success" };
}
