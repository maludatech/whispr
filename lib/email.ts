import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Whispr <whispr@driftfund.net>";

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Whispr password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="font-size: 20px; margin-bottom: 8px;">Reset your password</h1>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Someone requested a password reset for your Whispr account. If this was you, click below to choose a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 14px;">
          Reset password
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("sendPasswordResetEmail failed:", error);
  }
}
