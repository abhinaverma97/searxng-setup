import { prisma } from "./prisma";
import crypto from "crypto";

export function generateApiKey(): string {
  return `sx_${crypto.randomBytes(32).toString("hex")}`;
}

export function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function verifyApiKey(
  key: string
): Promise<{ valid: boolean; userId?: string }> {
  const hashed = hashKey(key);
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashed },
    select: { id: true, userId: true },
  });

  if (!apiKey) {
    return { valid: false };
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  });

  return { valid: true, userId: apiKey.userId };
}
