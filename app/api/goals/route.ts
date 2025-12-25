import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";
import { JWTPayload } from "jose";

// ჩვენი საკუთარი payload ტიპი
type MyJWTPayload = JWTPayload & { userId: string };

interface GoalRow {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  user_id: string;
  created_at: Date;
}

// 1️⃣ ახალი მიზნის დამატება (POST)
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  const userPayload = payload as unknown as MyJWTPayload;

  try {
    const { title, targetAmount }: { title: string; targetAmount: number } = await request.json();

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: "Title and targetAmount are required." },
        { status: 400 }
      );
    }

    const newGoals = await sql`
      INSERT INTO financial_goals (title, target_amount, user_id)
      VALUES (${title}, ${Number(targetAmount)}, ${userPayload.userId})
      RETURNING *
    ` as GoalRow[];

    return NextResponse.json(newGoals[0], { status: 201 });
  } catch (error) {
    console.error("Failed to add goal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2️⃣ ყველა მიზნის წამოღება (GET)
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  const userPayload = payload as unknown as MyJWTPayload;

  try {
    const goals = await sql`
      SELECT id, title, target_amount, saved_amount, created_at
      FROM financial_goals
      WHERE user_id = ${userPayload.userId}
      ORDER BY created_at DESC
    ` as GoalRow[];

    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
