import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

interface PuzzleLayout {
  rows: number;
  cols: number;
  totalPieces: number;
}

interface ConnectionPoint {
  id: string;
  type: "indent" | "outdent";
  x: number;
  y: number;
  connectsTo: {
    pieceId: number;
    pointId: string;
  };
}

interface PieceDimensions {
  id: number;
  width: number;
  height: number;
  actualBounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  connections: ConnectionPoint[];
}

interface PuzzleConfig {
  id: number;
  name: string;
  layout: PuzzleLayout;
  dimensions: PieceDimensions[];
}

const PUZZLE_CONFIGS: Record<string, Omit<PuzzleConfig, "dimensions">> = {
  puzzle_1: {
    id: 1,
    name: "Bauska Castle",
    layout: {
      rows: 2,
      cols: 4,
      totalPieces: 8,
    },
  },
  puzzle_2: {
    id: 2,
    name: "Bauska Castle Garden",
    layout: {
      rows: 4,
      cols: 4,
      totalPieces: 16,
    },
  },
};

async function analyzePiece(imagePath: string, gridPosition: number): Promise<PieceDimensions | null> {
  try {
    const fileId = parseInt(path.basename(imagePath).split(".")[0]);
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.error(`Could not get dimensions for piece ${fileId}`);
      return null;
    }

    // Get the alpha channel to find non-transparent pixels
    const { data, info } = await image.extractChannel("alpha").raw().toBuffer({ resolveWithObject: true });

    let minX = info.width;
    let minY = info.height;
    let maxX = 0;
    let maxY = 0;

    // Scan through alpha channel to find bounds of non-transparent pixels
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const alpha = data[y * info.width + x];
        if (alpha > 0) {
          // If pixel is not fully transparent
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    return {
      id: gridPosition, // Use grid position as piece ID instead of file number
      width: metadata.width,
      height: metadata.height,
      actualBounds: {
        left: minX,
        top: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
      },
      connections: [], // Empty connections array as requested
    };
  } catch (error) {
    console.error(`Error analyzing piece: ${imagePath}`, error);
    return null;
  }
}

async function generatePuzzleConfig(puzzleId: string) {
  try {
    const config = PUZZLE_CONFIGS[puzzleId as keyof typeof PUZZLE_CONFIGS];
    if (!config) {
      throw new Error(`Unknown puzzle ID: ${puzzleId}`);
    }

    const piecesDir = path.join(process.cwd(), "public", "assets", "puzzles", puzzleId);
    const files = await fs.readdir(piecesDir);

    // Filter and sort files by their numeric ID
    const pieceFiles = files
      .filter((file) => {
        const match = file.match(/^(\d+)\.png$/);
        if (!match) return false;
        const pieceId = parseInt(match[1]);
        return pieceId >= 1 && pieceId <= config.layout.totalPieces;
      })
      .sort((a, b) => parseInt(a) - parseInt(b));

    console.log(`Processing pieces for ${config.name}:`, pieceFiles);

    const pieces: PieceDimensions[] = [];
    const { rows, cols } = config.layout;

    // Map file numbers to grid positions
    for (let i = 0; i < pieceFiles.length; i++) {
      const file = pieceFiles[i];
      const fileId = parseInt(file);

      // Calculate the correct grid position (1-based)
      // For a 4x4 grid:
      // File 1.png (fileId=1) should be position 1 (top-left)
      // File 2.png (fileId=2) should be position 2 (top row, second column)
      // File 5.png (fileId=5) should be position 5 (second row, first column)
      // etc.
      const gridPosition = fileId;

      const result = await analyzePiece(path.join(piecesDir, file), gridPosition);
      if (result) {
        pieces.push(result);
      }
    }

    // Sort pieces by ID to ensure they're in the correct order
    pieces.sort((a, b) => a.id - b.id);

    const puzzleConfig: PuzzleConfig = {
      ...config,
      dimensions: pieces,
    };

    // Generate TypeScript configuration file
    const configContent = `// Auto-generated puzzle configuration
import { PuzzleConfig } from "@/types";

export const puzzle${config.id}Config: PuzzleConfig = ${JSON.stringify(puzzleConfig, null, 2)};
`;

    const configDir = path.join(process.cwd(), "src", "config");
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(path.join(configDir, `puzzle${config.id}Config.ts`), configContent);

    console.log(`Successfully generated configuration for ${config.name}!`);
    console.log("Found pieces:", pieces.map((p) => p.id).join(", "));
  } catch (error) {
    console.error("Error generating puzzle configuration:", error);
  }
}

// Get puzzle ID from command line argument, default to puzzle_1
const puzzleId = process.argv[2] || "puzzle_1";
generatePuzzleConfig(puzzleId);
