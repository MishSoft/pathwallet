// /lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// შენობა, რომელსაც JWT-ს დიკოდირებისას ველოდებით
interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyJWT(request: NextRequest) {
  // Cookie–დან token–ის მიღება
  const token = request.cookies.get("token")?.value;
  console.log("🔑 Received token:", token); // Debug: რა მიდის

  if (!token) {
    console.log("⛔ No token found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Token-ის დიკოდირება
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken;
    console.log("✅ Decoded JWT payload:", decoded); // Debug: თუ სწორია
    return decoded; // დაბრუნდება object { userId, email, iat, exp }
  } catch (err) {
    console.log("❌ JWT verification failed:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
