import { auth } from "@/auth";
import { prisma } from "@/lib/infrastructure/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { category, amount } = await req.json();

  try {
    const budget = await prisma.budget.create({
      data: {
        userId: session.user.id,
        category,
        amount
      }
    });
    return NextResponse.json(budget);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
