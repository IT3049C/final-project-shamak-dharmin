import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
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
  const [player, setPlayer] = useState(null);
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

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  return (
    <div className="typing-game">
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
          <h1>Typing Speed Test</h1>
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