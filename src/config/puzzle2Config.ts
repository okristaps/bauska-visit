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
          "id": "outdent_1_1",
          "type": "outdent",
          "x": 418,
          "y": -58,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_1",
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
          "id": "indent_2_1",
          "type": "indent",
          "x": -229,
          "y": 35,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "outdent_1_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_2_2",
          "type": "indent",
          "x": 168,
          "y": -3,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "outdent_3_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_2_3",
          "type": "indent",
          "x": 19,
          "y": 171,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "outdent_6_1",
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
      "connections": [
        {
          "id": "outdent_3_1",
          "type": "outdent",
          "x": -500,
          "y": -7,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_2",
          "type": "indent",
          "x": 309,
          "y": 4,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "outdent_4_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_3",
          "type": "indent",
          "x": 84,
          "y": 182,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_1",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "outdent_4_1",
          "type": "outdent",
          "x": -445,
          "y": -93,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_4_2",
          "type": "outdent",
          "x": 101,
          "y": 410,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "indent_8_1",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "outdent_6_1",
          "type": "outdent",
          "x": 8,
          "y": -563,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_3",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "outdent_7_1",
          "type": "outdent",
          "x": 95,
          "y": -463,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_3",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_8_1",
          "type": "indent",
          "x": 126,
          "y": -235,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "outdent_4_2",
            "sequence": 1
          }
        }
      ]
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
