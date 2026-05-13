import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const expenses = await prisma.expense.findMany({
    where: { userId: user?.id },
  });

  const grouped: Record<string, number> = {};

  expenses.forEach((exp) => {
    grouped[exp.category] =
      (grouped[exp.category] || 0) +
      exp.amount;
  });

  const result = Object.entries(grouped).map(
    ([category, value]) => ({
      category,
      value,
    })
  );

  return Response.json(result);
}