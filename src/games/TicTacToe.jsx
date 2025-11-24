import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './TicTacToe.css';

const initialBoard = Array(9).fill(null);

const getWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const navigate = useNavigate();
  const { playerName } = usePlayer();
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);

  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
  };

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="tictactoe">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          ← Back
        </button>
        <div className="game-title">
          <h1>Tic Tac Toe</h1>
          {playerName && <p className="player-tag">Playing as {playerName}</p>}
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleReset} aria-label="Reset Tic Tac Toe game">
            Reset
          </button>
        </div>
      </div>

      <main className="tictactoe-main">
        <section className="tictactoe-board" aria-label="Tic Tac Toe board">
          <div className="grid">
            {board.map((value, index) => (
              <button
                key={index}
                type="button"
                className="square"
                onClick={() => handleClick(index)}
                aria-label={value ? `Square ${index + 1}, ${value}` : `Square ${index + 1}, empty`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="tictactoe-status" aria-live="polite">
            {status}
          </p>
        </section>
      </main>
    </div>
  );
};

export default TicTacToe;