import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
import { usePlayer } from '../context/PlayerContext';
import './TypingSpeed.css';

const PHRASES = [
  'The quick brown fox jumps over the lazy dog.',
  'Typing games are a fun way to practice accuracy.',
  'React makes it painless to create interactive UIs.',
  'JavaScript is the language of the web and beyond.',
  'Practice makes perfect when learning to type faster.',
  'Web development requires both creativity and logic.',
  'Game design combines art, code, and user experience.',
  'Programming helps you solve problems systematically.',
  'The best way to learn coding is by building projects.',
  'TypeScript adds type safety to JavaScript applications.',
  'Modern frameworks make building complex apps easier.',
  'Testing your code ensures it works as expected.',
  'Version control helps teams collaborate effectively.',
  'Clean code is easier to read and maintain.',
  'User interface design impacts how people use software.',
  'Debugging skills improve with practice and patience.',
  'Open source communities drive innovation forward.',
  'Responsive design adapts layouts to different screens.',
  'APIs enable different applications to communicate.',
  'Learning new technologies keeps your skills current.',
];

const getRandomPhrase = () => PHRASES[Math.floor(Math.random() * PHRASES.length)];

const TypingSpeed = () => {
  const navigate = useNavigate();
  const { player, login } = usePlayer();
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
    <GameLayout
      title="Typing Speed"
      onReset={handleReset}
      score={wpm || 0}
    >
      <div className="typing-container">
        <div className="text-display glass-panel">
          {targetText.split('').map((char, index) => (
            <span key={index} className={`char ${getCharacterClass(char, index)}`}>
              {char}
            </span>
          ))}
        </div>

        <div className="input-area glass-card">
          <textarea
            value={input}
            onChange={handleChange}
            placeholder="Start typing here..."
            className="typing-input glass-input"
            rows={3}
            disabled={isComplete}
          />
        </div>

        {isComplete && (
          <div className="results-overlay glass-card animate-fade-in">
            <h2>🎉 Completed!</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="label">Time</span>
                <span className="value">{durationSeconds.toFixed(1)}s</span>
              </div>
              <div className="stat-item">
                <span className="label">WPM</span>
                <span className="value">{wpm}</span>
              </div>
            </div>
            <button onClick={handleReset} className="btn-primary">Try Another</button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default TypingSpeed;