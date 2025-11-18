import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
import './ConnectFour.css';

const ROWS = 6;
const COLS = 7;

const ConnectFour = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  // Initialize board when player is selected
  useEffect(() => {
    if (player) {
      initializeGame();
    }
  }, [player]);

  const initializeGame = () => {
    const emptyBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    setBoard(emptyBoard);
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setWinningCells([]);
  };

  const findLowestRow = (col) => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        return row;
      }
    }
    return -1; // Column is full
  };

  const checkWin = (row, col, player) => {
    const directions = [
      { dr: 0, dc: 1 },  // Horizontal
      { dr: 1, dc: 0 },  // Vertical
      { dr: 1, dc: 1 },  // Diagonal \
      { dr: 1, dc: -1 }  // Diagonal /
    ];

    for (const { dr, dc } of directions) {
      const cells = [[row, col]];
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c]);
        } else {
          break;
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c]);
        } else {
          break;
        }
      }
      
      if (cells.length >= 4) {
        return cells;
      }
    }
    
    return null;
  };

  const handleColumnClick = (col) => {
    if (gameOver) return;
    
    const row = findLowestRow(col);
    if (row === -1) return; // Column full
    
    // Update board
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    // Check for win
    const winCells = checkWin(row, col, currentPlayer);
    if (winCells) {
      setGameOver(true);
      setWinner(currentPlayer);
      setWinningCells(winCells);
      return;
    }
    
    // Check for draw
    const isBoardFull = newBoard[0].every(cell => cell !== 0);
    if (isBoardFull) {
      setGameOver(true);
      setWinner('draw');
      return;
    }
    
    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const handleReset = () => {
    initializeGame();
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  // Ensure board is initialized
  if (board.length === 0) {
    return <div className="connect-four">Loading...</div>;
  }

  return (
    <div className="connect-four">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          ← Back
        </button>
        
        <div className="player-info">
          <img 
            src={player.avatar.image} 
            alt={player.avatar.name} 
            className="player-avatar-img"
          />
          <span className="player-name">{player.name}</span>
        </div>

        <div className="game-status">
          {!gameOver && (
            <span className={`current-turn player${currentPlayer}`}>
              Player {currentPlayer}'s Turn
            </span>
          )}
          {gameOver && winner === 'draw' && (
            <span className="draw">It's a Draw!</span>
          )}
          {gameOver && winner !== 'draw' && (
            <span className={`winner player${winner}`}>
              Player {winner} Wins!
            </span>
          )}
        </div>
      </div>

      <div className="game-board-container">
        <div className="game-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell !== 0 ? `player${cell}` : ''} ${
                    isWinningCell(rowIndex, colIndex) ? 'winning' : ''
                  }`}
                  onClick={() => handleColumnClick(colIndex)}
                >
                  {cell !== 0 && <div className="piece"></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="modal-overlay">
          <div className="win-modal">
            <h2>
              {winner === 'draw' ? '🤝 Draw!' : `🎉 Player ${winner} Wins!`}
            </h2>
            <div className="modal-buttons">
              <button onClick={handleReset}>Play Again</button>
              <button onClick={handleBackHome}>Back to Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectFour;
