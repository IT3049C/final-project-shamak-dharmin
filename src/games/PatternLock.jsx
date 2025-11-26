import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
import { usePlayer } from '../context/PlayerContext';
import './PatternLock.css';

const PATTERNS = [
  [0, 1, 2, 5],
  [0, 3, 6, 7, 8],
  [2, 4, 6],
  [1, 4, 7, 3, 5],
  [0, 4, 8, 5, 2],
  [6, 7, 8, 5, 2],
  [0, 1, 4, 7, 8],
];

const getRandomPattern = () => {
  const index = Math.floor(Math.random() * PATTERNS.length);
  return PATTERNS[index];
};

const PatternLock = () => {
  const navigate = useNavigate();
  const { player, login } = usePlayer();

  const [targetPattern, setTargetPattern] = useState(getRandomPattern);
  const [inputPattern, setInputPattern] = useState([]);
  const [result, setResult] = useState('Memorize the pattern, then tap the dots in order.');
  const [score, setScore] = useState(0);

  const handleDotClick = (index) => {
    if (inputPattern.includes(index)) return; // prevent duplicates

    const next = [...inputPattern, index];
    setInputPattern(next);

    if (next.length === targetPattern.length) {
      const isCorrect = next.every((value, i) => value === targetPattern[i]);
      if (isCorrect) {
        setResult('✅ Correct pattern!');
        setScore(prev => prev + 1);
        setTimeout(handleNextPattern, 1000);
      } else {
        setResult('❌ Wrong pattern.');
        setTimeout(() => {
          setInputPattern([]);
          setResult('Try again!');
        }, 1000);
      }
    }
  };

  const handleNextPattern = () => {
    setTargetPattern(getRandomPattern());
    setInputPattern([]);
    setResult('Memorize the pattern, then tap the dots in order.');
  };

  const handleReset = () => {
    setScore(0);
    handleNextPattern();
  };

  const isInTarget = (index) => targetPattern.includes(index);
  const isInInput = (index) => inputPattern.includes(index);

  return (
    <GameLayout
      title="Pattern Lock"
      onReset={handleReset}
      score={score}
    >
      <div className="pattern-lock-container">
        <div className="info-panel glass-card">
          <p className="pattern-hint">
            Pattern Length: <span className="text-accent">{targetPattern.length}</span>
          </p>
          <p className="pattern-status">{result}</p>
        </div>

        <div className="pattern-grid glass-panel">
          {Array.from({ length: 9 }).map((_, index) => {
            // Only show target if input is empty (memorization phase)
            // OR if the dot has been selected by user
            const showTarget = inputPattern.length === 0 && isInTarget(index);
            const isSelected = isInInput(index);

            return (
              <button
                key={index}
                type="button"
                className={`dot ${showTarget ? 'target' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Dot ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
};

export default PatternLock;