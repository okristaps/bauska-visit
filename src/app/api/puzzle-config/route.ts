import { NextRequest, NextResponse } from "next/server";
import { puzzle1Config } from "@/config/puzzle1Config";
import { puzzle2Config } from "@/config/puzzle2Config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const puzzleId = parseInt(searchParams.get("puzzleId") || "1");

  const config = puzzleId === 1 ? puzzle1Config : puzzle2Config;
  return NextResponse.json(config);
}
