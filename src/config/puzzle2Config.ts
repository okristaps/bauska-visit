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
        },
        {
          "id": "outdent_1_2",
          "type": "outdent",
          "x": -48,
          "y": 428,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "indent_5_1",
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
          "x": -225,
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
          "x": 169,
          "y": -4,
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
          "x": -498,
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
          "x": -444,
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
      "connections": [
        {
          "id": "indent_5_1",
          "type": "indent",
          "x": -66,
          "y": -224,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "outdent_1_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_5_2",
          "type": "outdent",
          "x": 394,
          "y": 14,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "indent_6_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_5_3",
          "type": "indent",
          "x": -103,
          "y": 319,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "outdent_9_1",
            "sequence": 1
          }
        }
      ]
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
          "x": 6,
          "y": -562,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_6_2",
          "type": "indent",
          "x": -249,
          "y": 28,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "outdent_5_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_6_3",
          "type": "indent",
          "x": 220,
          "y": 15,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_6_4",
          "type": "outdent",
          "x": -29,
          "y": 530,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_1",
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
          "x": 93,
          "y": -463,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_7_2",
          "type": "outdent",
          "x": -426,
          "y": 98,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "indent_6_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_7_3",
          "type": "indent",
          "x": 303,
          "y": 72,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "outdent_8_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_7_4",
          "type": "indent",
          "x": 94,
          "y": 293,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "outdent_11_2",
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
        },
        {
          "id": "outdent_8_2",
          "type": "outdent",
          "x": -437,
          "y": -28,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "indent_7_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_8_3",
          "type": "indent",
          "x": 90,
          "y": 290,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_1",
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
      "connections": [
        {
          "id": "outdent_9_1",
          "type": "outdent",
          "x": -15,
          "y": -354,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "indent_5_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_2",
          "type": "indent",
          "x": 246,
          "y": 37,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "outdent_10_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_3",
          "type": "indent",
          "x": -3,
          "y": 386,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_1",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_10_1",
          "type": "indent",
          "x": -30,
          "y": -219,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "outdent_6_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_10_2",
          "type": "outdent",
          "x": -490,
          "y": -25,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_3",
          "type": "indent",
          "x": -17,
          "y": 217,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_10_4",
          "type": "outdent",
          "x": 412,
          "y": 21,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_3",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_11_1",
          "type": "indent",
          "x": 247,
          "y": 63,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_11_2",
          "type": "outdent",
          "x": -20,
          "y": -447,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "indent_7_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_11_3",
          "type": "indent",
          "x": -344,
          "y": 116,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "outdent_10_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_11_4",
          "type": "indent",
          "x": 43,
          "y": 406,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "outdent_15_2",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "outdent_12_1",
          "type": "outdent",
          "x": 63,
          "y": -451,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "indent_8_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_2",
          "type": "outdent",
          "x": -401,
          "y": -42,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_3",
          "type": "outdent",
          "x": 79,
          "y": 504,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "indent_16_1",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "outdent_13_1",
          "type": "outdent",
          "x": -97,
          "y": -348,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_13_2",
          "type": "outdent",
          "x": 398,
          "y": 55,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "indent_14_1",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_14_1",
          "type": "indent",
          "x": -331,
          "y": 76,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_14_2",
          "type": "outdent",
          "x": -110,
          "y": -429,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_14_3",
          "type": "outdent",
          "x": 353,
          "y": 86,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_3",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_15_1",
          "type": "indent",
          "x": 328,
          "y": 96,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "outdent_16_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_15_2",
          "type": "outdent",
          "x": 45,
          "y": -348,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_15_3",
          "type": "indent",
          "x": -306,
          "y": 78,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_3",
            "sequence": 1
          }
        }
      ]
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
      "connections": [
        {
          "id": "indent_16_1",
          "type": "indent",
          "x": 83,
          "y": -224,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_16_2",
          "type": "outdent",
          "x": -321,
          "y": 10,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_1",
            "sequence": 1
          }
        }
      ]
    }
  ]
};
