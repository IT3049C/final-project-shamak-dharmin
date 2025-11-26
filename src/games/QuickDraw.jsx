
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
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
  const navigate = useNavigate();
  const { player, login } = usePlayer();
  const [gameMode, setGameMode] = useState(null); // 'single' or 'multi'
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]); // This state now holds ALL players in a multiplayer game
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [round, setRound] = useState(1);
  const [shuffledChallenges, setShuffledChallenges] = useState([]);
  const maxRounds = 5;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, gameStarted, showResult]);

  useEffect(() => {
    if (gameStarted && shuffledChallenges.length > 0 && !currentChallenge) {
      startNewRound();
    }
  }, [gameStarted, shuffledChallenges]);

  const startSinglePlayer = () => {
    setGameMode('single');
    setIsHost(true);
    setPlayers([player]); // Use the player from the hook
    setScores({ [player.id]: 0 }); // Initialize score for the current player
    setShuffledChallenges(shuffleArray(ALL_CHALLENGES));
    setGameStarted(true);
    setChallengeIndex(0);
    setRound(1);
  };

  const createMultiplayerRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setGameMode('multi');
    setIsHost(true);
    setPlayers([player]); // Host is the current player
    setScores({ [player.id]: 0 }); // Initialize score for the host
  };

  const joinMultiplayerRoom = () => {
    if (roomCode.trim()) {
      setGameMode('multi');
      setIsHost(false);
      // In a real multiplayer game, you'd send 'player' to the host
      // For this local simulation, we add the current player to the list
      setPlayers(prevPlayers => [...prevPlayers, player]);
      setScores(prevScores => ({ ...prevScores, [player.id]: 0 }));
      alert(`Joined room: ${roomCode} `);
    }
  };

  const startGame = () => {
    setShuffledChallenges(shuffleArray(ALL_CHALLENGES));
    setGameStarted(true);
    setChallengeIndex(0);
    setRound(1);
  };

  const startNewRound = () => {
    if (challengeIndex < maxRounds && shuffledChallenges.length > 0) {
      const challenge = shuffledChallenges[challengeIndex];
      setCurrentChallenge(challenge);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(10);
    } else if (challengeIndex >= maxRounds) {
      endGame();
    }
  };

  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentChallenge.correct) {
      const points = timeLeft * 10;
      setScores(prev => ({
        ...prev,
        [player.id]: (prev[player.id] || 0) + points // Update score for the current player
      }));
    }

    setTimeout(() => {
      setChallengeIndex(challengeIndex + 1);
      setRound(round + 1);
      startNewRound();
    }, 2000);
  };

  const handleTimeout = () => {
    setShowResult(true);
    setTimeout(() => {
      setChallengeIndex(challengeIndex + 1);
      setRound(round + 1);
      startNewRound();
    }, 2000);
  };

  const endGame = () => {
    setGameStarted(false);
  };

  const resetGame = () => {
    setChallengeIndex(0);
    setRound(1);
    setScores({ [player.id]: 0 }); // Reset score for the current player
    setGameStarted(false);
    setCurrentChallenge(null);
    setShuffledChallenges(shuffleArray(ALL_CHALLENGES));
    setGameMode(null);
  };

  // Mode Selection View
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
                <button className="btn-secondary mode-btn" onClick={createMultiplayerRoom}>
                  <span className="icon">🌐</span> Create Room
                </button>

                <div className="join-room">
                  <input
                    type="text"
                    placeholder="ROOM CODE"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="glass-input"
                  />
                  <button
                    className="btn-primary"
                    onClick={joinMultiplayerRoom}
                    disabled={!roomCode.trim()}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Lobby View
  if (gameMode === 'multi' && !gameStarted) {
    return (
      <GameLayout title="Quick Draw Lobby" onReset={() => setGameMode(null)}>
        <div className="quick-draw-container">
          <div className="lobby glass-panel">
            <div className="room-code-display">
              <span className="label">Room Code</span>
              <span className="code text-accent">{roomCode}</span>
            </div>

            <div className="players-list glass-card">
              <h3>Players ({players.length})</h3>
              {players.map(p => (
                <div key={p.id} className="player-item">
                  <span className="avatar">👤</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>

            {isHost ? (
              <button className="btn-primary start-btn" onClick={startGame}>
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

  // Game View
  return (
    <GameLayout
      title="Quick Draw"
      onReset={resetGame}
      score={scores[players[0].id] || 0}
    >
      <div className="quick-draw-container">
        <div className="game-status-bar glass-card">
          <div className="round-info">Round {round}/{maxRounds}</div>
          <div className={`timer ${timeLeft <= 3 ? 'urgent' : ''} `}>
            Time: {timeLeft}s
          </div>
        </div>

        {currentChallenge ? (
          <div className="challenge-area glass-panel">
            <div className="emoji-display">
              {currentChallenge.emoji}
            </div>
            <p className="question">What is this?</p>

            <div className="options-grid">
              {currentChallenge.options.map((option) => {
                let stateClass = '';
                if (showResult) {
                  if (option === currentChallenge.correct) stateClass = 'correct';
                  else if (option === selectedAnswer) stateClass = 'incorrect';
                } else if (selectedAnswer === option) {
                  stateClass = 'selected';
                }

                return (
                  <button
                    key={option}
                    className={`option-btn glass-card ${stateClass}`}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="game-over glass-panel animate-fade-in">
            <h2>🎉 Game Complete!</h2>
            <p className="final-score">Final Score: <span className="text-accent">{scores[players[0].id] || 0}</span></p>
            <button className="btn-primary" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default QuickDraw;
