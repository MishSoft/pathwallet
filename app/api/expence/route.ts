import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";

// ინტერფეისი ხარჯისთვის
interface ExpenseRow {
  id: string;
  amount: number;
  category: string;
  user_id: string;
  date: Date;
}

// 1️⃣ ხარჯების წამოღება (GET)
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const expenses = await sql`
      SELECT id, amount, category, date
      FROM expenses
      WHERE user_id = ${payload.userId}
      ORDER BY date DESC
    ` as ExpenseRow[];

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("GET Expenses Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2️⃣ ხარჯის დამატება (POST)
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { amount, category }: { amount: number; category: string } = await request.json();

    if (!amount || !category) {
      return NextResponse.json(
        { error: "Amount and category required." },
        { status: 400 }
      );
    }

    const newExpenses = await sql`
      INSERT INTO expenses (amount, category, user_id)
      VALUES (${amount}, ${category}, ${payload.userId})
      RETURNING *
    ` as ExpenseRow[];

    return NextResponse.json(newExpenses[0], { status: 201 });
  } catch (error) {
    console.error("POST Expense Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 3️⃣ ხარჯის წაშლა (DELETE)
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID required." },
        { status: 400 }
      );
    }

    // უსაფრთხოებისთვის ვამოწმებთ user_id-საც
    const deletedExpenses = await sql`
      DELETE FROM expenses
      WHERE id = ${id} AND user_id = ${payload.userId}
      RETURNING *
    ` as ExpenseRow[];

    if (deletedExpenses.length === 0) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedExpenses[0], { status: 200 });
  } catch (error) {
    console.error("DELETE Expense Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
