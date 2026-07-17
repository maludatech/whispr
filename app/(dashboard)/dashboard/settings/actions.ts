"use server";

import bcrypt from "bcryptjs";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UpdateProfileSchema, ChangePasswordSchema } from "@/lib/validations/auth";

export type ProfileState =
  | {
      errors?: { username?: string[]; email?: string[] };
      message?: string;
    }
  | undefined;

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await auth();
  if (!session) return { message: "Not signed in" };

  const validatedFields = UpdateProfileSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, email } = validatedFields.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }], NOT: { id: session.user.id } },
    select: { username: true, email: true },
  });

  if (existing) {
    return {
      errors: {
        username: existing.username === username ? ["Username is taken"] : undefined,
        email: existing.email === email ? ["Email is already registered"] : undefined,
      },
    };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username, email },
  });

  await signOut({ redirectTo: "/login" });
}

export type PasswordState =
  | {
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export async function changePassword(
  _prevState: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await auth();
  if (!session) return { message: "Not signed in" };

  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user) return { message: "Not signed in" };

  const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordsMatch) {
    return { errors: { currentPassword: ["Incorrect password"] } };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  await signOut({ redirectTo: "/login" });
}
