import { createClient } from "@supabase/supabase-js";
import { createUploadUrl } from "@/app/[username]/actions";
import { STORAGE_BUCKET, type MediaType } from "@/lib/validations/message";

const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadAttachment(username: string, type: MediaType, file: File) {
  const signed = await createUploadUrl(username, type, {
    name: file.name,
    size: file.size,
    mimeType: file.type,
  });

  if (signed.status === "error") {
    throw new Error(signed.message);
  }

  const { error } = await supabaseBrowser.storage
    .from(STORAGE_BUCKET)
    .uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type });

  if (error) {
    throw new Error("Upload failed, try again");
  }

  return { type, mediaUrl: signed.path };
}
