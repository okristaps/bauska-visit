import { PuzzleConfig } from "../types";
import { puzzle2Config } from "./puzzle2Config";

export const puzzle1Config: PuzzleConfig = {
  id: 1,
  name: "Bauska Castle",
  layout: {
    rows: 2,
    cols: 4,
    totalPieces: 8,
  },
  dimensions: [
    {
      id: 1,
      width: 1252,
      height: 1263,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1252,
        height: 1263,
      },
      connections: [
        {
          id: "outdent_1_1",
          type: "outdent",
          x: 603,
          y: -121,
          connectsTo: {
            pieceId: 2,
            pointId: "indent_2_1",
            sequence: 1,
          },
        },
        {
          id: "outdent_1_2",
          type: "outdent",
          x: -66,
          y: 558,
          connectsTo: {
            pieceId: 5,
            pointId: "indent_5_1",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 2,
      width: 1086,
      height: 1029,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1086,
        height: 1029,
      },
      connections: [
        {
          id: "indent_2_1",
          type: "indent",
          x: -275,
          y: -3,
          connectsTo: {
            pieceId: 1,
            pointId: "outdent_1_1",
            sequence: 1,
          },
        },
        {
          id: "indent_2_2",
          type: "indent",
          x: -20,
          y: 258,
          connectsTo: {
            pieceId: 6,
            pointId: "outdent_6_1",
            sequence: 1,
          },
        },
        {
          id: "outdent_2_3",
          type: "outdent",
          x: 264,
          y: -6,
          connectsTo: {
            pieceId: 3,
            pointId: "outdent_3_1",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 3,
      width: 1318,
      height: 1049,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1318,
        height: 1049,
      },
      connections: [
        {
          id: "outdent_3_1",
          type: "outdent",
          x: -626,
          y: -16,
          connectsTo: {
            pieceId: 2,
            pointId: "outdent_2_3",
            sequence: 1,
          },
        },
        {
          id: "indent_3_2",
          type: "indent",
          x: 124,
          y: 261,
          connectsTo: {
            pieceId: 7,
            pointId: "outdent_7_1",
            sequence: 1,
          },
        },
        {
          id: "indent_3_3",
          type: "indent",
          x: 384,
          y: -60,
          connectsTo: {
            pieceId: 4,
            pointId: "outdent_4_1",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 4,
      width: 1246,
      height: 1010,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1246,
        height: 1010,
      },
      connections: [
        {
          id: "outdent_4_1",
          type: "outdent",
          x: -595,
          y: -39,
          connectsTo: {
            pieceId: 3,
            pointId: "indent_3_3",
            sequence: 1,
          },
        },
        {
          id: "indent_4_2",
          type: "indent",
          x: 112,
          y: 209,
          connectsTo: {
            pieceId: 8,
            pointId: "outdent_8_2",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 5,
      width: 1263,
      height: 1038,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1263,
        height: 1038,
      },
      connections: [
        {
          id: "indent_5_1",
          type: "indent",
          x: -72,
          y: -290,
          connectsTo: {
            pieceId: 1,
            pointId: "outdent_1_2",
            sequence: 1,
          },
        },
        {
          id: "outdent_5_2",
          type: "outdent",
          x: 569,
          y: 25,
          connectsTo: {
            pieceId: 6,
            pointId: "indent_6_2",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 6,
      width: 1069,
      height: 1298,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1069,
        height: 1298,
      },
      connections: [
        {
          id: "outdent_6_1",
          type: "outdent",
          x: -3,
          y: -578,
          connectsTo: {
            pieceId: 2,
            pointId: "indent_2_2",
            sequence: 1,
          },
        },
        {
          id: "indent_6_2",
          type: "indent",
          x: -283,
          y: 156,
          connectsTo: {
            pieceId: 5,
            pointId: "outdent_5_2",
            sequence: 1,
          },
        },
        {
          id: "indent_6_3",
          type: "indent",
          x: 259,
          y: 177,
          connectsTo: {
            pieceId: 7,
            pointId: "outdent_7_2",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 7,
      width: 1599,
      height: 1244,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1599,
        height: 1244,
      },
      connections: [
        {
          id: "outdent_7_1",
          type: "outdent",
          x: 18,
          y: -593,
          connectsTo: {
            pieceId: 3,
            pointId: "indent_3_2",
            sequence: 1,
          },
        },
        {
          id: "outdent_7_2",
          type: "outdent",
          x: -756,
          y: 152,
          connectsTo: {
            pieceId: 6,
            pointId: "indent_6_3",
            sequence: 1,
          },
        },
        {
          id: "outdent_7_3",
          type: "outdent",
          x: 776,
          y: 107,
          connectsTo: {
            pieceId: 8,
            pointId: "indent_8_1",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 8,
      width: 1016,
      height: 1305,
      actualBounds: {
        left: 0,
        top: 0,
        width: 1016,
        height: 1305,
      },
      connections: [
        {
          id: "indent_8_1",
          type: "indent",
          x: -214,
          y: 139,
          connectsTo: {
            pieceId: 7,
            pointId: "outdent_7_3",
            sequence: 1,
          },
        },
        {
          id: "outdent_8_2",
          type: "outdent",
          x: -4,
          y: -633,
          connectsTo: {
            pieceId: 4,
            pointId: "indent_4_2",
            sequence: 1,
          },
        },
      ],
    },
  ],
};

export const allPuzzleConfigs = [puzzle1Config, puzzle2Config];
