import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { JWTPayload } from "jose";

const prisma = new PrismaClient();

// ჩვენი საკუთარი payload ტიპი
type MyJWTPayload = JWTPayload & { userId: string };

// ახალი მიზნის დამატება
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload; // აქ უკვე error response
  }

  // ვაკონვერტებთ ჩვენს custom ტიპზე
  const userPayload = payload as unknown as MyJWTPayload;

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
        userId: userPayload.userId, // აქ typescript-ი აღარ წუწუნებს
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

  const userPayload = payload as unknown as MyJWTPayload;

  try {
    const goals = await prisma.financialGoal.findMany({
      where: { userId: userPayload.userId },
    });

    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
