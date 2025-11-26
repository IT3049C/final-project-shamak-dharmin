import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import AvatarSelector from '../components/AvatarSelector';
import { usePlayer } from '../context/PlayerContext';
import './RockPaperScissors.css';

const CHOICES = [
  { id: 'rock', emoji: '✊', label: 'Rock' },
  { id: 'paper', emoji: '✋', label: 'Paper' },
  { id: 'scissors', emoji: '✌️', label: 'Scissors' }
];

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
  const navigate = useNavigate(); // Added line
  const { player, login } = usePlayer(); // Added line
  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });

  const handlePlay = (choiceId) => {
    const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
    const outcome = getResult(choiceId, cpu);

    setPlayerChoice(choiceId);
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

  const getEmoji = (id) => CHOICES.find(c => c.id === id)?.emoji;

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

  return (
    <GameLayout
      title="Rock Paper Scissors"
      onReset={handleReset}
    >
      <div className="rps-container">
        <div className="scoreboard glass-card">
          <div className="score-item">
            <span className="label">Wins</span>
            <span className="value text-accent">{score.wins}</span>
          </div>
          <div className="score-item">
            <span className="label">Draws</span>
            <span className="value">{score.draws}</span>
          </div>
          <div className="score-item">
            <span className="label">Losses</span>
            <span className="value">{score.losses}</span>
          </div>
        </div>

        <div className="battle-arena glass-panel">
          <div className="fighter">
            <h3>You</h3>
            <div className={`fighter-choice ${result === 'win' ? 'winner' : ''}`}>
              {playerChoice ? getEmoji(playerChoice) : '❓'}
            </div>
          </div>

          <div className="vs">VS</div>

          <div className="fighter">
            <h3>CPU</h3>
            <div className={`fighter-choice ${result === 'lose' ? 'winner' : ''}`}>
              {cpuChoice ? getEmoji(cpuChoice) : '❓'}
            </div>
          </div>
        </div>

        <div className="result-display">
          {result && (
            <h2 className={`animate-fade-in ${result}`}>
              {result === 'win' && '🎉 You Win!'}
              {result === 'lose' && '💀 You Lose!'}
              {result === 'draw' && '🤝 It\'s a Draw!'}
            </h2>
          )}
          {!result && <h2>Choose your weapon</h2>}
        </div>

        <div className="choices-grid">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              className={`choice-btn glass-card ${playerChoice === choice.id ? 'selected' : ''}`}
              onClick={() => handlePlay(choice.id)}
            >
              <span className="emoji">{choice.emoji}</span>
              <span className="label">{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
};

export default RockPaperScissors;