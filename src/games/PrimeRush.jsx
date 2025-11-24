import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './PrimeRush.css';

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
  const { playerName } = usePlayer();

  const [currentNumber, setCurrentNumber] = useState(getRandomNumber);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState('playing'); // 'playing' | 'game-over'
  const [feedback, setFeedback] = useState('Is this number prime?');

  const handleBackHome = () => {
    navigate('/');
  };

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
    <div className="prime-rush">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          ← Back
        </button>
        <div className="game-title">
          <h1>Prime Rush</h1>
          {playerName && <p className="player-tag">Playing as {playerName}</p>}
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleReset} aria-label="Reset Prime Rush game">
            Reset
          </button>
        </div>
      </div>

      <main className="prime-main">
        <section className="prime-number" aria-label="Number to classify">
          <p className="prime-label">Is this number prime?</p>
          <p className="prime-value" aria-live="polite">{currentNumber}</p>
        </section>

        <section className="prime-actions" aria-label="Answer controls">
          <div className="prime-buttons">
            <button type="button" onClick={() => handleAnswer(true)}>
              Prime
            </button>
            <button type="button" onClick={() => handleAnswer(false)}>
              Not prime
            </button>
          </div>

          <p className="prime-feedback" aria-live="polite">
            {feedback}
          </p>

          <div className="prime-stats" aria-label="Score and lives">
            <p>Score: {score}</p>
            <p>Lives: {lives}</p>
          </div>

          {status === 'game-over' && (
            <div className="prime-gameover">
              <p>Final score: {score}</p>
              <button type="button" onClick={handleReset}>
                Play again
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PrimeRush;