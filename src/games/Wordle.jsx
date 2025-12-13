import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
import { usePlayer } from '../context/PlayerContext';
import './Wordle.css';

const WORDS = [
  'APPLE', 'BRICK', 'GHOST', 'LIGHT', 'PLANT', 'ROBOT', 'SMILE', 'TRACK', 'WATER', 'ZEBRA',
  'ABOUT', 'ABOVE', 'BRAVE', 'BROWN', 'CHAIR', 'CHIEF', 'CHINA', 'CLEAN', 'CLEAR', 'CLIMB',
  'CLOCK', 'CLOSE', 'CLOUD', 'COAST', 'DANCE', 'DEATH', 'DEPTH', 'DOUBT', 'DRAFT', 'DRAIN',
  'DREAM', 'DRESS', 'DRINK', 'DRIVE', 'EARTH', 'EMPTY', 'ENEMY', 'ENTRY', 'EQUAL', 'ERROR',
  'EVENT', 'FAITH', 'FALSE', 'FAULT', 'FIELD', 'FIGHT', 'FINAL', 'FIRST', 'FLEET', 'FLOOR',
  'FOCUS', 'FORCE', 'FRAME', 'FRANK', 'FRESH', 'FRONT', 'FRUIT', 'GLASS', 'GRACE', 'GRADE',
  'GRAND', 'GRANT', 'GRASS', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GUARD', 'GUESS', 'GUIDE',
  'HAPPY', 'HEART', 'HEAVY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IMAGE', 'INDEX', 'INNER',
  'ISSUE', 'JOINT', 'JUDGE', 'KNIFE', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN',
  'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH',
  'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH', 'METAL', 'MINOR', 'MINUS', 'MIXED', 'MODEL',
  'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MUSIC', 'NIGHT', 'NOISE',
  'NORTH', 'NOVEL', 'NURSE', 'OCEAN', 'OFFER', 'ORDER', 'OTHER', 'OUTER', 'OWNER', 'PAINT',
  'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PHASE', 'PHONE', 'PIECE', 'PILOT', 'PLACE', 'PLANE',
  'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR',
  'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE',
  'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REFER', 'RIGHT', 'RIVER', 'ROUND', 'ROUTE',
  'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL',
  'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK',
  'SHOOT', 'SHORT', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SKILL', 'SLEEP', 'SLIDE',
  'SMALL', 'SMART', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK',
  'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND',
  'START', 'STATE', 'STEAM', 'STEEL', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE',
  'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SWEET', 'TABLE', 'TAKEN',
  'TASTE', 'TEACH', 'THANK', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK',
  'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL',
  'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE',
  'TRICK', 'TRIED', 'TROOP', 'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNION',
  'UNITY', 'UNTIL', 'UPPER', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS',
  'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WHEEL', 'WHERE', 'WHICH', 'WHILE',
  'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD',
  'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH'
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const scoreGuess = (guess, solution) => {
  const result = Array(5).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // First pass: correct letters
  guessChars.forEach((char, index) => {
    if (char === solutionChars[index]) {
      result[index] = 'correct';
      solutionChars[index] = null;
    }
  });

  // Second pass: present letters
  guessChars.forEach((char, index) => {
    if (result[index] === 'correct') return;
    const matchIndex = solutionChars.indexOf(char);
    if (matchIndex !== -1) {
      result[index] = 'present';
      solutionChars[matchIndex] = null;
    }
  });

  return result;
};

const Wordle = () => {
  const navigate = useNavigate();
  const { player, login } = usePlayer();
  const [solution, setSolution] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]); // { word, result }[]
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  const remainingGuesses = useMemo(() => 6 - guesses.length, [guesses.length]);

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status !== 'playing') return;

    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== 5) {
      alert('Please enter exactly 5 letters.');
      return;
    }

    if (!/^[A-Z]{5}$/.test(guess)) {
      alert('Please enter only letters.');
      return;
    }

    const result = scoreGuess(guess, solution);
    const nextGuesses = [...guesses, { word: guess, result }];
    setGuesses(nextGuesses);
    setCurrentGuess('');

    if (guess === solution) {
      setStatus('won');
    } else if (nextGuesses.length === 6) {
      setStatus('lost');
    }
  };

  const handleReset = () => {
    setSolution(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setStatus('playing');
  };

  const boardRows = Array.from({ length: 6 }, (_, index) => guesses[index] || null);

  return (
    <GameLayout
      title="Wordle"
      onReset={handleReset}
    >
      <div className="wordle-container">
        <div className="wordle-board glass-panel">
          {boardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="wordle-row">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const letter = row?.word[colIndex] ?? '';
                const state = row?.result[colIndex] ?? '';
                return (
                  <div
                    key={colIndex}
                    className={`wordle-cell ${state}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="wordle-controls glass-card">
          <form onSubmit={handleSubmit} className="wordle-form">
            <input
              type="text"
              maxLength={5}
              value={currentGuess}
              onChange={(event) => setCurrentGuess(event.target.value)}
              placeholder="Enter 5-letter word"
              className="wordle-input glass-input"
              autoFocus
              disabled={status !== 'playing'}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={status !== 'playing' || currentGuess.length !== 5}
            >
              Guess
            </button>
          </form>

          <div className="status-message">
            {status === 'playing' && `${remainingGuesses} guesses left`}
            {status === 'won' && <span className="text-accent">You Won! 🎉</span>}
            {status === 'lost' && (
              <span>
                Game Over. Word was <span className="text-accent">{solution}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default Wordle;