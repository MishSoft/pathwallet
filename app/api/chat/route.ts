import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

interface ChatAction {
  action: "add_income" | "add_expense" | "unknown";
  data?: {
    amount: number;
    source?: string;
    category?: string;
  };
  response: string;
}

export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

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

    const systemPrompt = `
      შენ ხარ ფინანსური ასისტენტი PathWallet-ისგან. შენი მიზანია დაეხმარო მომხმარებლებს ფინანსების მართვაში.
      შენ შეგიძლია მომხმარებლის მოთხოვნებიდან ამოიღო ინფორმაცია შემოსავლის ან ხარჯის დასამატებლად.
      
      If a user asks to add an income, extract the 'amount' and 'source' and respond with a JSON object.
      If a user asks to add an expense, extract the 'amount' and 'category' and respond with a JSON object.
      
      If the request is not related to adding income or expense, respond with a JSON object with 'action' set to 'unknown' and a friendly text response.
      
      პასუხის JSON ფორმატები:
      
      შემოსავლის დასამატებლად:
      {
        "action": "add_income",
        "data": {
          "amount": <number>,
          "source": "<string>"
        },
        "response": "<მეგობრული შეტყობინება, რომელიც მოქმედებას ადასტურებს>"
      }
      
      ხარჯის დასამატებლად:
      {
        "action": "add_expense",
        "data": {
          "amount": <number>,
          "category": "<string>"
        },
        "response": "<მეგობრული შეტყობინება, რომელიც მოქმედებას ადასტურებს>"
      }

      სხვა მოთხოვნებისთვის:
      {
        "action": "unknown",
        "response": "<მეგობრული შეტყობინება, რომელიც განმარტავს, რომ მხოლოდ ფინანსურ მოქმედებებში შეგიძლია დახმარება>"
      }
      
      მომხმარებლის ენა არის ქართული. უპასუხე ქართულად.
      დარწმუნდი, რომ amount არის რიცხვი. თუ amount არ არის მითითებული, სთხოვე მომხმარებელს, რომ მიუთითოს.
      
      მომხმარებლის მოთხოვნა: "${prompt}"
    `;

    const result = await model.generateContent(systemPrompt);
    const rawText = result.response.text();
    let parsedAction: ChatAction | null = null;
    let cleanJson = "";

    try {
      // ამოვიღოთ Markdown-ის კოდი პასუხიდან
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanJson = rawText.substring(jsonStart, jsonEnd + 1);
        parsedAction = JSON.parse(cleanJson);
      } else {
        throw new Error("JSON not found in AI response.");
      }

      if (!parsedAction) {
        throw new Error("Failed to parse JSON.");
      }

      if (parsedAction.action === "add_income") {
        const { amount, source } = parsedAction.data!;
        await prisma.income.create({
          data: {
            amount,
            source: source!,
            userId: payload.userId as string,
          },
        });
        return NextResponse.json(
          {
            action: parsedAction.action,
            message: parsedAction.response,
            data: parsedAction.data,
          },
          { status: 200 }
        );
      } else if (parsedAction.action === "add_expense") {
        const { amount, category } = parsedAction.data!;
        await prisma.expense.create({
          data: {
            amount,
            category: category!,
            userId: payload.userId as string,
          },
        });
        return NextResponse.json(
          {
            action: parsedAction.action,
            message: parsedAction.response,
            data: parsedAction.data,
          },
          { status: 200 }
        );
      } else if (parsedAction.action === "unknown") {
        return NextResponse.json(
          { action: parsedAction.action, message: parsedAction.response },
          { status: 200 }
        );
      }
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
  } catch (error) {
    console.error("Chat API failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      action: "unknown",
      message:
        "ბოდიში, მაგრამ ვერ გავიგე თქვენი მოთხოვნა. სცადეთ უფრო კონკრეტული იყოთ.",
    },
    { status: 200 }
  );
}
