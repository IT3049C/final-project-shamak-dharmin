import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
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
  const [player, setPlayer] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'single' or 'multi'
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
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

  const handleBackHome = () => {
    navigate('/');
  };

  const startSinglePlayer = () => {
    setGameMode('single');
    setIsHost(true);
    setPlayers([{ name: player.name, avatar: player.avatar, id: 'player1' }]);
    setScores({ player1: 0 });
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
    setPlayers([{ name: player.name, avatar: player.avatar, id: 'host' }]);
    setScores({ host: 0 });
  };

  const joinMultiplayerRoom = () => {
    if (roomCode.trim()) {
      setGameMode('multi');
      setIsHost(false);
      const playerId = 'player_' + Date.now();
      setPlayers([
        { name: 'Host', avatar: player.avatar, id: 'host' },
        { name: player.name, avatar: player.avatar, id: playerId }
      ]);
      setScores({ host: 0, [playerId]: 0 });
      alert(`Joined room: ${roomCode}`);
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
        [players[0].id]: (prev[players[0].id] || 0) + points
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
    alert(`Game Over! Final Score: ${scores[players[0].id] || 0}`);
  };

  const resetGame = () => {
    setChallengeIndex(0);
    setRound(1);
    setScores({ [players[0].id]: 0 });
    setGameStarted(false);
    setCurrentChallenge(null);
    setShuffledChallenges(shuffleArray(ALL_CHALLENGES));
  };

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  if (!gameMode) {
    return (
      <div className="quick-draw">
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

          <div className="game-title">
            <h1>Quick Draw</h1>
          </div>
        </div>

        <main className="quick-draw-main">
          <div className="mode-selection">
            <h2>Choose Game Mode</h2>
            <button className="mode-button" onClick={startSinglePlayer}>
              🎮 Single Player
            </button>
            
            <div className="multiplayer-section">
              <button className="mode-button" onClick={createMultiplayerRoom}>
                🌐 Create Multiplayer Room
              </button>
              
              <div className="join-room">
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <button onClick={joinMultiplayerRoom} disabled={!roomCode.trim()}>
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameMode === 'multi' && !gameStarted) {
    return (
      <div className="quick-draw">
        <ThemeToggle />
        <div className="game-header">
          <button className="back-button" onClick={() => setGameMode(null)}>
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

          <div className="game-title">
            <h1>Quick Draw - Lobby</h1>
          </div>
        </div>

        <main className="quick-draw-main">
          <div className="lobby">
            <h2>Room Code: {roomCode}</h2>
            <p>Share this code with friends to join!</p>
            
            <div className="players-list">
              <h3>Players ({players.length})</h3>
              {players.map(p => (
                <div key={p.id} className="player-item">
                  <span>{p.name}</span>
                </div>
              ))}
            </div>

            {isHost && (
              <button className="start-button" onClick={startGame}>
                Start Game
              </button>
            )}
            {!isHost && <p>Waiting for host to start...</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="quick-draw">
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

        <div className="game-controls">
          <button type="button" onClick={resetGame} aria-label="Reset Quick Draw game">
            New Game
          </button>
        </div>
      </div>

      <main className="quick-draw-main">
        <div className="game-info">
          <div className="round-info">Round {round}/{maxRounds}</div>
          <div className="score-info">Score: {scores[players[0].id] || 0}</div>
          <div className={`timer ${timeLeft <= 3 ? 'urgent' : ''}`}>
            Time: {timeLeft}s
          </div>
        </div>

        {currentChallenge && (
          <div className="challenge-area">
            <div className="emoji-display">
              {currentChallenge.emoji}
            </div>
            <p className="question">What is this?</p>
            
            <div className="options-grid">
              {currentChallenge.options.map((option) => (
                <button
                  key={option}
                  className={`option-button ${
                    showResult
                      ? option === currentChallenge.correct
                        ? 'correct'
                        : option === selectedAnswer
                        ? 'incorrect'
                        : ''
                      : selectedAnswer === option
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`result-message ${selectedAnswer === currentChallenge.correct ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === currentChallenge.correct
                  ? `✅ Correct! +${timeLeft * 10} points`
                  : `❌ Wrong! Correct answer: ${currentChallenge.correct}`}
              </div>
            )}
          </div>
        )}

        {!currentChallenge && challengeIndex >= maxRounds && (
          <div className="game-over">
            <h2>🎉 Game Complete!</h2>
            <p className="final-score">Final Score: {scores[players[0].id] || 0}</p>
            <button className="play-again-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuickDraw;
