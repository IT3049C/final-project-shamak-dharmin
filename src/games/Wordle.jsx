import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
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
  const [player, setPlayer] = useState(null);
  const [solution, setSolution] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]); // { word, result }[]
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  const remainingGuesses = useMemo(() => 6 - guesses.length, [guesses.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status !== 'playing') return;

    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== 5) {
      alert('Please enter exactly 5 letters.');
      return;
    }

    // Allow any 5-letter word (removed strict dictionary check)
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

  const handleBackHome = () => {
    navigate('/');
  };

  const boardRows = Array.from({ length: 6 }, (_, index) => guesses[index] || null);

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  return (
    <div className="wordle">
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
          <h1>Wordle</h1>
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleReset} aria-label="Reset Wordle game">
            New Game
          </button>
        </div>
      </div>

      <main className="wordle-main">
        <section
          className="wordle-board"
          aria-label="Wordle board"
        >
          {boardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="wordle-row" role="row">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const letter = row?.word[colIndex] ?? '';
                const state = row?.result[colIndex] ?? '';
                return (
                  <div
                    key={colIndex}
                    className={`wordle-cell ${state}`}
                    role="gridcell"
                    aria-label={letter ? `${letter} ${state}` : 'empty cell'}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </section>

        <section className="wordle-input" aria-label="Wordle input">
          <form onSubmit={handleSubmit} className="wordle-form">
            <label htmlFor="guess-input">Enter a 5-letter word</label>
            <div className="wordle-form-row">
              <input
                id="guess-input"
                type="text"
                maxLength={5}
                value={currentGuess}
                onChange={(event) => setCurrentGuess(event.target.value)}
                autoComplete="off"
              />
              <button type="submit" disabled={status !== 'playing' || guesses.length >= 6}>
                Guess
              </button>
            </div>
          </form>

          <p className="wordle-status" aria-live="polite">
            {status === 'playing' && `You have ${remainingGuesses} guesses remaining.`}
            {status === 'won' && 'Nice job! You guessed the word!'}
            {status === 'lost' && `Out of guesses. The word was ${solution}.`}
          </p>
        </section>
      </main>
    </div>
  );
};

export default Wordle;