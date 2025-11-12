/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

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
  // ავტორიზაცია cookie–დან
  const payload = await verifyJWT(request);
  if (payload instanceof NextResponse) return payload;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined.");
    return NextResponse.json(
      { error: "Server configuration error: Gemini API key is missing." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = await request.json();
    const userId = payload.userId as string;

    // მოვიტანოთ user-ის მონაცემები
    const incomes = await prisma.income.findMany({ where: { userId } });
    const expenses = await prisma.expense.findMany({ where: { userId } });
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const balance = totalIncome - totalExpense;

    const systemPrompt = `
      You are the financial assistant of PathWallet. Your goal is to help users manage their finances.

      User's current financial data:
      - Total income: ${totalIncome} GEL
      - Total expenses: ${totalExpense} GEL
      - Current balance: ${balance} GEL
      - Expense details: ${JSON.stringify(
        expenses.map((e) => ({ amount: e.amount, category: e.category }))
      )}

      Rules:
      1. If the user requests to add income, respond with:
        {
          "action": "add_income",
          "data": { "amount": <number>, "source": "<string>" },
          "response": "<friendly confirmation message>"
        }

      2. If the user requests to add an expense, respond with:
        {
          "action": "add_expense",
          "data": { "amount": <number>, "category": "<string>" },
          "response": "<friendly confirmation message>"
        }

      3. For advice:
        {
          "action": "advice",
          "response": "<personalized advice based on user's finances>"
        }

      4. For any other request:
        {
          "action": "unknown",
          "response": "<friendly message explaining you can only assist with financial actions>"
        }

      Make sure that:
      - "amount" is always a number
      - The response is valid JSON
      - Respond in English
      - If the amount is missing, ask the user to provide it

      User request: "${prompt}"
    `;

    const result = await model.generateContent(systemPrompt);
    const rawText = result.response.text();

    let parsedAction: ChatAction | null = null;
    let cleanJson = "";

    try {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanJson = rawText.substring(jsonStart, jsonEnd + 1);
        parsedAction = JSON.parse(cleanJson);
      } else {
        throw new Error("JSON not found in AI response.");
      }

      if (!parsedAction) throw new Error("Failed to parse JSON.");

      if (parsedAction.action === "add_income") {
        const { amount, source } = parsedAction.data || {};
        if (amount === undefined || !source) {
          return NextResponse.json(
            {
              action: "unknown",
              message:
                "შემოსავლის დამატება ვერ მოხერხდა. თანხა ან წყარო არასრულია.",
            },
            { status: 200 }
          );
        }
        await prisma.income.create({
          data: { amount, source, userId },
        });
        return NextResponse.json(
          {
            action: parsedAction.action,
            message: parsedAction.response,
            data: parsedAction.data,
          },
          { status: 200 }
        );
      }

      if (parsedAction.action === "add_expense") {
        const { amount, category } = parsedAction.data || {};
        if (amount === undefined || !category) {
          return NextResponse.json(
            {
              action: "unknown",
              message:
                "ხარჯის დამატება ვერ მოხერხდა. თანხა ან კატეგორია არასრულია.",
            },
            { status: 200 }
          );
        }
        await prisma.expense.create({
          data: { amount, category, userId },
        });
        return NextResponse.json(
          {
            action: parsedAction.action,
            message: parsedAction.response,
            data: parsedAction.data,
          },
          { status: 200 }
        );
      }

      if (parsedAction.action === "advice") {
        return NextResponse.json(
          { action: parsedAction.action, message: parsedAction.response },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { action: "unknown", message: parsedAction.response },
        { status: 200 }
      );
    } catch (parseError) {
      console.error(
        "Failed to parse AI response as JSON:",
        rawText,
        parseError
      );
      return NextResponse.json(
        {
          action: "unknown",
          message:
            "ბოდიში, მაგრამ ვერ გავიგე თქვენი მოთხოვნა. სცადეთ უფრო კონკრეტული იყოთ.",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Chat API failed:", error);
    if (error.status === 429) {
      return NextResponse.json(
        { error: "API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
