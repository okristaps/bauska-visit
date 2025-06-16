import { NextRequest, NextResponse } from "next/server";
import { puzzle1Config } from "@/config/puzzle1Config";
import { puzzle2Config } from "@/config/puzzle2Config";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const puzzleId = parseInt(searchParams.get("puzzleId") || "1");

  const config = puzzleId === 1 ? puzzle1Config : puzzle2Config;
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const { puzzleId, config } = await request.json();

    if (!puzzleId || !config) {
      return NextResponse.json({ error: "Puzzle ID and config are required" }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), "src", "config", `puzzle${puzzleId}Config.ts`);
    const configContent = `import { PuzzleConfig } from "../types";\n\nexport const puzzle${puzzleId}Config: PuzzleConfig = ${JSON.stringify(
      config,
      null,
      2
    )};\n`;

    await fs.writeFile(configPath, configContent, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save puzzle configuration" }, { status: 500 });
  }
}
