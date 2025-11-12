/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../../lib/prisma";
import { sendVerificationEmail } from "../../../lib/mailer";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomInt(100000, 999999).toString();

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: false,
        verificationToken: verificationToken,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    return new Response(
      JSON.stringify({ message: "Verification email sent." }),
      { status: 200 }
    );
  } catch (err: any) {
    // აქ ჩაანაცვლე შენი catch block
    console.error("Register error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
