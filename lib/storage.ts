import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import { STORAGE_BUCKET as BUCKET } from "@/lib/validations/message";

export async function createSignedUploadPath(filename: string, folder: string) {
  const ext = filename.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error) throw error;

  return { path, token: data.token };
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
