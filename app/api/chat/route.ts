import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { sql } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatAction {
  action: "add_income" | "add_expense" | "unknown" | "advice";
  data?: {
    amount?: number;
    source?: string;
    category?: string;
  };
  response: string;
}

export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Gemini API key is missing." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt }: { prompt: string } = await request.json();
    const userId = payload.userId as string;

    // 1. მომხმარებლის ფინანსური მონაცემების წამოღება SQL-ით
    const incomes = await sql`SELECT amount FROM incomes WHERE user_id = ${userId}`;
    const expenses = await sql`SELECT amount, category FROM expenses WHERE user_id = ${userId}`;

    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const balance = totalIncome - totalExpense;

    const systemPrompt = `
      You are the financial assistant of PathWallet.
      User's current financial data:
      - Total income: ${totalIncome} GEL
      - Total expenses: ${totalExpense} GEL
      - Current balance: ${balance} GEL
      - Expense details: ${JSON.stringify(expenses)}

      Rules:
      1. To add income: {"action": "add_income", "data": {"amount": <number>, "source": "<string>"}, "response": "<msg>"}
      2. To add expense: {"action": "add_expense", "data": {"amount": <number>, "category": "<string>"}, "response": "<msg>"}
      3. For advice: {"action": "advice", "response": "<advice based on data>"}
      4. Else: {"action": "unknown", "response": "<msg>"}

      Important: Respond ONLY with a valid JSON object.
      User request: "${prompt}"
    `;

    const result = await model.generateContent(systemPrompt);
    const rawText = result.response.text();

    // 2. AI პასუხის დამუშავება
    let parsedAction: ChatAction;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsedAction = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("AI Parse Error:", rawText);
      return NextResponse.json({ action: "unknown", message: "ვერ გავიგე, სცადეთ სხვაგვარად." });
    }

    // 3. მოქმედებების შესრულება ბაზაში
    if (parsedAction.action === "add_income" && parsedAction.data?.amount && parsedAction.data.source) {
      await sql`
        INSERT INTO incomes (amount, source, user_id)
        VALUES (${parsedAction.data.amount}, ${parsedAction.data.source}, ${userId})
      `;
    }
    else if (parsedAction.action === "add_expense" && parsedAction.data?.amount && parsedAction.data.category) {
      await sql`
        INSERT INTO expenses (amount, category, user_id)
        VALUES (${parsedAction.data.amount}, ${parsedAction.data.category}, ${userId})
      `;
    }

    return NextResponse.json({
      action: parsedAction.action,
      message: parsedAction.response,
      data: parsedAction.data,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
