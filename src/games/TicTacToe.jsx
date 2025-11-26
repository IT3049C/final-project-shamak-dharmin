import { useState } from 'react';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
};

const TicTacToe = () => {
  const { player, login } = usePlayer();
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);

  const winInfo = getWinner(board);
  const winner = winInfo?.winner;
  const isDraw = !winner && board.every(Boolean);

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

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

  return (
    <GameLayout
      title="Tic Tac Toe"
      onReset={handleReset}
    >
      <div className="tictactoe-container">
        <div className="status-badge glass-card">
          {status}
        </div>

        <div className="board-grid glass-panel" aria-label="Tic Tac Toe Board">
          {board.map((value, index) => {
            const isWinningSquare = winInfo?.line.includes(index);
            return (
              <button
                key={index}
                className={`square ${value ? 'filled' : ''} ${isWinningSquare ? 'winner' : ''}`}
                onClick={() => handleClick(index)}
                disabled={Boolean(winner || value)}
                aria-label={`Square ${index + 1}, ${value || 'empty'}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};

export default TicTacToe;