import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { goalId, amount } = await request.json();

    if (!goalId || !amount) {
      return NextResponse.json(
        { error: "Goal ID and amount are required." },
        { status: 400 }
      );
    }

    const goal = await prisma.financialGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal || goal.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Goal not found or unauthorized." },
        { status: 404 }
      );
    }

    const updatedGoal = await prisma.financialGoal.update({
      where: { id: goalId },
      data: {
        savedAmount: {
          increment: Number(amount), // დამატება არსებულ თანხაზე
        },
      },
    });

    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    console.error("Failed to add savings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
