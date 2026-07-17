"use server";

import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { ForgotPasswordSchema } from "@/lib/validations/auth";

export type ForgotPasswordState =
  | {
      errors?: { email?: string[] };
      message?: string;
    }
  | { status: "sent" }
  | undefined;

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email } = validatedFields.data;

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
  }

  // Always report success, whether or not the email exists — avoids leaking
  // which emails are registered.
  return { status: "sent" };
}
