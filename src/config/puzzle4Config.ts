import { PuzzleConfig } from "../types";

export const puzzle4Config: PuzzleConfig = {
  "id": 4,
  "name": "Puzzle 4",
  "layout": {
    "rows": 4,
    "cols": 8,
    "totalPieces": 32
  },
  "dimensions": [
    {
      "id": 1,
      "width": 653,
      "height": 629,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 653,
        "height": 629
      },
      "connections": [
        {
          "id": "outdent_1_1",
          "type": "outdent",
          "x": 294,
          "y": -63,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_1_2",
          "type": "outdent",
          "x": -37,
          "y": 218,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 2,
      "width": 665,
      "height": 523,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 665,
        "height": 523
      },
      "connections": [
        {
          "id": "indent_2_1",
          "type": "indent",
          "x": -197,
          "y": -10,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "outdent_1_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_2_2",
          "type": "outdent",
          "x": 251,
          "y": -1,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_2_3",
          "type": "indent",
          "x": -74,
          "y": 174,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "outdent_10_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 3,
      "width": 523,
      "height": 518,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 523,
        "height": 518
      },
      "connections": [
        {
          "id": "indent_3_1",
          "type": "indent",
          "x": -187,
          "y": 1,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "outdent_2_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_2",
          "type": "indent",
          "x": 187,
          "y": -17,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "outdent_4_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_3_3",
          "type": "indent",
          "x": -17,
          "y": 142,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "outdent_11_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 4,
      "width": 660,
      "height": 515,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 660,
        "height": 515
      },
      "connections": [
        {
          "id": "outdent_4_1",
          "type": "outdent",
          "x": -243,
          "y": -15,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_4_2",
          "type": "indent",
          "x": 277,
          "y": -15,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "outdent_5_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_4_3",
          "type": "indent",
          "x": 86,
          "y": 205,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 5,
      "width": 655,
      "height": 633,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 655,
        "height": 633
      },
      "connections": [
        {
          "id": "outdent_5_1",
          "type": "outdent",
          "x": -232,
          "y": -74,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "indent_4_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_5_2",
          "type": "indent",
          "x": 260,
          "y": -58,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "outdent_6_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_5_3",
          "type": "outdent",
          "x": 49,
          "y": 225,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "indent_13_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 6,
      "width": 649,
      "height": 636,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 649,
        "height": 636
      },
      "connections": [
        {
          "id": "outdent_6_1",
          "type": "outdent",
          "x": -237,
          "y": -58,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "indent_5_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_6_2",
          "type": "indent",
          "x": 193,
          "y": -49,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_6_3",
          "type": "outdent",
          "x": 53,
          "y": 206,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "indent_14_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 7,
      "width": 660,
      "height": 623,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 660,
        "height": 623
      },
      "connections": [
        {
          "id": "outdent_7_1",
          "type": "outdent",
          "x": -300,
          "y": -43,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "indent_6_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_7_2",
          "type": "indent",
          "x": 201,
          "y": -60,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "outdent_8_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_7_3",
          "type": "outdent",
          "x": 87,
          "y": 221,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 8,
      "width": 655,
      "height": 628,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 655,
        "height": 628
      },
      "connections": [
        {
          "id": "outdent_8_1",
          "type": "outdent",
          "x": -291,
          "y": -64,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "indent_7_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_8_2",
          "type": "outdent",
          "x": 53,
          "y": 251,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "indent_16_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 9,
      "width": 630,
      "height": 535,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 630,
        "height": 535
      },
      "connections": [
        {
          "id": "outdent_9_1",
          "type": "outdent",
          "x": 230,
          "y": -11,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_2",
          "type": "indent",
          "x": -25,
          "y": -213,
          "connectsTo": {
            "pieceId": 1,
            "pointId": "outdent_1_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_9_3",
          "type": "indent",
          "x": -60,
          "y": 173,
          "connectsTo": {
            "pieceId": 17,
            "pointId": "outdent_17_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 10,
      "width": 525,
      "height": 642,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 525,
        "height": 642
      },
      "connections": [
        {
          "id": "outdent_10_1",
          "type": "outdent",
          "x": -4,
          "y": -267,
          "connectsTo": {
            "pieceId": 2,
            "pointId": "indent_2_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_2",
          "type": "indent",
          "x": 191,
          "y": 35,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "outdent_11_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_3",
          "type": "indent",
          "x": -203,
          "y": 34,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "outdent_9_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_10_4",
          "type": "indent",
          "x": -4,
          "y": 217,
          "connectsTo": {
            "pieceId": 18,
            "pointId": "outdent_18_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 11,
      "width": 648,
      "height": 778,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 648,
        "height": 778
      },
      "connections": [
        {
          "id": "indent_11_1",
          "type": "indent",
          "x": 219,
          "y": -18,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_11_2",
          "type": "outdent",
          "x": 52,
          "y": -345,
          "connectsTo": {
            "pieceId": 3,
            "pointId": "indent_3_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_11_3",
          "type": "outdent",
          "x": -247,
          "y": -9,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_11_4",
          "type": "outdent",
          "x": 52,
          "y": 298,
          "connectsTo": {
            "pieceId": 19,
            "pointId": "indent_19_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 12,
      "width": 782,
      "height": 648,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 782,
        "height": 648
      },
      "connections": [
        {
          "id": "outdent_12_1",
          "type": "outdent",
          "x": 293,
          "y": 47,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "indent_13_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_2",
          "type": "outdent",
          "x": 30,
          "y": -234,
          "connectsTo": {
            "pieceId": 4,
            "pointId": "indent_4_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_12_3",
          "type": "outdent",
          "x": -334,
          "y": 30,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "indent_11_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_12_4",
          "type": "indent",
          "x": 17,
          "y": 262,
          "connectsTo": {
            "pieceId": 20,
            "pointId": "outdent_20_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 13,
      "width": 653,
      "height": 664,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 653,
        "height": 664
      },
      "connections": [
        {
          "id": "outdent_13_1",
          "type": "outdent",
          "x": 261,
          "y": -58,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "indent_14_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_13_2",
          "type": "indent",
          "x": -69,
          "y": -274,
          "connectsTo": {
            "pieceId": 5,
            "pointId": "outdent_5_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_13_3",
          "type": "indent",
          "x": -277,
          "y": -73,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "outdent_12_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_13_4",
          "type": "outdent",
          "x": -55,
          "y": 232,
          "connectsTo": {
            "pieceId": 21,
            "pointId": "indent_21_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 14,
      "width": 658,
      "height": 652,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 658,
        "height": 652
      },
      "connections": [
        {
          "id": "outdent_14_1",
          "type": "outdent",
          "x": 259,
          "y": -78,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_14_2",
          "type": "indent",
          "x": -69,
          "y": -287,
          "connectsTo": {
            "pieceId": 6,
            "pointId": "outdent_6_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_14_3",
          "type": "indent",
          "x": -239,
          "y": -52,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_14_4",
          "type": "outdent",
          "x": -57,
          "y": 229,
          "connectsTo": {
            "pieceId": 22,
            "pointId": "indent_22_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 15,
      "width": 649,
      "height": 542,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 649,
        "height": 542
      },
      "connections": [
        {
          "id": "outdent_15_1",
          "type": "outdent",
          "x": 242,
          "y": 12,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "indent_16_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_15_2",
          "type": "indent",
          "x": -43,
          "y": -212,
          "connectsTo": {
            "pieceId": 7,
            "pointId": "outdent_7_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_15_3",
          "type": "indent",
          "x": -243,
          "y": -12,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_15_4",
          "type": "indent",
          "x": -74,
          "y": 144,
          "connectsTo": {
            "pieceId": 23,
            "pointId": "outdent_23_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 16,
      "width": 518,
      "height": 542,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 518,
        "height": 542
      },
      "connections": [
        {
          "id": "indent_16_1",
          "type": "indent",
          "x": -15,
          "y": -181,
          "connectsTo": {
            "pieceId": 8,
            "pointId": "outdent_8_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_16_2",
          "type": "indent",
          "x": -188,
          "y": 10,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "outdent_15_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_16_3",
          "type": "indent",
          "x": -4,
          "y": 226,
          "connectsTo": {
            "pieceId": 24,
            "pointId": "outdent_24_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 17,
      "width": 655,
      "height": 669,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 655,
        "height": 669
      },
      "connections": [
        {
          "id": "outdent_17_1",
          "type": "outdent",
          "x": -73,
          "y": -258,
          "connectsTo": {
            "pieceId": 9,
            "pointId": "indent_9_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_17_2",
          "type": "outdent",
          "x": 235,
          "y": 84,
          "connectsTo": {
            "pieceId": 18,
            "pointId": "indent_18_1",
            "sequence": 1
          }
        },
        {
          "id": "indent_17_3",
          "type": "indent",
          "x": -100,
          "y": 266,
          "connectsTo": {
            "pieceId": 25,
            "pointId": "outdent_25_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 18,
      "width": 538,
      "height": 642,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 538,
        "height": 642
      },
      "connections": [
        {
          "id": "indent_18_1",
          "type": "indent",
          "x": -197,
          "y": 61,
          "connectsTo": {
            "pieceId": 17,
            "pointId": "outdent_17_2",
            "sequence": 1
          }
        },
        {
          "id": "outdent_18_2",
          "type": "outdent",
          "x": -17,
          "y": -282,
          "connectsTo": {
            "pieceId": 10,
            "pointId": "indent_10_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_18_3",
          "type": "indent",
          "x": 157,
          "y": 36,
          "connectsTo": {
            "pieceId": 19,
            "pointId": "outdent_19_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_18_4",
          "type": "indent",
          "x": -30,
          "y": 243,
          "connectsTo": {
            "pieceId": 26,
            "pointId": "outdent_26_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 19,
      "width": 746,
      "height": 661,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 746,
        "height": 661
      },
      "connections": [
        {
          "id": "indent_19_1",
          "type": "indent",
          "x": -16,
          "y": -266,
          "connectsTo": {
            "pieceId": 11,
            "pointId": "outdent_11_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_19_2",
          "type": "outdent",
          "x": -338,
          "y": -70,
          "connectsTo": {
            "pieceId": 18,
            "pointId": "indent_18_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_19_3",
          "type": "outdent",
          "x": 310,
          "y": -79,
          "connectsTo": {
            "pieceId": 20,
            "pointId": "indent_20_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_19_4",
          "type": "outdent",
          "x": 20,
          "y": 236,
          "connectsTo": {
            "pieceId": 27,
            "pointId": "indent_27_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 20,
      "width": 648,
      "height": 755,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 648,
        "height": 755
      },
      "connections": [
        {
          "id": "indent_20_1",
          "type": "indent",
          "x": -238,
          "y": -10,
          "connectsTo": {
            "pieceId": 19,
            "pointId": "outdent_19_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_20_2",
          "type": "outdent",
          "x": -44,
          "y": -284,
          "connectsTo": {
            "pieceId": 12,
            "pointId": "indent_12_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_20_3",
          "type": "outdent",
          "x": 228,
          "y": 6,
          "connectsTo": {
            "pieceId": 21,
            "pointId": "indent_21_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_20_4",
          "type": "outdent",
          "x": -53,
          "y": 268,
          "connectsTo": {
            "pieceId": 28,
            "pointId": "indent_28_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 21,
      "width": 676,
      "height": 533,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 676,
        "height": 533
      },
      "connections": [
        {
          "id": "indent_21_1",
          "type": "indent",
          "x": -287,
          "y": -4,
          "connectsTo": {
            "pieceId": 20,
            "pointId": "outdent_20_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_21_2",
          "type": "indent",
          "x": -63,
          "y": -203,
          "connectsTo": {
            "pieceId": 13,
            "pointId": "outdent_13_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_21_3",
          "type": "outdent",
          "x": 308,
          "y": 0,
          "connectsTo": {
            "pieceId": 22,
            "pointId": "indent_22_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_21_4",
          "type": "indent",
          "x": -43,
          "y": 176,
          "connectsTo": {
            "pieceId": 29,
            "pointId": "outdent_29_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 22,
      "width": 536,
      "height": 670,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 536,
        "height": 670
      },
      "connections": [
        {
          "id": "indent_22_1",
          "type": "indent",
          "x": 0,
          "y": -274,
          "connectsTo": {
            "pieceId": 14,
            "pointId": "outdent_14_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_22_2",
          "type": "indent",
          "x": -128,
          "y": -65,
          "connectsTo": {
            "pieceId": 21,
            "pointId": "outdent_21_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_22_3",
          "type": "indent",
          "x": 177,
          "y": -77,
          "connectsTo": {
            "pieceId": 23,
            "pointId": "outdent_23_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_22_4",
          "type": "outdent",
          "x": 4,
          "y": 246,
          "connectsTo": {
            "pieceId": 30,
            "pointId": "indent_30_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 23,
      "width": 788,
      "height": 793,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 788,
        "height": 793
      },
      "connections": [
        {
          "id": "outdent_23_1",
          "type": "outdent",
          "x": -328,
          "y": -22,
          "connectsTo": {
            "pieceId": 22,
            "pointId": "indent_22_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_23_2",
          "type": "outdent",
          "x": -21,
          "y": -371,
          "connectsTo": {
            "pieceId": 15,
            "pointId": "indent_15_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_23_3",
          "type": "outdent",
          "x": 337,
          "y": 13,
          "connectsTo": {
            "pieceId": 24,
            "pointId": "indent_24_1",
            "sequence": 1
          }
        },
        {
          "id": "outdent_23_4",
          "type": "outdent",
          "x": -12,
          "y": 307,
          "connectsTo": {
            "pieceId": 31,
            "pointId": "indent_31_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 24,
      "width": 508,
      "height": 777,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 508,
        "height": 777
      },
      "connections": [
        {
          "id": "indent_24_1",
          "type": "indent",
          "x": -151,
          "y": 13,
          "connectsTo": {
            "pieceId": 23,
            "pointId": "outdent_23_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_24_2",
          "type": "outdent",
          "x": -10,
          "y": -286,
          "connectsTo": {
            "pieceId": 16,
            "pointId": "indent_16_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_24_3",
          "type": "outdent",
          "x": -13,
          "y": 354,
          "connectsTo": {
            "pieceId": 32,
            "pointId": "indent_32_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 25,
      "width": 514,
      "height": 643,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 514,
        "height": 643
      },
      "connections": [
        {
          "id": "indent_25_1",
          "type": "indent",
          "x": 147,
          "y": 67,
          "connectsTo": {
            "pieceId": 26,
            "pointId": "outdent_26_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_25_2",
          "type": "outdent",
          "x": -29,
          "y": -232,
          "connectsTo": {
            "pieceId": 17,
            "pointId": "indent_17_3",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 26,
      "width": 648,
      "height": 626,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 648,
        "height": 626
      },
      "connections": [
        {
          "id": "indent_26_1",
          "type": "indent",
          "x": 254,
          "y": 72,
          "connectsTo": {
            "pieceId": 27,
            "pointId": "outdent_27_3",
            "sequence": 1
          }
        },
        {
          "id": "outdent_26_2",
          "type": "outdent",
          "x": 49,
          "y": -241,
          "connectsTo": {
            "pieceId": 18,
            "pointId": "indent_18_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_26_3",
          "type": "outdent",
          "x": -277,
          "y": 59,
          "connectsTo": {
            "pieceId": 25,
            "pointId": "indent_25_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 27,
      "width": 675,
      "height": 516,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 675,
        "height": 516
      },
      "connections": [
        {
          "id": "indent_27_1",
          "type": "indent",
          "x": 305,
          "y": 12,
          "connectsTo": {
            "pieceId": 28,
            "pointId": "outdent_28_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_27_2",
          "type": "indent",
          "x": 87,
          "y": -197,
          "connectsTo": {
            "pieceId": 19,
            "pointId": "outdent_19_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_27_3",
          "type": "outdent",
          "x": -252,
          "y": 16,
          "connectsTo": {
            "pieceId": 26,
            "pointId": "indent_26_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 28,
      "width": 746,
      "height": 529,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 746,
        "height": 529
      },
      "connections": [
        {
          "id": "outdent_28_1",
          "type": "outdent",
          "x": 294,
          "y": 15,
          "connectsTo": {
            "pieceId": 29,
            "pointId": "indent_29_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_28_2",
          "type": "indent",
          "x": -3,
          "y": -227,
          "connectsTo": {
            "pieceId": 20,
            "pointId": "outdent_20_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_28_3",
          "type": "outdent",
          "x": -260,
          "y": 19,
          "connectsTo": {
            "pieceId": 27,
            "pointId": "indent_27_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 29,
      "width": 661,
      "height": 641,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 661,
        "height": 641
      },
      "connections": [
        {
          "id": "outdent_29_1",
          "type": "outdent",
          "x": -33,
          "y": -252,
          "connectsTo": {
            "pieceId": 21,
            "pointId": "indent_21_4",
            "sequence": 1
          }
        },
        {
          "id": "outdent_29_2",
          "type": "outdent",
          "x": 248,
          "y": 38,
          "connectsTo": {
            "pieceId": 30,
            "pointId": "indent_30_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_29_3",
          "type": "indent",
          "x": -262,
          "y": 71,
          "connectsTo": {
            "pieceId": 28,
            "pointId": "outdent_28_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 30,
      "width": 672,
      "height": 513,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 672,
        "height": 513
      },
      "connections": [
        {
          "id": "outdent_30_1",
          "type": "outdent",
          "x": 243,
          "y": -30,
          "connectsTo": {
            "pieceId": 31,
            "pointId": "indent_31_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_30_2",
          "type": "indent",
          "x": -59,
          "y": -180,
          "connectsTo": {
            "pieceId": 22,
            "pointId": "outdent_22_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_30_3",
          "type": "indent",
          "x": -261,
          "y": -27,
          "connectsTo": {
            "pieceId": 29,
            "pointId": "outdent_29_2",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 31,
      "width": 637,
      "height": 513,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 637,
        "height": 513
      },
      "connections": [
        {
          "id": "outdent_31_1",
          "type": "outdent",
          "x": 248,
          "y": -12,
          "connectsTo": {
            "pieceId": 32,
            "pointId": "indent_32_2",
            "sequence": 1
          }
        },
        {
          "id": "indent_31_2",
          "type": "indent",
          "x": -57,
          "y": -176,
          "connectsTo": {
            "pieceId": 23,
            "pointId": "outdent_23_4",
            "sequence": 1
          }
        },
        {
          "id": "indent_31_3",
          "type": "indent",
          "x": -243,
          "y": -30,
          "connectsTo": {
            "pieceId": 30,
            "pointId": "outdent_30_1",
            "sequence": 1
          }
        }
      ]
    },
    {
      "id": 32,
      "width": 527,
      "height": 516,
      "actualBounds": {
        "left": 0,
        "top": 0,
        "width": 527,
        "height": 516
      },
      "connections": [
        {
          "id": "indent_32_1",
          "type": "indent",
          "x": -2,
          "y": -128,
          "connectsTo": {
            "pieceId": 24,
            "pointId": "outdent_24_3",
            "sequence": 1
          }
        },
        {
          "id": "indent_32_2",
          "type": "indent",
          "x": -184,
          "y": -10,
          "connectsTo": {
            "pieceId": 31,
            "pointId": "outdent_31_1",
            "sequence": 1
          }
        }
      ]
    }
  ]
};
