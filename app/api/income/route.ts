import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// შემოსავლის დამატება
export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload; // აბრუნებს 401 Unauthorized შეცდომას, თუ ტოკენი არასწორია
  }

  try {
    const { amount, source } = await request.json();

    if (!amount || !source) {
      return NextResponse.json(
        { error: "Amount and source are required." },
        { status: 400 }
      );
    }

    const newIncome = await prisma.income.create({
      data: {
        amount,
        source,
        userId: payload.userId as string,
      },
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("Failed to add income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ყველა შემოსავლის წამოსაღებად
export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const incomes = await prisma.income.findMany({
      where: {
        userId: payload.userId as string,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error("Failed to get incomes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// შემოსავლის წასაშლელად
export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);

  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Income ID is required." },
        { status: 400 }
      );
    }

    const deletedIncome = await prisma.income.delete({
      where: {
        id,
        userId: payload.userId as string, // ვამოწმებთ, რომ მომხმარებელს აქვს უფლება წაშალოს
      },
    });

    return NextResponse.json(deletedIncome, { status: 200 });
  } catch (error) {
    console.error("Failed to delete income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
