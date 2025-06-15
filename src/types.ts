export interface PuzzleLayout {
  rows: number;
  cols: number;
  totalPieces: number;
}

export interface ConnectionPoint {
  id: string;
  x: number;
  y: number;
  type: "indent" | "outdent";
  connectsTo: {
    pieceId: number;
    pointId: string;
    sequence: number;
  };
}

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
  connections: ConnectionPoint[];
}

export interface PuzzleConfig {
  id: number;
  name: string;
  layout: PuzzleLayout;
  dimensions: PieceDimensions[];
}
