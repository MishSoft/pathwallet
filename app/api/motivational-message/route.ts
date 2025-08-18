import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const userId = payload.userId as string;

    const goals = await prisma.financialGoal.findMany({
      where: { userId },
    });

    if (goals.length === 0) {
      return NextResponse.json(
        {
          message:
            "დასახეთ პირველი მიზანი, რათა მიიღოთ მოტივაციური შეტყობინებები!",
        },
        { status: 200 }
      );
    }

    const goal = goals[0]; // ავიღოთ პირველი მიზანი დროებით

    // გამოვთვალოთ პროგრესი
    const progress = (goal.savedAmount / goal.targetAmount) * 100;

    // შევქმნათ მოტივაციური შეტყობინება
    let message = "";
    if (progress >= 100) {
      message = `გილოცავთ! თქვენ მიაღწიეთ თქვენს მიზანს "${goal.title}"!`;
    } else if (progress > 50) {
      message = `შესანიშნავია! თქვენ თითქმის მიაღწიეთ თქვენს მიზანს "${goal.title}". განაგრძეთ ასე!`;
    } else if (progress > 0) {
      message = `კარგია! თქვენ უკვე დაზოგეთ ${progress.toFixed(
        0
      )}% თქვენი მიზნისთვის "${goal.title}". არ გაჩერდეთ!`;
    } else {
      message = `დაიწყეთ დღესვე დანაზოგი თქვენი მიზნისთვის "${goal.title}"!`;
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Failed to generate motivational message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
