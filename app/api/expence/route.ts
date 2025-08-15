import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ხარჯის დამატება
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload; // აბრუნებს 401 Unauthorized შეცდომას, თუ ტოკენი არასწორია
  }

  try {
    const { amount, category } = await request.json();

    if (!amount || !category) {
      return NextResponse.json(
        { error: "Amount and category are required." },
        { status: 400 }
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        amount,
        category,
        userId: payload.userId as string,
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Failed to add expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ყველა ხარჯის წამოსაღებად
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: payload.userId as string,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Failed to get expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ხარჯის წასაშლელად
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    const deletedExpense = await prisma.expense.delete({
      where: {
        id,
        userId: payload.userId as string, // ვამოწმებთ, რომ მომხმარებელს აქვს უფლება წაშალოს
      },
    });

    return NextResponse.json(deletedExpense, { status: 200 });
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
