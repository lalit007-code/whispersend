import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
        pass: process.env.NEXT_PUBLIC_PERSONAL_PASSWORD,
      },
    });

    const emailHtml = await render(
      VerificationEmail({
        username,
        otp: verifyCode,
      })
    );

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
      to: email,
      subject: "Feedback Hub | Verification code",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
