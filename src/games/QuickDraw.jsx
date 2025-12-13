import { useState, useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useGameRoom } from '../hooks/useGameRoom';
import GameLayout from '../components/GameLayout';
import './QuickDraw.css';

const ALL_CHALLENGES = [
  { emoji: '🍎', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct: 'Apple' },
  { emoji: '🐶', options: ['Cat', 'Dog', 'Bird', 'Fish'], correct: 'Dog' },
  { emoji: '🚗', options: ['Bike', 'Car', 'Boat', 'Plane'], correct: 'Car' },
  { emoji: '🌙', options: ['Sun', 'Star', 'Moon', 'Cloud'], correct: 'Moon' },
  { emoji: '⚽', options: ['Basketball', 'Soccer', 'Tennis', 'Baseball'], correct: 'Soccer' },
  { emoji: '🍕', options: ['Burger', 'Pizza', 'Taco', 'Sushi'], correct: 'Pizza' },
  { emoji: '🎸', options: ['Piano', 'Drums', 'Guitar', 'Violin'], correct: 'Guitar' },
  { emoji: '🌳', options: ['Flower', 'Tree', 'Grass', 'Bush'], correct: 'Tree' },
  { emoji: '📱', options: ['Phone', 'Computer', 'Tablet', 'Watch'], correct: 'Phone' },
  { emoji: '🏠', options: ['Office', 'School', 'House', 'Store'], correct: 'House' },
  { emoji: '🐱', options: ['Dog', 'Cat', 'Rabbit', 'Mouse'], correct: 'Cat' },
  { emoji: '🍌', options: ['Apple', 'Banana', 'Orange', 'Grape'], correct: 'Banana' },
  { emoji: '✈️', options: ['Car', 'Boat', 'Plane', 'Train'], correct: 'Plane' },
  { emoji: '☀️', options: ['Moon', 'Star', 'Sun', 'Cloud'], correct: 'Sun' },
  { emoji: '🏀', options: ['Soccer', 'Basketball', 'Football', 'Tennis'], correct: 'Basketball' },
  { emoji: '🍔', options: ['Pizza', 'Burger', 'Hotdog', 'Taco'], correct: 'Burger' },
  { emoji: '🎹', options: ['Guitar', 'Piano', 'Drums', 'Flute'], correct: 'Piano' },
  { emoji: '🌸', options: ['Tree', 'Flower', 'Grass', 'Leaf'], correct: 'Flower' },
  { emoji: '💻', options: ['Phone', 'Tablet', 'Computer', 'Watch'], correct: 'Computer' },
  { emoji: '🏫', options: ['House', 'School', 'Office', 'Mall'], correct: 'School' },
  { emoji: '🐟', options: ['Bird', 'Fish', 'Snake', 'Turtle'], correct: 'Fish' },
  { emoji: '🍊', options: ['Apple', 'Banana', 'Orange', 'Lemon'], correct: 'Orange' },
  { emoji: '🚲', options: ['Car', 'Bike', 'Scooter', 'Bus'], correct: 'Bike' },
  { emoji: '⭐', options: ['Moon', 'Sun', 'Star', 'Planet'], correct: 'Star' },
  { emoji: '🎾', options: ['Golf', 'Tennis', 'Badminton', 'Squash'], correct: 'Tennis' },
  { emoji: '🌮', options: ['Burger', 'Pizza', 'Taco', 'Burrito'], correct: 'Taco' },
  { emoji: '🥁', options: ['Guitar', 'Piano', 'Drums', 'Trumpet'], correct: 'Drums' },
  { emoji: '🌿', options: ['Tree', 'Flower', 'Grass', 'Plant'], correct: 'Grass' },
  { emoji: '⌚', options: ['Phone', 'Watch', 'Clock', 'Timer'], correct: 'Watch' },
  { emoji: '🏢', options: ['House', 'School', 'Office', 'Hotel'], correct: 'Office' },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuickDraw = () => {
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

  const [gameMode, setGameMode] = useState(null); // 'single' or 'multi'
  const [inputRoomCode, setInputRoomCode] = useState('');

  // Local state for single player or optimistic UI
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState(null);
  const [localShowResult, setLocalShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [singlePlayerState, setSinglePlayerState] = useState(null);

  // Unified State Access
  const activeState = gameMode === 'single' ? singlePlayerState : gameState;

  // Re-derive values from activeState
  const activePlayers = activeState?.players || (player ? [player] : []);
  const activeScores = activeState?.scores || {};
  const activeChallenge = activeState?.currentChallenge;
  const activeStatus = activeState?.status;
  const activeRound = activeState?.round || 1;
  const activeIsHost = gameMode === 'single' ? true : (activeState?.hostId === player?.id);
  const maxRounds = 5;

  // If single player, we need to mimic the "updateGameState"
  const updateSinglePlayerState = useCallback((newState) => {
    setSinglePlayerState(newState);
    return Promise.resolve(); // Mimic async
  }, []);

  // Override handlers for single player
  const effectiveUpdateState = gameMode === 'single' ? updateSinglePlayerState : updateGameState;

  const nextRound = useCallback(async () => {
    if (!activeState) return;
    const nextRoundNum = activeState.round + 1;
    if (nextRoundNum > maxRounds) {
      await effectiveUpdateState({
        ...activeState,
        status: 'finished',
        currentChallenge: null
      });
    } else {
      const nextChallenge = activeState.challenges[nextRoundNum - 1];
      await effectiveUpdateState({
        ...activeState,
        round: nextRoundNum,
        currentChallenge: nextChallenge
      });
    }
  }, [activeState, effectiveUpdateState, maxRounds]);

  const handleTimeout = useCallback(() => {
    setLocalShowResult(true);
    if (activeIsHost) {
      setTimeout(() => {
        nextRound();
      }, 2000);
    }
  }, [activeIsHost, nextRound]);

  // Timer Logic (Host only for multiplayer, or local for single)
  useEffect(() => {
    const gameStarted = activeStatus === 'playing';
    if (gameStarted && timeLeft > 0 && !localShowResult) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !localShowResult && gameStarted) {
      handleTimeout();
    }
  }, [timeLeft, activeStatus, localShowResult, handleTimeout]);

  // Sync timer start when new challenge appears
  useEffect(() => {
    if (activeChallenge) {
      setTimeLeft(10);
      setLocalSelectedAnswer(null);
      setLocalShowResult(false);
    }
  }, [activeChallenge]);

  const startSinglePlayer = () => {
    setGameMode('single');
    const challenges = shuffleArray(ALL_CHALLENGES);
    setSinglePlayerState({
      players: [player],
      scores: { [player.id]: 0 },
      status: 'playing',
      round: 1,
      challenges: challenges,
      currentChallenge: challenges[0],
      hostId: player.id
    });
  };

  const handleCreateRoom = async () => {
    setGameMode('multi');
    const challenges = shuffleArray(ALL_CHALLENGES);
    const initialState = {
      players: [player],
      scores: { [player.id]: 0 },
      status: 'lobby',
      round: 1,
      challenges: challenges,
      currentChallenge: null,
      hostId: player.id
    };
    await createRoom(initialState);
  };

  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) return;
    setGameMode('multi');
    const currentGameState = await joinRoom(inputRoomCode);
    if (currentGameState) {
      // Add self to players if not already there
      const isAlreadyJoined = currentGameState.players.some(p => p.id === player.id);
      if (!isAlreadyJoined) {
        const newPlayers = [...currentGameState.players, player];
        const newScores = { ...currentGameState.scores, [player.id]: 0 };
        await updateGameState({
          ...currentGameState,
          players: newPlayers,
          scores: newScores
        });
      }
    }
  };

  const handleStartGame = async () => {
    if (!gameState) return;
    const firstChallenge = gameState.challenges[0];
    await updateGameState({
      ...gameState,
      status: 'playing',
      currentChallenge: firstChallenge,
      round: 1
    });
  };

  const handleAnswer = async (answer) => {
    if (localShowResult) return;
    setLocalSelectedAnswer(answer);
    setLocalShowResult(true);

    if (answer === activeChallenge.correct) {
      const points = timeLeft * 10;
      const newScores = { ...activeScores, [player.id]: (activeScores[player.id] || 0) + points };
      await effectiveUpdateState({
        ...activeState,
        scores: newScores
      });
    }

    if (activeIsHost) {
      setTimeout(() => {
        nextRound();
      }, 2000);
    }
  };

  const handleReset = () => {
    resetRoom();
    setGameMode(null);
    setInputRoomCode('');
    setLocalSelectedAnswer(null);
    setLocalShowResult(false);
  };

  // --- Render ---

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

  if (!gameMode) {
    return (
      <GameLayout title="Quick Draw">
        <div className="quick-draw-container">
          <div className="mode-selection glass-panel">
            <h2>Choose Game Mode</h2>
            <div className="mode-buttons">
              <button className="btn-primary mode-btn" onClick={startSinglePlayer}>
                <span className="icon">🎮</span> Single Player
              </button>
              <div className="divider">OR</div>
              <div className="multiplayer-section glass-card">
                <button className="btn-secondary mode-btn" onClick={handleCreateRoom} disabled={isLoading}>
                  <span className="icon">🌐</span> {isLoading ? 'Creating...' : 'Create Room'}
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

  // Lobby (Multiplayer Only)
  if (gameMode === 'multi' && activeStatus === 'lobby') {
    return (
      <GameLayout title="Quick Draw Lobby" onReset={handleReset}>
        <div className="quick-draw-container">
          <div className="lobby glass-panel">
            <div className="room-code-display">
              <span className="label">Room Code</span>
              <span className="code text-accent">{roomId}</span>
            </div>
            <div className="players-list glass-card">
              <h3>Players ({activePlayers.length})</h3>
              {activePlayers.map(p => (
                <div key={p.id} className="player-item">
                  <span className="avatar">👤</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
            {activeIsHost ? (
              <button className="btn-primary start-btn" onClick={handleStartGame}>
                Start Game
              </button>
            ) : (
              <p className="waiting-text">Waiting for host to start...</p>
            )}
          </div>
        </div>
      </GameLayout>
    );
  }

  // Game Over
  if (activeStatus === 'finished') {
    return (
      <GameLayout title="Quick Draw" onReset={handleReset}>
        <div className="quick-draw-container">
          <div className="game-over glass-panel animate-fade-in">
            <h2>🎉 Game Complete!</h2>
            <div className="final-scores">
              {activePlayers.map(p => (
                <div key={p.id} className="score-row">
                  <span>{p.name}</span>
                  <span className="text-accent">{activeScores[p.id] || 0}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={handleReset}>
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Playing
  return (
    <GameLayout
      title="Quick Draw"
      onReset={handleReset}
      score={activeScores[player.id] || 0}
    >
      <div className="quick-draw-container">
        <div className="game-status-bar glass-card">
          <div className="round-info">Round {activeRound}/{maxRounds}</div>
          <div className={`timer ${timeLeft <= 3 ? 'urgent' : ''} `}>
            Time: {timeLeft}s
          </div>
        </div>

        {activeChallenge ? (
          <div className="challenge-area glass-panel">
            <div className="emoji-display">
              {activeChallenge.emoji}
            </div>
            <p className="question">What is this?</p>

            <div className="options-grid">
              {activeChallenge.options.map((option) => {
                let stateClass = '';
                if (localShowResult) {
                  if (option === activeChallenge.correct) stateClass = 'correct';
                  else if (option === localSelectedAnswer) stateClass = 'incorrect';
                } else if (localSelectedAnswer === option) {
                  stateClass = 'selected';
                }

                return (
                  <button
                    key={option}
                    className={`option-btn glass-card ${stateClass}`}
                    onClick={() => handleAnswer(option)}
                    disabled={localShowResult}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="loading-spinner">Loading...</div>
        )}
      </div>
    </GameLayout>
  );
};

export default QuickDraw;
