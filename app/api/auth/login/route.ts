import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Server configuration error: JWT secret key is not defined." },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { token, message: "Login successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
