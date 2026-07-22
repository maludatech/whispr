"use server";

import { prisma } from "@/lib/db";
import { uploadMedia } from "@/lib/storage";
import { classifyTopic } from "@/lib/groq";
import {
  MEDIA_LIMITS,
  MAX_ATTACHMENTS,
  MAX_CONTENT_LENGTH,
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

function collectFiles(formData: FormData, field: string) {
  return formData.getAll(field).filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function sendMessage(
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const username = formData.get("username");
  if (typeof username !== "string" || !username) {
    return { status: "error", message: "Missing link" };
  }

  const rawContent = formData.get("content");
  const content = typeof rawContent === "string" ? rawContent.trim() : "";
  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: "error", message: `At most ${MAX_CONTENT_LENGTH} characters` };
  }

  const images = collectFiles(formData, "images");
  const videos = collectFiles(formData, "videos");
  const audioFiles = collectFiles(formData, "audio");
  const audio = audioFiles[0] ?? null;

  const files: { type: MediaType; file: File }[] = [
    ...images.map((file) => ({ type: "image" as const, file })),
    ...videos.map((file) => ({ type: "video" as const, file })),
    ...(audio ? [{ type: "audio" as const, file: audio }] : []),
  ];

  if (!content && files.length === 0) {
    return { status: "error", message: "Say something or attach a file first" };
  }

  if (files.length > MAX_ATTACHMENTS) {
    return { status: "error", message: `Attach up to ${MAX_ATTACHMENTS} files` };
  }

  for (const { type, file } of files) {
    const fileError = validateMediaFile(type, file);
    if (fileError) return { status: "error", message: fileError };
    if (file.size > MEDIA_LIMITS[type].maxBytes) {
      return { status: "error", message: `Keep each ${type} under ${MEDIA_LIMITS[type].label}` };
    }
  }

  const receiver = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!receiver) {
    return { status: "error", message: "This link doesn't exist anymore" };
  }

  let uploaded: { type: MediaType; mediaUrl: string }[];
  try {
    uploaded = await Promise.all(
      files.map(async ({ type, file }) => ({
        type,
        mediaUrl: await uploadMedia(file, receiver.id),
      })),
    );
  } catch {
    return { status: "error", message: "Upload failed, try again" };
  }

  const topic = content ? await classifyTopic(content) : "Media";

  await prisma.message.create({
    data: {
      receiverId: receiver.id,
      content: content || null,
      topic,
      attachments: { create: uploaded },
    },
  });

  return { status: "success" };
}
