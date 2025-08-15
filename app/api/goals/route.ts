import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ახალი მიზნის დამატება
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { title, targetAmount } = await request.json();

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: "Title and targetAmount are required." },
        { status: 400 }
      );
    }

    const newGoal = await prisma.financialGoal.create({
      data: {
        title,
        targetAmount: Number(targetAmount),
        userId: payload.userId as string,
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error("Failed to add goal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ყველა მიზნის წამოღება
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const goals = await prisma.financialGoal.findMany({
      where: {
        userId: payload.userId as string,
      },
      orderBy: {
        createdAt: "desc", // ეს ხაზი მუშაობს მხოლოდ მას შემდეგ, რაც მიგრაციას გაუშვებთ
      },
    });

    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    console.error("Failed to get goals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// მიზნის წაშლა
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Goal ID is required." },
        { status: 400 }
      );
    }

    const deletedGoal = await prisma.financialGoal.delete({
      where: {
        id,
        userId: payload.userId as string,
      },
    });

    return NextResponse.json(deletedGoal, { status: 200 });
  } catch (error) {
    console.error("Failed to delete goal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
