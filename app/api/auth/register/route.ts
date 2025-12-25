/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "@/lib/db"; // ჩვენი ახალი ბაზის კლიენტი
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    // 1. მომხმარებლის არსებობის შემოწმება SQL-ით
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    // 2. პაროლის დაჰეშირება
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. მომხმარებლის შექმნა ბაზაში (is_verified პირდაპირ true)
    await sql`
      INSERT INTO users (email, name, password, is_verified)
      VALUES (${email}, ${name}, ${hashedPassword}, true)
    `;

    // 4. წარმატებული პასუხი
    return NextResponse.json(
      { message: "Registration successful. User automatically verified." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
