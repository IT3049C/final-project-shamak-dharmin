import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './PatternLock.css';

const PATTERNS = [
  [0, 1, 2, 5],
  [0, 3, 6, 7, 8],
  [2, 4, 6],
  [1, 4, 7, 3, 5],
];

const getRandomPattern = () => {
  const index = Math.floor(Math.random() * PATTERNS.length);
  return PATTERNS[index];
};

const PatternLock = () => {
  const navigate = useNavigate();
  const { playerName } = usePlayer();

  const [targetPattern, setTargetPattern] = useState(getRandomPattern);
  const [inputPattern, setInputPattern] = useState([]);
  const [result, setResult] = useState('Memorize the pattern, then tap the dots in order.');

  const handleBackHome = () => {
    navigate('/');
  };

  const handleDotClick = (index) => {
    if (inputPattern.includes(index)) return; // prevent duplicates

    const next = [...inputPattern, index];
    setInputPattern(next);

    if (next.length === targetPattern.length) {
      const isCorrect = next.every((value, i) => value === targetPattern[i]);
      setResult(isCorrect ? '✅ Correct pattern!' : '❌ Wrong pattern.');
    }
  };

  const handleNextPattern = () => {
    setTargetPattern(getRandomPattern());
    setInputPattern([]);
    setResult('Memorize the pattern, then tap the dots in order.');
  };

  const isInTarget = (index) => targetPattern.includes(index);
  const isInInput = (index) => inputPattern.includes(index);

  return (
    <div className="pattern-lock">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          ← Back
        </button>
        <div className="game-title">
          <h1>Pattern Lock</h1>
          {playerName && <p className="player-tag">Playing as {playerName}</p>}
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleNextPattern} aria-label="New pattern">
            New Pattern
          </button>
        </div>
      </div>

      <main className="pattern-main">
        <section className="pattern-info" aria-label="Pattern instructions">
          <p className="pattern-target">
            Pattern length: <strong>{targetPattern.length}</strong>
          </p>
          <p className="pattern-hint">Dots that belong to the pattern are highlighted.</p>
          <p className="pattern-result" aria-live="polite">
            {result}
          </p>
        </section>

        <section className="pattern-grid" aria-label="Pattern grid">
          <div className="grid-3x3">
            {Array.from({ length: 9 }).map((_, index) => {
              const inTarget = isInTarget(index);
              const inInput = isInInput(index);
              return (
                <button
                  key={index}
                  type="button"
                  className={`dot ${inTarget ? 'target' : ''} ${inInput ? 'selected' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Dot ${index + 1}`}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatternLock;