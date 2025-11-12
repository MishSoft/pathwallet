/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"; // გამოიყენეთ NextResponse Next.js-ის გარემოსთვის

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    // 1. მომხმარებლის არსებობის შემოწმება
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    // 2. პაროლის დაჰეშირება
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. მომხმარებლის შექმნა ბაზაში
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: true, // ✅ ავტომატურად ვერიფიცირებულია
        // ამოღებულია: verificationToken და verificationTokenExpires
      },
    });

    // 4. წარმატებული პასუხი
    return NextResponse.json(
      { message: "Registration successful. User automatically verified." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
