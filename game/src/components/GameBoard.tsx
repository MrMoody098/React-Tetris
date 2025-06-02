import React from 'react';
import { Board, BoardCell, Tetromino } from '../types/tetris';
import { getTetrominoShape } from '../utils/tetrominoes';

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  // Create a copy of the board to show the current piece
  const displayBoard = board.map(row => [...row]);

  // If there's a current piece, add it to the display board
  if (currentPiece) {
    const shape = getTetrominoShape(currentPiece.type, currentPiece.rotation);
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            displayBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
  }

  return (
    <div className="game-board">
      {displayBoard.map((row, y) => (
        <div key={y} className="board-row">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`board-cell ${cell ? `tetromino-${cell.toLowerCase()}` : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 