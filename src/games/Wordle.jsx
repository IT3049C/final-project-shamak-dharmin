import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './Wordle.css';

const WORDS = ['APPLE', 'BRICK', 'GHOST', 'LIGHT', 'PLANT', 'ROBOT', 'SMILE', 'TRACK', 'WATER', 'ZEBRA'];

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
  const { playerName } = usePlayer();
  const [solution, setSolution] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]); // { word, result }[]
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  const remainingGuesses = useMemo(() => 6 - guesses.length, [guesses.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status !== 'playing') return;

    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== 5) return;

    if (!WORDS.includes(guess)) {
      // Simple validation: require guess to be in list
      alert('Please enter a valid 5-letter word from the game dictionary.');
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

  return (
    <div className="wordle">
      <ThemeToggle />
      <div className="game-header">
        <button className="back-button" onClick={handleBackHome}>
          10 Back
        </button>
        <div className="game-title">
          <h1>Wordle</h1>
          {playerName && <p className="player-tag">Playing as {playerName}</p>}
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