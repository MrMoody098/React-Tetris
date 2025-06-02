export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  position: Position;
  rotation: number;
}

export type BoardCell = TetrominoType | null;

export type Board = BoardCell[][];

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
} 