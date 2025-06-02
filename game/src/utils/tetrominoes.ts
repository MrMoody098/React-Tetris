import { TetrominoType } from '../types/tetris';

type Shape = boolean[][];

interface TetrominoShape {
  shape: Shape;
  rotations: Shape[];
}

const TETROMINO_SHAPES: Record<TetrominoType, TetrominoShape> = {
  I: {
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false]
    ],
    rotations: [
      [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false]
      ],
      [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false]
      ]
    ]
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false]
    ],
    rotations: [
      [
        [true, false, false],
        [true, true, true],
        [false, false, false]
      ],
      [
        [false, true, true],
        [false, true, false],
        [false, true, false]
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, false, true]
      ],
      [
        [false, true, false],
        [false, true, false],
        [true, true, false]
      ]
    ]
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false]
    ],
    rotations: [
      [
        [false, false, true],
        [true, true, true],
        [false, false, false]
      ],
      [
        [false, true, false],
        [false, true, false],
        [false, true, true]
      ],
      [
        [false, false, false],
        [true, true, true],
        [true, false, false]
      ],
      [
        [true, true, false],
        [false, true, false],
        [false, true, false]
      ]
    ]
  },
  O: {
    shape: [
      [true, true],
      [true, true]
    ],
    rotations: [
      [
        [true, true],
        [true, true]
      ]
    ]
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false]
    ],
    rotations: [
      [
        [false, true, true],
        [true, true, false],
        [false, false, false]
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, false, true]
      ]
    ]
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false]
    ],
    rotations: [
      [
        [false, true, false],
        [true, true, true],
        [false, false, false]
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, true, false]
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, true, false]
      ],
      [
        [false, true, false],
        [true, true, false],
        [false, true, false]
      ]
    ]
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false]
    ],
    rotations: [
      [
        [true, true, false],
        [false, true, true],
        [false, false, false]
      ],
      [
        [false, false, true],
        [false, true, true],
        [false, true, false]
      ]
    ]
  }
};

export const getRandomTetromino = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return types[Math.floor(Math.random() * types.length)];
};

export const getTetrominoShape = (type: TetrominoType, rotation: number): Shape => {
  const tetromino = TETROMINO_SHAPES[type];
  return tetromino.rotations[rotation % tetromino.rotations.length];
};

export default TETROMINO_SHAPES; 