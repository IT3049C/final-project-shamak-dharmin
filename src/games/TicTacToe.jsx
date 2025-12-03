import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useGameRoom } from '../hooks/useGameRoom';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
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
  const {
    roomId,
    gameState,
    createRoom,
    joinRoom,
    updateGameState,
    resetRoom,
    error: roomError,
    isLoading
  } = useGameRoom();

  const [gameMode, setGameMode] = useState(null); // 'local' or 'online'
  const [inputRoomCode, setInputRoomCode] = useState('');

  // Local state
  const [localBoard, setLocalBoard] = useState(initialBoard);
  const [localXIsNext, setLocalXIsNext] = useState(true);

  // Derived state
  const isOnline = gameMode === 'online';
  const activeBoard = isOnline ? (gameState?.board || initialBoard) : localBoard;
  const activeXIsNext = isOnline ? (gameState?.xIsNext ?? true) : localXIsNext;
  const players = isOnline ? (gameState?.players || []) : [];
  const isHost = isOnline && gameState?.hostId === player?.id;

  // Determine my role in online mode
  // Host is always X, second player is O
  const myRole = isOnline ? (isHost ? 'X' : 'O') : null;
  const isMyTurn = isOnline ? (activeXIsNext && myRole === 'X') || (!activeXIsNext && myRole === 'O') : true;
  const opponentName = isOnline ? players.find(p => p.id !== player.id)?.name || 'Waiting...' : 'Local Friend';

  const winInfo = getWinner(activeBoard);
  const winner = winInfo?.winner;
  const isDraw = !winner && activeBoard.every(Boolean);

  const handleCreateRoom = async () => {
    setGameMode('online');
    const initialState = {
      board: initialBoard,
      xIsNext: true,
      players: [player],
      hostId: player.id
    };
    await createRoom(initialState);
  };

  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) return;
    setGameMode('online');
    const currentGameState = await joinRoom(inputRoomCode);
    if (currentGameState) {
      // Add self to players if not already there
      const isAlreadyJoined = currentGameState.players.some(p => p.id === player.id);
      if (!isAlreadyJoined) {
        const newPlayers = [...currentGameState.players, player];
        await updateGameState({
          ...currentGameState,
          players: newPlayers
        });
      }
    }
  };

  const handleClick = async (index) => {
    if (activeBoard[index] || winner) return;

    // Online turn validation
    if (isOnline && !isMyTurn) return;
    if (isOnline && players.length < 2) return; // Wait for opponent

    const nextBoard = activeBoard.slice();
    nextBoard[index] = activeXIsNext ? 'X' : 'O';

    if (isOnline) {
      await updateGameState({
        ...gameState,
        board: nextBoard,
        xIsNext: !activeXIsNext
      });
    } else {
      setLocalBoard(nextBoard);
      setLocalXIsNext(!localXIsNext);
    }
  };

  const handleReset = async () => {
    if (isOnline) {
      if (isHost) {
        await updateGameState({
          ...gameState,
          board: initialBoard,
          xIsNext: true
        });
      }
    } else {
      setLocalBoard(initialBoard);
      setLocalXIsNext(true);
    }
  };

  const leaveRoom = () => {
    resetRoom();
    setGameMode(null);
    setInputRoomCode('');
    setLocalBoard(initialBoard);
    setLocalXIsNext(true);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw";
  } else if (isOnline) {
    if (players.length < 2) status = "Waiting for opponent...";
    else status = isMyTurn ? "Your Turn" : `${opponentName}'s Turn`;
  } else {
    status = `Next player: ${activeXIsNext ? 'X' : 'O'}`;
  }

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

  if (!gameMode) {
    return (
      <GameLayout title="Tic Tac Toe">
        <div className="tictactoe-container">
          <div className="mode-selection glass-panel">
            <h2>Choose Game Mode</h2>
            <div className="mode-buttons">
              <button className="btn-primary mode-btn" onClick={() => setGameMode('local')}>
                <span className="icon">👥</span> Local PvP
              </button>
              <div className="divider">OR</div>
              <div className="multiplayer-section glass-card">
                <button className="btn-secondary mode-btn" onClick={handleCreateRoom} disabled={isLoading}>
                  <span className="icon">🌐</span> {isLoading ? 'Creating...' : 'Create Online Room'}
                </button>
                <div className="join-room">
                  <input
                    type="text"
                    placeholder="ROOM CODE"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value)}
                    className="glass-input"
                  />
                  <button
                    className="btn-primary"
                    onClick={handleJoinRoom}
                    disabled={!inputRoomCode.trim() || isLoading}
                  >
                    {isLoading ? 'Joining...' : 'Join'}
                  </button>
                </div>
                {roomError && <p className="error-text">{roomError}</p>}
              </div>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (isOnline && !gameState) {
    return (
      <GameLayout title="Tic Tac Toe" onReset={leaveRoom}>
        <div className="loading-spinner">Loading room...</div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title="Tic Tac Toe"
      onReset={isOnline ? leaveRoom : handleReset} // In online, back button leaves room
    >
      <div className="tictactoe-container">
        {isOnline && (
          <div className="room-info glass-card">
            <span>Room: <strong className="text-accent">{roomId}</strong></span>
            <span>You are: <strong>{myRole}</strong></span>
            {isHost && winner && (
              <button className="btn-small" onClick={handleReset}>Play Again</button>
            )}
          </div>
        )}

        <div className="status-badge glass-card">
          {status}
        </div>

        <div className="board-grid glass-panel" aria-label="Tic Tac Toe Board">
          {activeBoard.map((value, index) => {
            const isWinningSquare = winInfo?.line.includes(index);
            return (
              <button
                key={index}
                className={`square ${value ? 'filled' : ''} ${isWinningSquare ? 'winner' : ''}`}
                onClick={() => handleClick(index)}
                disabled={Boolean(winner || value) || (isOnline && (!isMyTurn || players.length < 2))}
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