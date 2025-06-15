import { PuzzleConfig } from "../types";

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
      actualBounds: { left: 0, top: 0, width: 1252, height: 1263 },
      connections: [
        {
          id: "outdent_right_p1",
          x: 580,
          y: -120,
          type: "outdent",
          connectsTo: {
            pieceId: 2,
            pointId: "indent_left_p2",
            sequence: 1,
          },
        },
        {
          id: "outdent_bottom_p1",
          x: -75,
          y: 580,
          type: "outdent",
          connectsTo: {
            pieceId: 5,
            pointId: "indent_top_p5",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 2,
      width: 1086,
      height: 1029,
      actualBounds: { left: 0, top: 0, width: 1086, height: 1029 },
      connections: [
        {
          id: "indent_left_p2",
          x: -320,
          y: 0,
          type: "indent",
          connectsTo: {
            pieceId: 1,
            pointId: "outdent_right_p1",
            sequence: 1,
          },
        },
        {
          id: "indent_bottom_p2",
          x: 0,
          y: 300,
          type: "indent",
          connectsTo: {
            pieceId: 6,
            pointId: "outdent_top_p6",
            sequence: 1,
          },
        },
        {
          id: "indent_right_p2",
          x: 320,
          y: 0,
          type: "indent",
          connectsTo: {
            pieceId: 3,
            pointId: "outdent_left_p3",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 3,
      width: 1318,
      height: 1049,
      actualBounds: { left: 0, top: 0, width: 1318, height: 1049 },
      connections: [
        {
          id: "outdent_left_p3",
          x: -580,
          y: -20,
          type: "outdent",
          connectsTo: {
            pieceId: 7,
            pointId: "indent_right_p2",
            sequence: 1,
          },
        },
        {
          id: "indent_right_p3",
          x: 420,
          y: -30,
          type: "indent",
          connectsTo: {
            pieceId: 4,
            pointId: "outdent_left_p4",
            sequence: 1,
          },
        },
        {
          id: "indent_bottom_p3",
          x: 120,
          y: 320,
          type: "indent",
          connectsTo: {
            pieceId: 7,
            pointId: "outdent_top_p7",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 4,
      width: 1246,
      height: 1010,
      actualBounds: { left: 0, top: 0, width: 1246, height: 1010 },
      connections: [
        {
          id: "indent_bottom_p4",
          x: 130,
          y: 300,
          type: "indent",
          connectsTo: {
            pieceId: 8,
            pointId: "outdent_top_p8",
            sequence: 1,
          },
        },
        {
          id: "outdent_left_p4",
          x: -580,
          y: -20,
          type: "outdent",
          connectsTo: {
            pieceId: 3,
            pointId: "indent_right_p3",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 5,
      width: 1246,
      height: 1010,
      actualBounds: { left: 0, top: 0, width: 1246, height: 1010 },
      connections: [
        {
          id: "indent_top_p5",
          x: -70,
          y: -300,
          type: "indent",
          connectsTo: {
            pieceId: 1,
            pointId: "outdent_bottom_p1",
            sequence: 1,
          },
        },
        {
          id: "outdent_right_p5",
          x: 580,
          y: 10,
          type: "outdent",
          connectsTo: {
            pieceId: 6,
            pointId: "indent_left_p6",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 6,
      width: 1069,
      height: 1298,
      actualBounds: { left: 0, top: 0, width: 1069, height: 1298 },
      connections: [
        {
          id: "outdent_top_p6",
          x: 0,
          y: -600,
          type: "outdent",
          connectsTo: {
            pieceId: 2,
            pointId: "indent_bottom_p2",
            sequence: 1,
          },
        },
        {
          id: "indent_left_p6",
          x: -320,
          y: 160,
          type: "indent",
          connectsTo: {
            pieceId: 5,
            pointId: "outdent_right_p5",
            sequence: 1,
          },
        },
        {
          id: "indent_right_p6",
          x: 320,
          y: 190,
          type: "indent",
          connectsTo: {
            pieceId: 7,
            pointId: "outdent_left_p7",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 7,
      width: 1599,
      height: 1244,
      actualBounds: { left: 0, top: 0, width: 1599, height: 1244 },
      connections: [
        {
          id: "outdent_top_p7",
          x: 0,
          y: -600,
          type: "outdent",
          connectsTo: {
            pieceId: 3,
            pointId: "indent_bottom_p3",
            sequence: 1,
          },
        },
        {
          id: "outdent_left_p7",
          x: -730,
          y: 190,
          type: "outdent",
          connectsTo: {
            pieceId: 6,
            pointId: "indent_right_p6",
            sequence: 1,
          },
        },
        {
          id: "outdent_right_p7",
          x: 730,
          y: 100,
          type: "outdent",
          connectsTo: {
            pieceId: 8,
            pointId: "indent_left_p8",
            sequence: 1,
          },
        },
      ],
    },
    {
      id: 8,
      width: 1016,
      height: 1305,
      actualBounds: { left: 0, top: 0, width: 1016, height: 1305 },
      connections: [
        {
          id: "outdent_top_p8",
          x: 30,
          y: -600,
          type: "outdent",
          connectsTo: {
            pieceId: 4,
            pointId: "indent_bottom_p4",
            sequence: 1,
          },
        },
        {
          id: "indent_left_p8",
          x: -320,
          y: 160,
          type: "indent",
          connectsTo: {
            pieceId: 8,
            pointId: "outdent_right_p7",
            sequence: 1,
          },
        },
      ],
    },
  ],
};
