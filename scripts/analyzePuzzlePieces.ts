import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

interface PieceDimensions {
  id: number;
  width: number;
  height: number;
  // The actual bounds of the non-transparent content
  actualBounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

async function analyzePiece(imagePath: string): Promise<PieceDimensions | null> {
  try {
    const pieceId = parseInt(path.basename(imagePath).split(".")[0]);
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.error(`Could not get dimensions for piece ${pieceId}`);
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
      id: pieceId,
      width: metadata.width,
      height: metadata.height,
      actualBounds: {
        left: minX,
        top: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
      },
    };
  } catch (error) {
    console.error(`Error analyzing piece: ${imagePath}`, error);
    return null;
  }
}

async function generatePuzzleConfig() {
  try {
    const piecesDir = path.join(process.cwd(), "public", "assets", "puzzles", "puzzle_1");
    const files = await fs.readdir(piecesDir);

    const pieceFiles = files
      .filter((file) => {
        const match = file.match(/^(\d+)\.png$/);
        if (!match) return false;
        const pieceId = parseInt(match[1]);
        return pieceId >= 1 && pieceId <= 8; // Only pieces 1-8
      })
      .sort((a, b) => parseInt(a) - parseInt(b));

    console.log("Processing pieces:", pieceFiles);

    const pieces: PieceDimensions[] = [];

    for (const file of pieceFiles) {
      const result = await analyzePiece(path.join(piecesDir, file));
      if (result) {
        pieces.push(result);
      }
    }

    // Generate TypeScript configuration file
    const configContent = `// Auto-generated puzzle piece configuration
export interface PieceDimensions {
  id: number;
  width: number;
  height: number;
  actualBounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export const puzzlePieceDimensions: PieceDimensions[] = ${JSON.stringify(pieces, null, 2)};
`;

    const configDir = path.join(process.cwd(), "src", "config");
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(path.join(configDir, "puzzleDimensions.ts"), configContent);

    console.log("Successfully generated puzzle configuration!");
    console.log("Found pieces:", pieces.map((p) => p.id).join(", "));
  } catch (error) {
    console.error("Error generating puzzle configuration:", error);
  }
}

generatePuzzleConfig();
