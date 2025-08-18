// /app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Cookie-ს წაშლა
  const response = NextResponse.json({ message: "Logged out successfully." });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // აბრუნებს cookie-ს ვადის ამოწურვას → წაშლის მას
    path: "/",
  });

  return response;
}
