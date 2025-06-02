import { Board, Position, Tetromino, TetrominoType } from '../types/tetris';
import { getTetrominoShape } from './tetrominoes';

export const checkCollision = (
  board: Board,
  tetromino: Tetromino,
  position: Position
): boolean => {
  const shape = getTetrominoShape(tetromino.type, tetromino.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        // Check if out of bounds
        if (
          boardX < 0 ||
          boardX >= board[0].length ||
          boardY >= board.length
        ) {
          console.log(`[checkCollision] Out of bounds at (${boardX},${boardY})`);
          return true;
        }
        if (boardY >= 0) {
          console.log(`[checkCollision] Checking (${boardX},${boardY}):`, board[boardY][boardX]);
          if (board[boardY][boardX] !== null) {
            console.log(`[checkCollision] COLLISION at (${boardX},${boardY})`);
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const mergeTetrominoWithBoard = (
  board: Board,
  tetromino: Tetromino
): { newBoard: Board; placedBlocks: { x: number; y: number }[] } => {
  const newBoard = board.map(row => [...row]);
  const shape = getTetrominoShape(tetromino.type, tetromino.rotation);
  const placedBlocks: { x: number; y: number }[] = [];

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;
        placedBlocks.push({ x: boardX, y: boardY });
        if (boardY >= 0) {
          newBoard[boardY][boardX] = tetromino.type;
        }
      }
    }
  }

  return { newBoard, placedBlocks };
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = board.length - newBoard.length;
  
  // Add new empty lines at the top
  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill(null));
  }
  
  return { newBoard, linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const points = [0, 100, 300, 500, 800];
  return points[linesCleared] * level;
}; 

let nextPiece: Tetromino | null = null;