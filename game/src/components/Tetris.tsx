import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Board, Tetromino, TetrominoType, Position } from '../types/tetris';
import GameBoard from './GameBoard';
import { getRandomTetromino, getTetrominoShape } from '../utils/tetrominoes';
import { checkCollision, mergeTetrominoWithBoard, clearLines, calculateScore } from '../utils/gameLogic';
import './GameBoard.css';
import './Tetris.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 500; // milliseconds
const MUSIC_URL = process.env.PUBLIC_URL + '/music1.mp3';
// Preload audio elements
const sounds = {
  move: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
  rotate: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'),
  drop: new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'),
  clear: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
  gameOver: new Audio('https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3')
};

// Set volume for all sounds
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

const createEmptyBoard = (): Board => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));

const createNewPiece = (): Tetromino => ({
  type: getRandomTetromino(),
  position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: -2 },
  rotation: 0
});

const Tetris: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    score: 0,
    level: 1,
    gameOver: false,
    isPaused: false
  });
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const startGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createNewPiece(),
      score: 0,
      level: 1,
      gameOver: false,
      isPaused: false
    });
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameState({
      board: createEmptyBoard(),
      currentPiece: null,
      score: 0,
      level: 1,
      gameOver: false,
      isPaused: false
    });
  };

  const movePiece = useCallback((dx: number, dy: number) => {
    if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return;

    const newPosition = {
      x: gameState.currentPiece.position.x + dx,
      y: gameState.currentPiece.position.y + dy
    };

    if (!checkCollision(gameState.board, gameState.currentPiece, newPosition)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: {
          ...prev.currentPiece!,
          position: newPosition
        }
      }));
      sounds.move.currentTime = 0;
      sounds.move.play().catch(() => {});
      return true;
    }
    return false;
  }, [gameState]);

  const rotatePiece = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return;

    const newRotation = (gameState.currentPiece.rotation + 1) % 4;
    const newPiece = {
      ...gameState.currentPiece,
      rotation: newRotation
    };

    // Try rotation in current position
    if (!checkCollision(gameState.board, newPiece, newPiece.position)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: newPiece
      }));
      sounds.rotate.currentTime = 0;
      sounds.rotate.play().catch(() => {});
      movePiece(0, 1);
      return;
    }

    // Try wall kicks - attempt to shift the piece left or right
    const kickOffsets = [-1, 1, -2, 2]; // Try moving 1 left, 1 right, 2 left, 2 right
    for (const offset of kickOffsets) {
      const kickedPosition = {
        ...newPiece.position,
        x: newPiece.position.x + offset
      };
      
      if (!checkCollision(gameState.board, newPiece, kickedPosition)) {
        setGameState(prev => ({
          ...prev,
          currentPiece: {
            ...newPiece,
            position: kickedPosition
          }
        }));
        sounds.rotate.currentTime = 0;
        sounds.rotate.play().catch(() => {});
        movePiece(0, 1);
        return;
      }
    }
  }, [gameState, movePiece]);

  const dropPiece = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return;

    if (!movePiece(0, 1)) {
      // Play the drop sound immediately, before any other logic
      sounds.drop.currentTime = 0;
      sounds.drop.play().catch(() => {});

      const mergeResult = mergeTetrominoWithBoard(gameState.board, gameState.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(mergeResult.newBoard);
      const placedBlocks = mergeResult.placedBlocks;
      // Game over if any placed block is above the visible board
      const isBlockAboveBoard = placedBlocks.some(block => block.y < 0);
      let isGameOver = isBlockAboveBoard;
      let nextPiece: Tetromino | null = null;
      if (!isGameOver) {
        nextPiece = createNewPiece();
        isGameOver = checkCollision(clearedBoard, nextPiece, nextPiece.position);
      }
      const scoreIncrease = calculateScore(linesCleared, gameState.level);
      if (nextPiece) {
        nextPiece = createNewPiece();
      }
      setGameState(prev => ({
        ...prev,
        board: clearedBoard,
        currentPiece: isGameOver ? null : nextPiece,
        score: prev.score + scoreIncrease,
        level: Math.floor(prev.score / 1000) + 1,
        gameOver: isGameOver
      }));
    }
  }, [gameState, movePiece]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameState.gameOver || gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      dropPiece();
    }, INITIAL_SPEED / gameState.level);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameState, dropPiece]);

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'a':
          movePiece(-1, 0);
          break;
        case 'd':
          movePiece(1, 0);
          break;
        case 's':
          movePiece(0, 1);
          break;
        case 'w':
          rotatePiece();
          break;
        case ' ':
          dropPiece();
          break;
        case 'p':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, movePiece, rotatePiece, dropPiece]);

  // Music control effect + analyser
  useEffect(() => {
    if (!musicRef.current) return;

    // Initialize audio context only once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Create source node only once
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(musicRef.current);
    }

    if (gameStarted && !gameState.gameOver && !gameState.isPaused) {
      // Resume audio context if it was suspended
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      musicRef.current.loop = true;
      musicRef.current.volume = 0.25;
      musicRef.current.muted = musicMuted;
      
      // Play music and handle any errors
      musicRef.current.play().catch(error => {
        console.error('Error playing music:', error);
      });

      // Create new analyser for this session
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      
      // Disconnect any existing connections
      sourceRef.current.disconnect();
      analyser.disconnect();
      
      // Set up new connections
      sourceRef.current.connect(analyser);
      analyser.connect(audioCtxRef.current.destination);
      analyserRef.current = analyser;

      // Animation loop to update volume
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animate = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        // Use the average volume
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMusicVolume(avg);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setMusicVolume(0);
      
      // Pause the music when game is not active
      if (musicRef.current) {
        musicRef.current.pause();
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [gameStarted, gameState.gameOver, gameState.isPaused, musicMuted]);

  if (!gameStarted) {
    return (
      <div className="tetris-game">
        <audio ref={musicRef} src={MUSIC_URL} preload="auto" />
        <div className="start-screen">
          <h1>React Tetris</h1>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
          <div className="controls">
            <p>Controls:</p>
            <p>A D : Move Left/Right</p>
            <p>W : Rotate</p>
            <p>S : Soft Drop</p>
            <p>Space : Hard Drop</p>
            <p>P : Pause</p>
          </div>
          <button className="mute-btn" onClick={() => setMusicMuted(m => !m)}>
            {musicMuted ? 'Unmute Music' : 'Mute Music'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tetris-game">
      <audio ref={musicRef} src={MUSIC_URL} preload="auto" />
      <div className="sidebar">
        <div className="game-info">
          <div>Score: {gameState.score}</div>
          <div>Level: {gameState.level}</div>
          {gameState.gameOver && (
            <div className="game-over">
              <div>Game Over!</div>
              <button className="restart-button" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
          {gameState.isPaused && <div className="paused">Paused</div>}
        </div>
        <div className="controls">
          <p>Controls:</p>
          <p>A D : Move Left/Right</p>
          <p>W : Rotate</p>
          <p>S : Soft Drop</p>
          <p>Space : Hard Drop</p>
          <p>P : Pause</p>
        </div>
        <button className="mute-btn" onClick={() => setMusicMuted(m => !m)}>
          {musicMuted ? 'Unmute Music' : 'Mute Music'}
        </button>
      </div>
      <GameBoard
        board={gameState.board}
        currentPiece={gameState.currentPiece}
        style={{
          boxShadow: `0 0 ${16 + musicVolume / 4}px ${4 + musicVolume / 16}px #0ff, 0 0 ${24 + musicVolume / 2}px #f0f`
        }}
      />
    </div>
  );
};

export default Tetris; 