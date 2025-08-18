// /app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// მომხმარებლის მონაცემების წამოღება
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// პროფილის განახლება
export async function PUT(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { name, email } = await request.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { name, email },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// პაროლის შეცვლა
export async function PATCH(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { currentPassword, newPassword } = await request.json();
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid current password." },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ანგარიშის წაშლა
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const userId = payload.userId;

    // ყველა დამოკიდებული მონაცემის წაშლა
    await prisma.income.deleteMany({ where: { userId } });
    await prisma.expense.deleteMany({ where: { userId } });
    await prisma.financialGoal.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    // Cookie-ის გასუფთავება
    const response = NextResponse.json(
      { message: "Account successfully deleted." },
      { status: 200 }
    );
    response.cookies.set("token", "", { path: "/", expires: new Date(0) });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
