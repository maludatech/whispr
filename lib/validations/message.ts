import { z } from "zod";

export const TextMessageSchema = z.object({
  username: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(1, "Say something first")
    .max(500, "At most 500 characters"),
});
