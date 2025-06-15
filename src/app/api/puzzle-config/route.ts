import { NextResponse } from "next/server";
import { puzzlePieceDimensions } from "@/config/puzzleDimensions";

export async function GET() {
  return NextResponse.json(puzzlePieceDimensions);
}
