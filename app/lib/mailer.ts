/* eslint-disable @typescript-eslint/no-explicit-any */
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (to: string, code: string) => {
  console.log("Preparing to send email...");
  console.log("TO:", to, "FROM:", process.env.EMAIL_USER, "CODE:", code);

  try {
    const msg = {
      to,
      from: process.env.EMAIL_USER!, // VERIFIED EMAIL
      subject: "Verify your email",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };
    const result = await sgMail.send(msg);
    console.log("SendGrid result:", result);
  } catch (error: any) {
    console.error("SendGrid error full:", error);
    console.error("SendGrid error body:", error.response?.body);
    throw new Error("Could not send verification email.");
  }
};
