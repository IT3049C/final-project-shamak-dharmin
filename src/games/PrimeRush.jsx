import { useState } from 'react';
import GameLayout from '../components/GameLayout';
import './PrimeRush.css';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import AvatarSelector from '../components/AvatarSelector'; // Assuming AvatarSelector is needed

const getRandomNumber = () => Math.floor(Math.random() * 197) + 3; // 3-199

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const PrimeRush = () => {
  const navigate = useNavigate();
  const { player, login } = usePlayer();

  const [currentNumber, setCurrentNumber] = useState(getRandomNumber);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState('playing'); // 'playing' | 'game-over'
  const [feedback, setFeedback] = useState('Is this number prime?');

  const nextNumber = () => {
    setCurrentNumber(getRandomNumber());
  };

  const handleAnswer = (answerIsPrime) => {
    if (status !== 'playing') return;

    const correct = isPrime(currentNumber) === answerIsPrime;

    if (correct) {
      setScore((prev) => prev + 1);
      setFeedback('✅ Correct!');
      nextNumber();
    } else {
      setLives((prev) => {
        const remaining = prev - 1;
        if (remaining <= 0) {
          setStatus('game-over');
          setFeedback('💀 Game over');
        } else {
          setFeedback('❌ Oops, that was wrong.');
          nextNumber();
        }
        return remaining;
      });
    }
  };

  const handleReset = () => {
    setScore(0);
    setLives(3);
    setStatus('playing');
    setFeedback('Is this number prime?');
    setCurrentNumber(getRandomNumber());
  };

  return (
    <GameLayout
      title="Prime Rush"
      onReset={handleReset}
      score={score}
    >
      <div className="prime-rush-container">
        <div className="lives-display glass-card">
          {'❤️'.repeat(lives)}
          <span className="lives-lost">{'🖤'.repeat(3 - lives)}</span>
        </div>

        <div className="number-display glass-panel">
          <span className="number">{currentNumber}</span>
          <p className="feedback-text">{feedback}</p>
        </div>

        <div className="action-buttons">
          <button
            className="btn-primary prime-btn"
            onClick={() => handleAnswer(true)}
            disabled={status !== 'playing'}
          >
            Prime
          </button>
          <button
            className="btn-secondary not-prime-btn"
            onClick={() => handleAnswer(false)}
            disabled={status !== 'playing'}
          >
            Not Prime
          </button>
        </div>

        {status === 'game-over' && (
          <div className="game-over-overlay glass-card animate-fade-in">
            <h2>Game Over</h2>
            <p>Final Score: <span className="text-accent">{score}</span></p>
            <button onClick={handleReset} className="btn-primary">Play Again</button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default PrimeRush;