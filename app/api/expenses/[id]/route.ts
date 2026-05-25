import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getAuthSession();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const expense =
    await prisma.expense.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

  if (!expense) {
    return Response.json(
      { error: "Expense not found" },
      { status: 404 }
    );
  }

  await prisma.expense.delete({
    where: {
      id,
    },
  });

  return Response.json({ success: true });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  
  const { id } = await context.params;
  const body = await req.json();

  const session = await getAuthSession();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const expense =
    await prisma.expense.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

  if (!expense) {
    return Response.json(
      { error: "Expense not found" },
      { status: 404 }
    );
  }

  if (!body.title || !body.amount) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  await prisma.expense.update({
    where: {
      id,
    },
    data: {
      title: body.title,
      amount: body.amount,
      date: body.date,
      category: body.category,
    },
  });

  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      title: body.title,
      amount: body.amount,
      date: body.date,
      category: body.category,
    },
  });

  return Response.json(updatedExpense);
}