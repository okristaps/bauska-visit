import { PuzzleConfig } from "../types";

export const puzzle2Config: PuzzleConfig = {
  "id": 2,
  "name": "Bauska Castle Garden",
  "layout": {
    "rows": 4,
    "cols": 4,
    "totalPieces": 16
  },
  "dimensions": [
    {
      "id": 1,
      "width": 936,
      "height": 956,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 936,
        "height": 956
      },
      "connections": [
        {
          "id": "indent_1_1",
          "type": "indent",
          "x": 303,
          "y": -36,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "outdent_2_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 2,
      "width": 792,
      "height": 770,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 792,
        "height": 770
      },
      "connections": [
        {
          "id": "outdent_2_1",
          "type": "outdent",
          "x": -342,
          "y": 54,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "indent_1_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 3,
      "width": 1027,
      "height": 777,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 1027,
        "height": 777
      },
      "connections": []
    },
    {
      "id": 4,
      "width": 934,
      "height": 973,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 934,
        "height": 973
      },
      "connections": []
    },
    {
      "id": 5,
      "width": 971,
      "height": 810,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 971,
        "height": 810
      },
      "connections": []
    },
    {
      "id": 6,
      "width": 784,
      "height": 1192,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 784,
        "height": 1192
      },
      "connections": []
    },
    {
      "id": 7,
      "width": 968,
      "height": 975,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 968,
        "height": 975
      },
      "connections": []
    },
    {
      "id": 8,
      "width": 983,
      "height": 810,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 983,
        "height": 810
      },
      "connections": []
    },
    {
      "id": 9,
      "width": 790,
      "height": 979,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 790,
        "height": 979
      },
      "connections": []
    },
    {
      "id": 10,
      "width": 1128,
      "height": 787,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 1128,
        "height": 787
      },
      "connections": []
    },
    {
      "id": 11,
      "width": 819,
      "height": 1006,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 819,
        "height": 1006
      },
      "connections": []
    },
    {
      "id": 12,
      "width": 931,
      "height": 1121,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 931,
        "height": 1121
      },
      "connections": []
    },
    {
      "id": 13,
      "width": 980,
      "height": 926,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 980,
        "height": 926
      },
      "connections": []
    },
    {
      "id": 14,
      "width": 986,
      "height": 969,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 986,
        "height": 969
      },
      "connections": []
    },
    {
      "id": 15,
      "width": 805,
      "height": 952,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 805,
        "height": 952
      },
      "connections": []
    },
    {
      "id": 16,
      "width": 942,
      "height": 782,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 942,
        "height": 782
      },
      "connections": []
    }
  ]
};
