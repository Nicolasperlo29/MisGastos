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

  const category =
    await prisma.category.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

  if (!category) {
    return Response.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });

  return Response.json({ success: true });
}
