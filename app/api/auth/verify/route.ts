import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, code }: { email: string; code: string } = await request.json();

    // ვეძებთ იუზერს SQL-ით
    const users = await sql`
      SELECT id FROM users
      WHERE email = ${email} AND verification_token = ${code}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // ვუცვლით სტატუსს
    await sql`
      UPDATE users
      SET is_verified = true, verification_token = NULL
      WHERE email = ${email}
    `;

    return NextResponse.json({ message: "Verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
