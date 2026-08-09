"use server";

import { prisma } from "@/lib/db";
import { createSignedUploadPath } from "@/lib/storage";
import { classifyTopic } from "@/lib/groq";
import {
  MEDIA_LIMITS,
  MAX_ATTACHMENTS,
  MAX_CONTENT_LENGTH,
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

export type SendMessageInput = {
  username: string;
  content: string;
  attachments: { type: MediaType; mediaUrl: string }[];
};

export async function sendMessage(
  _prevState: SendMessageState,
  input: SendMessageInput,
): Promise<SendMessageState> {
  const { username, attachments } = input;
  if (!username) {
    return { status: "error", message: "Missing link" };
  }

  const content = input.content.trim();
  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: "error", message: `At most ${MAX_CONTENT_LENGTH} characters` };
  }

  if (!content && attachments.length === 0) {
    return { status: "error", message: "Say something or attach a file first" };
  }

  if (attachments.length > MAX_ATTACHMENTS) {
    return { status: "error", message: `Attach up to ${MAX_ATTACHMENTS} files` };
  }

  const receiver = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!receiver) {
    return { status: "error", message: "This link doesn't exist anymore" };
  }

  const topic = content ? await classifyTopic(content) : "Media";

  await prisma.message.create({
    data: {
      receiverId: receiver.id,
      content: content || null,
      topic,
      attachments: { create: attachments },
    },
  });

  return { status: "success" };
}

export type UploadUrlResult =
  | { status: "error"; message: string }
  | { status: "success"; path: string; token: string };

export async function createUploadUrl(
  username: string,
  type: MediaType,
  file: { name: string; size: number; mimeType: string },
): Promise<UploadUrlResult> {
  if (!username) {
    return { status: "error", message: "Missing link" };
  }

  const limit = MEDIA_LIMITS[type];
  if (!file.mimeType.startsWith(limit.mimePrefix)) {
    return { status: "error", message: `That doesn't look like a${type === "audio" ? "n" : ""} ${type} file` };
  }
  if (file.size > limit.maxBytes) {
    return { status: "error", message: `Keep each ${type} under ${limit.label}` };
  }

  const receiver = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!receiver) {
    return { status: "error", message: "This link doesn't exist anymore" };
  }

  try {
    const { path, token } = await createSignedUploadPath(file.name, receiver.id);
    return { status: "success", path, token };
  } catch {
    return { status: "error", message: "Couldn't prepare upload, try again" };
  }
}
