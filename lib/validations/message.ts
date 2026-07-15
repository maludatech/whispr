import { z } from "zod";

export const MEDIA_LIMITS = {
  image: { maxBytes: 10 * 1024 * 1024, label: "10MB", mimePrefix: "image/" },
  audio: { maxBytes: 20 * 1024 * 1024, label: "20MB", mimePrefix: "audio/" },
  video: { maxBytes: 50 * 1024 * 1024, label: "50MB", mimePrefix: "video/" },
} as const;

export type MediaType = keyof typeof MEDIA_LIMITS;

export function validateMediaFile(type: MediaType, file: File) {
  const limit = MEDIA_LIMITS[type];
  if (!file.type.startsWith(limit.mimePrefix)) {
    return `That doesn't look like a${type === "audio" ? "n" : ""} ${type} file`;
  }
  if (file.size > limit.maxBytes) {
    return `Keep it under ${limit.label}`;
  }
  return null;
}

export const TextMessageSchema = z.object({
  username: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(1, "Say something first")
    .max(500, "At most 500 characters"),
});
