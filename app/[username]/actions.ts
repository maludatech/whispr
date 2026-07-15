"use server";

import { prisma } from "@/lib/db";
import { uploadMedia } from "@/lib/storage";
import {
  TextMessageSchema,
  MEDIA_LIMITS,
  validateMediaFile,
  type MediaType,
} from "@/lib/validations/message";

export type SendMessageState =
  | {
      status: "error";
      message: string;
      retryAfterSeconds?: number;
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

export async function sendMediaMessage(
  type: MediaType,
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const username = formData.get("username");
  const file = formData.get("file");

  if (typeof username !== "string" || !username) {
    return { status: "error", message: "Missing link" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: `Attach ${type === "audio" ? "a" : "an"} ${type} file first` };
  }

  const fileError = validateMediaFile(type, file);
  if (fileError) {
    return { status: "error", message: fileError };
  }
  if (file.size > MEDIA_LIMITS[type].maxBytes) {
    return { status: "error", message: `Keep it under ${MEDIA_LIMITS[type].label}` };
  }

  const receiver = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!receiver) {
    return { status: "error", message: "This link doesn't exist anymore" };
  }

  let path: string;
  try {
    path = await uploadMedia(file, receiver.id);
  } catch {
    return { status: "error", message: "Upload failed, try again" };
  }

  await prisma.message.create({
    data: { receiverId: receiver.id, type, mediaUrl: path },
  });

  return { status: "success" };
}
