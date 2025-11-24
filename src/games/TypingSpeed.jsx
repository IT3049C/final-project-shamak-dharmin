import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './TypingSpeed.css';

const PHRASES = [
  'The quick brown fox jumps over the lazy dog.',
  'Typing games are a fun way to practice accuracy.',
  'React makes it painless to create interactive UIs.',
];

const getRandomPhrase = () => PHRASES[Math.floor(Math.random() * PHRASES.length)];

const TypingSpeed = () => {
  const navigate = useNavigate();
  const { playerName } = usePlayer();
  const [targetText, setTargetText] = useState(getRandomPhrase);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const isComplete = useMemo(() => input === targetText, [input, targetText]);

  useEffect(() => {
    if (isComplete && startTime && !endTime) {
      setEndTime(Date.now());
    }
  }, [isComplete, startTime, endTime]);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleReset = () => {
    setTargetText(getRandomPhrase());
    setInput('');
    setStartTime(null);
    setEndTime(null);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }
    setInput(value);
  };

  const durationSeconds = useMemo(() => {
    if (!startTime || !endTime) return null;
    return (endTime - startTime) / 1000;
  }, [startTime, endTime]);

  const wpm = useMemo(() => {
    if (!durationSeconds) return null;
    const words = targetText.trim().split(/\s+/).length;
    return Math.round((words / durationSeconds) * 60);
  }, [durationSeconds, targetText]);

  const getCharacterClass = (char, index) => {
    if (!input[index]) return '';
    return input[index] === char ? 'correct' : 'incorrect';
  };

  return (
    <div className="typing-game">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          10 Back
        </button>
        <div className="game-title">
          <h1>Typing Speed Test</h1>
          {playerName && <p className="player-tag">Playing as {playerName}</p>}
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleReset} aria-label="Reset typing game">
            Reset
          </button>
        </div>
      </div>

      <main className="typing-main">
        <section className="typing-target" aria-label="Text to type">
          {targetText.split('').map((char, index) => (
            <span key={index} className={`char ${getCharacterClass(char, index)}`}>
              {char}
            </span>
          ))}
        </section>

        <section className="typing-input" aria-label="Typing input">
          <label htmlFor="typing-input">Start typing to begin the test</label>
          <textarea
            id="typing-input"
            value={input}
            onChange={handleChange}
            rows={4}
          />

          <div className="typing-stats" aria-live="polite">
            {durationSeconds && (
              <p>
                Time: {durationSeconds.toFixed(1)}s | WPM: {wpm}
              </p>
            )}
            {isComplete && <p className="complete">Nice! You completed the challenge.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TypingSpeed;