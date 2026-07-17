import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "messages";

export async function uploadMedia(file: File, folder: string) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) throw error;

  return path;
}

export async function deleteMedia(path: string) {
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}

export async function getSignedUrl(path: string, expiresIn = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("getSignedUrl error for", path, error);
    return null;
  }

  return data.signedUrl;
}
