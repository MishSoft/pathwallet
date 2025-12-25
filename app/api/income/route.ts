import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";

// ინტერფეისი შემოსავლისთვის
interface IncomeRow {
  id: string;
  amount: number;
  source: string;
  user_id: string;
  date: Date;
}

// 1️⃣ შემოსავლების წამოღება (GET)
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const incomes = await sql`
      SELECT id, amount, source, date
      FROM incomes
      WHERE user_id = ${payload.userId}
      ORDER BY date DESC
    ` as IncomeRow[];

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error("GET Income Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2️⃣ შემოსავლის დამატება (POST)
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { amount, source }: { amount: number; source: string } = await request.json();

    if (!amount || !source) {
      return NextResponse.json(
        { error: "Amount and source are required." },
        { status: 400 }
      );
    }

    const newIncomes = await sql`
      INSERT INTO incomes (amount, source, user_id)
      VALUES (${amount}, ${source}, ${payload.userId})
      RETURNING *
    ` as IncomeRow[];

    return NextResponse.json(newIncomes[0], { status: 201 });
  } catch (error) {
    console.error("POST Income Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 3️⃣ შემოსავლის წაშლა (DELETE)
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  try {
    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Income ID is required." },
        { status: 400 }
      );
    }

    // ვამოწმებთ, რომ წაშლისას იუზერი მხოლოდ თავის ჩანაწერს შლიდეს
    const deletedIncomes = await sql`
      DELETE FROM incomes
      WHERE id = ${id} AND user_id = ${payload.userId}
      RETURNING *
    ` as IncomeRow[];

    if (deletedIncomes.length === 0) {
      return NextResponse.json({ error: "Income not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json(deletedIncomes[0], { status: 200 });
  } catch (error) {
    console.error("DELETE Income Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
