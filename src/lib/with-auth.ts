import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "./api-key";

export async function requireApiKey(
  req: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing x-api-key header" },
      { status: 401 }
    ) as NextResponse;
  }

  const result = await verifyApiKey(apiKey);

  if (!result.valid || !result.userId) {
    return NextResponse.json(
      { error: "Invalid API key" },
      { status: 401 }
    ) as NextResponse;
  }

  return { userId: result.userId };
}
