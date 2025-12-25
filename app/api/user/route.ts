import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth"; // დარწმუნდი რომ გზა სწორია
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

// 1. იუზერის მონაცემების წამოღება (GET)
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const users = await sql`SELECT name, email FROM users WHERE id = ${payload.userId}`;
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// 2. პროფილის განახლება (PUT)
export async function PUT(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { name, email } = await request.json();

    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({ message: "Profile updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 3. პაროლის შეცვლა (PATCH)
export async function PATCH(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { currentPassword, newPassword } = await request.json();

    const users = await sql`SELECT password FROM users WHERE id = ${payload.userId}`;
    const user = users[0];

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "ძველი პაროლი არასწორია" }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashedNewPassword} WHERE id = ${payload.userId}`;

    return NextResponse.json({ message: "Password changed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Patch failed" }, { status: 500 });
  }
}

// 4. ანგარიშის წაშლა (DELETE) - შესწორებული ლოგიკა
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    // 1. ჯერ ვშლით იუზერს ბაზიდან
    await sql`DELETE FROM users WHERE id = ${payload.userId}`;

    // 2. ვქმნით NextResponse-ს, რომელშიც ჩავაყოლებთ ქუქის წაშლის ბრძანებას
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );

    // 3. სესიის ქუქის (token) წაშლა სერვერული მხარიდან
    response.cookies.set("token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return response;
  } catch (error) {
    console.error("Account Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
