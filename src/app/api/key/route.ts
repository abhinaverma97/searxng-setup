import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey, hashKey } from "@/lib/api-key";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, lastUsed: true, createdAt: true },
  });

  return NextResponse.json({ keys: keys.map(k => ({ ...k, key: null })) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.slice(0, 255) : null;

  const key = generateApiKey();

  await prisma.apiKey.create({
    data: {
      key: hashKey(key),
      name,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ key, name, message: "API key created. Store it securely — it won't be shown again." }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyId } = await req.json();

  if (!keyId) {
    return NextResponse.json({ error: "Missing keyId" }, { status: 400 });
  }

  const deleted = await prisma.apiKey.deleteMany({
    where: { id: keyId, userId: session.user.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Key deleted" });
}
