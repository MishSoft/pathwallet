// /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { loginSchema } from "../../../lib/validation";

export async function POST(request: NextRequest) {
  console.log("SERVER DB URL:", process.env.DATABASE_URL);
  try {
    // 1️⃣ მიღებული მონაცემების ვალიდაცია Zod-ით
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 2️⃣ მომხმარებლის მოძებნა ბაზაში
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 3️⃣ პაროლის შედარება
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 4️⃣ JWT Token შექმნა
    const secretKey = process.env.JWT_SECRET_KEY || "-?vnj4mn!8=azk%";
    if (!secretKey) {
      return NextResponse.json(
        { error: "Server configuration error: JWT secret key is not defined." },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    // 5️⃣ პასუხის შექმნა და Cookie–ში token შენახვა
    const response = NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // JS–ს ვერ წაიკითხავს
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 საათი
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
