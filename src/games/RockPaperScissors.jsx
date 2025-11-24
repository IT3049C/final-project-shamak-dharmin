import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
import './RockPaperScissors.css';

const CHOICES = ['rock', 'paper', 'scissors'];

const getResult = (player, cpu) => {
  if (player === cpu) return 'draw';
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'paper' && cpu === 'rock') ||
    (player === 'scissors' && cpu === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
};

const RockPaperScissors = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });

  const handleBackHome = () => {
    navigate('/');
  };

  const handlePlay = (choice) => {
    const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const outcome = getResult(choice, cpu);

    setPlayerChoice(choice);
    setCpuChoice(cpu);
    setResult(outcome);

    setScore((prev) => ({
      wins: prev.wins + (outcome === 'win' ? 1 : 0),
      losses: prev.losses + (outcome === 'lose' ? 1 : 0),
      draws: prev.draws + (outcome === 'draw' ? 1 : 0),
    }));
  };

  const handleReset = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
    setScore({ wins: 0, losses: 0, draws: 0 });
  };

  const resultMessage =
    result === 'win'
      ? 'You win!'
      : result === 'lose'
      ? 'You lose!'
      : result === 'draw'
      ? "It's a draw."
      : 'Make your move!';

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  return (
    <div className="rps">
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
          <h1>Rock Paper Scissors</h1>
        </div>
        <div className="game-controls">
          <button type="button" onClick={handleReset} aria-label="Reset Rock Paper Scissors game">
            Reset
          </button>
        </div>
      </div>

      <main className="rps-main">
        <section className="rps-choices" aria-label="Your move">
          <h2>Choose your move</h2>
          <div className="rps-buttons">
            {CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => handlePlay(choice)}
                className={playerChoice === choice ? 'selected' : ''}
              >
                {choice.charAt(0).toUpperCase() + choice.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="rps-status" aria-label="Game status">
          <p className="rps-result">{resultMessage}</p>
          <div className="rps-round">
            <div>
              <h3>You</h3>
              <p className="rps-choice">{playerChoice ?? '-'}</p>
            </div>
            <div>
              <h3>Computer</h3>
              <p className="rps-choice">{cpuChoice ?? '-'}</p>
            </div>
          </div>

          <div className="rps-score" aria-label="Scoreboard">
            <p>Wins: {score.wins}</p>
            <p>Losses: {score.losses}</p>
            <p>Draws: {score.draws}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RockPaperScissors;