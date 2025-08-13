/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtVerify, JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

// JWT_SECRET_KEY შეცვალეთ თქვენი უნიკალური გასაღებით
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function verifyJWT(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token is missing." },
      { status: 401 }
    );
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );
    return verified.payload;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 401 }
    );
  }
}
