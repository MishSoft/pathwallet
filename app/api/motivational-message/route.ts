import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";

// მკაცრი ინტერფეისი ფინანსური მიზნისთვის
interface GoalRow {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
}

export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const userId = payload.userId as string;

    // Raw SQL-ით მოგვაქვს მომხმარებლის მიზნები
    const goals = await sql`
      SELECT id, title, target_amount, saved_amount
      FROM financial_goals
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    ` as GoalRow[];

    if (goals.length === 0) {
      return NextResponse.json(
        {
          message: "დასახეთ პირველი მიზანი, რათა მიიღოთ მოტივაციური შეტყობინებები!",
        },
        { status: 200 }
      );
    }

    const goal = goals[0]; // ვიღებთ ბოლო შექმნილ მიზანს

    // გამოვთვალოთ პროგრესი (გავითვალისწინოთ ნულზე გაყოფა, ყოველი შემთხვევისთვის)
    const progress = goal.target_amount > 0
      ? (goal.saved_amount / goal.target_amount) * 100
      : 0;

    // მოტივაციური ლოგიკა
    let message = "";
    if (progress >= 100) {
      message = `გილოცავთ! თქვენ მიაღწიეთ თქვენს მიზანს "${goal.title}"!`;
    } else if (progress > 50) {
      message = `შესანიშნავია! თქვენ თითქმის მიაღწიეთ თქვენს მიზანს "${goal.title}". განაგრძეთ ასე!`;
    } else if (progress > 0) {
      message = `კარგია! თქვენ უკვე დაზოგეთ ${progress.toFixed(0)}% თქვენი მიზნისთვის "${goal.title}". არ გაჩერდეთ!`;
    } else {
      message = `დაიწყეთ დღესვე დანაზოგი თქვენი მიზნისთვის "${goal.title}"!`;
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Failed to generate motivational message:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
