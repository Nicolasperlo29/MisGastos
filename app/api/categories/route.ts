import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();

  const defaultCategories = [
    "Comida",
    "Alquiler",
    "Transporte",
    "Ocio",
    "Salud",
    "Trabajo",
    ];

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const categories = await prisma.category.findMany({
      where: { userId: user?.id },
      });

      if (categories.length === 0) {
      await prisma.category.createMany({
          data: defaultCategories.map((name) => ({
          name,
          userId: user!.id,
          })),
      });
  }

  const finalCategories =
    await prisma.category.findMany({
      where: { userId: user?.id },
    });

  return Response.json(finalCategories);
}

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      categories: true,
    },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (user.categories.length >= 15) {
    return Response.json(
      { error: "Solo puedes tener hasta 15 categorías." },
      { status: 400 }
    );
  }

  if (user.categories.some((cat) => cat.name.toLowerCase() === body.name.toLowerCase())) {
    return Response.json(
      { error: "Ya tienes una categoría con este nombre." },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      userId: user!.id,
    },
  });

  return Response.json(category);
}