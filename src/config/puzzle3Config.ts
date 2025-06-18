import { PuzzleConfig } from "../types";

export const puzzle3Config: PuzzleConfig = {
  "id": 3,
  "name": "Rundales castle",
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
          "x": 367,
          "y": -94,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_1_2",
          "type": "outdent",
          "x": -35,
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
          "x": -277,
          "y": -1,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "outdent_1_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_2_2",
          "type": "outdent",
          "x": 291,
          "y": 2,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_2_3",
          "type": "indent",
          "x": 36,
          "y": 291,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "outdent_6_2",
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
          "id": "indent_3_1",
          "type": "indent",
          "x": -378,
          "y": -3,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "outdent_2_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_2",
          "type": "indent",
          "x": 410,
          "y": -3,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "outdent_4_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_3",
          "type": "indent",
          "x": 97,
          "y": 287,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_2",
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
          "x": -343,
          "y": -101,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_4_2",
          "type": "outdent",
          "x": 116,
          "y": 438,
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
          "x": -53,
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
          "x": 364,
          "y": 11,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "indent_6_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_5_3",
          "type": "indent",
          "x": -104,
          "y": 332,
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
          "id": "indent_6_1",
          "type": "indent",
          "x": 220,
          "y": 28,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_6_2",
          "type": "outdent",
          "x": 24,
          "y": -441,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_6_3",
          "type": "indent",
          "x": -277,
          "y": 25,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "outdent_5_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_6_4",
          "type": "outdent",
          "x": -30,
          "y": 530,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 7,
      "width": 964,
      "height": 975,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 964,
        "height": 975
      },
      "connections": [
        {
          "id": "indent_7_1",
          "type": "indent",
          "x": 305,
          "y": 59,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "outdent_8_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_7_2",
          "type": "outdent",
          "x": 109,
          "y": -358,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_7_3",
          "type": "outdent",
          "x": -422,
          "y": 115,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "indent_6_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_7_4",
          "type": "indent",
          "x": 115,
          "y": 371,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "outdent_11_1",
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
          "x": 141,
          "y": -211,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "outdent_4_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_8_2",
          "type": "outdent",
          "x": -435,
          "y": -45,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "indent_7_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_8_3",
          "type": "indent",
          "x": 89,
          "y": 333,
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
          "y": -341,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "indent_5_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_2",
          "type": "indent",
          "x": 233,
          "y": 50,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "outdent_10_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_3",
          "type": "indent",
          "x": -3,
          "y": 360,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_2",
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
          "id": "outdent_10_1",
          "type": "outdent",
          "x": -500,
          "y": -14,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_2",
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
          "id": "outdent_10_3",
          "type": "outdent",
          "x": 399,
          "y": -18,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_4",
          "type": "indent",
          "x": 53,
          "y": 289,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_3",
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
          "id": "outdent_11_1",
          "type": "outdent",
          "x": -1,
          "y": -367,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "indent_7_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_11_2",
          "type": "indent",
          "x": -356,
          "y": 78,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "outdent_10_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_11_3",
          "type": "indent",
          "x": 284,
          "y": 119,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_11_4",
          "type": "indent",
          "x": 4,
          "y": 376,
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
          "y": -412,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "indent_8_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_2",
          "type": "outdent",
          "x": -367,
          "y": 11,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_3",
          "type": "outdent",
          "x": 104,
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
          "x": 461,
          "y": 51,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "indent_14_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_13_2",
          "type": "outdent",
          "x": -97,
          "y": -374,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_3",
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
          "id": "outdent_14_1",
          "type": "outdent",
          "x": 420,
          "y": 116,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_14_2",
          "type": "indent",
          "x": -272,
          "y": 73,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_14_3",
          "type": "outdent",
          "x": -38,
          "y": -357,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_4",
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
          "x": 303,
          "y": 108,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "outdent_16_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_15_2",
          "type": "outdent",
          "x": 6,
          "y": -374,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_15_3",
          "type": "indent",
          "x": -241,
          "y": 108,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_1",
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
          "x": 109,
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
          "x": -347,
          "y": 23,
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
