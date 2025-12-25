import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";

// ინტერფეისი ფინანსური მიზნისთვის
interface FinancialGoalRow {
  id: string;
  user_id: string;
  saved_amount: number;
  target_amount: number;
}

export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  // თუ JWT ვალიდური არ არის, verifyJWT დააბრუნებს NextResponse-ს ერორით
  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { goalId, amount }: { goalId: string; amount: number } = await request.json();

    if (!goalId || !amount) {
      return NextResponse.json(
        { error: "Goal ID and amount are required." },
        { status: 400 }
      );
    }

    // 1. ვამოწმებთ, არსებობს თუ არა ეს მიზანი და ეკუთვნის თუ არა ამ იუზერს
    const goals = await sql`
      SELECT id, user_id, saved_amount, target_amount
      FROM financial_goals
      WHERE id = ${goalId} LIMIT 1
    ` as FinancialGoalRow[];

    const goal = goals[0];

    if (!goal || goal.user_id !== payload.userId) {
      return NextResponse.json(
        { error: "Goal not found or unauthorized." },
        { status: 404 }
      );
    }

    // 2. ვანახლებთ თანხას SQL-ის საშუალებით
    // RETURNING * დაგვიბრუნებს განახლებულ ობიექტს პირდაპირ
    const updatedGoals = await sql`
      UPDATE financial_goals
      SET saved_amount = saved_amount + ${Number(amount)}
      WHERE id = ${goalId}
      RETURNING *
    ` as FinancialGoalRow[];

    return NextResponse.json(updatedGoals[0], { status: 200 });

  } catch (error) {
    console.error("Failed to add savings:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
