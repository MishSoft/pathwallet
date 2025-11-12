/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helper to check if object is NextResponse
function isNextResponse(obj: any): obj is NextResponse {
  return obj instanceof NextResponse;
}

export async function GET(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (isNextResponse(payload)) return payload;

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: payload.userId }, // payload has userId
      orderBy: { date: "desc" },
    });
    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (isNextResponse(payload)) return payload;

  try {
    const { amount, source } = await request.json();
    if (!amount || !source)
      return NextResponse.json(
        { error: "Amount and source are required." },
        { status: 400 }
      );

    const newIncome = await prisma.income.create({
      data: { amount, source, userId: payload.userId },
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await verifyJWT(request);
  if (isNextResponse(payload)) return payload;

  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { error: "Income ID is required." },
        { status: 400 }
      );

    const deletedIncome = await prisma.income.delete({
      where: { id },
    });

    return NextResponse.json(deletedIncome, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
