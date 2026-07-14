"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validations/auth";

export type RegisterState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, email, password } = validatedFields.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
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

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    return { message: "Account created, but sign-in failed. Try logging in." };
  }

  redirect("/dashboard");
}
