/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/app/lib/prisma";
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

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: true, // დროებით true
      },
    });

    return new Response(
      JSON.stringify({ message: "User registered successfully." }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
