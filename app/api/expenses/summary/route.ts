import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const expenses = await prisma.expense.findMany({
    where: { userId: user?.id },
  });

  const total = expenses.reduce(
    (acc, exp) => acc + exp.amount,
    0
  );

  const count = expenses.length;

  const average = count > 0 ? total / count : 0;

  return Response.json({
    total,
    count,
    average,
  });
}