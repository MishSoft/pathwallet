import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db"; // ჩვენი Neon SQL კლიენტი
import { loginSchema } from "@/app/lib/validation";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ მონაცემების ვალიდაცია Zod-ით
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 2️⃣ მომხმარებლის მოძებნა ბაზაში SQL-ით
    const users = await sql`
      SELECT id, email, password FROM users WHERE email = ${email} LIMIT 1
    `;

    const user = users[0]; // რადგან sql ბრძანება ყოველთვის მასივს აბრუნებს

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

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      { expiresIn: "1h" }
    );

    // 5️⃣ პასუხი და Cookie-ში შენახვა
    const response = NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
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
