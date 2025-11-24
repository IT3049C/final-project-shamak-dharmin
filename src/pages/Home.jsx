import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

const Home = () => {
  const { playerName, setPlayerName } = usePlayer();

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <div className="home">
      <ThemeToggle />
      <div className="home-container">
        <h1 className="title">🎮 GameHub</h1>
        <p className="developer-name">Developed by Shamak Patel &amp; Dharmin Patel</p>
        <p className="subtitle">Choose your game and start playing!</p>

        <section className="player-setup" aria-label="Player setup">
          <label htmlFor="player-name-input" className="player-label">
            Player name
          </label>
          <input
            id="player-name-input"
            type="text"
            maxLength={20}
            value={playerName}
            onChange={handleNameChange}
            placeholder="Enter your name to use across all games"
            className="player-input"
          />
          {playerName && (
            <p className="player-greeting">Welcome, {playerName}! Your name will appear in every game.</p>
          )}
        </section>
        
        <div className="games-grid">
          <Link to="/memory-match" className="game-card">
            <div className="game-icon">🃏</div>
            <h2>Memory Match</h2>
            <p>Find matching pairs of cards</p>
          </Link>
          
          <Link to="/connect-four" className="game-card">
            <div className="game-icon">🔴</div>
            <h2>Connect Four</h2>
            <p>Connect 4 pieces in a row</p>
          </Link>

          <Link to="/wordle" className="game-card">
            <div className="game-icon">🧩</div>
            <h2>Wordle</h2>
            <p>Guess the 5-letter word in 6 tries</p>
          </Link>

          <Link to="/typing-speed" className="game-card">
            <div className="game-icon">⌨️</div>
            <h2>Typing Speed Test</h2>
            <p>Type the sentence as fast and accurately as you can</p>
          </Link>

          <Link to="/prime-rush" className="game-card">
            <div className="game-icon">🔢</div>
            <h2>Prime Rush</h2>
            <p>Decide fast: is the number prime or not?</p>
          </Link>

          <Link to="/pattern-lock" className="game-card">
            <div className="game-icon">🔒</div>
            <h2>Pattern Lock</h2>
            <p>Memorize and reproduce secret lock patterns</p>
          </Link>

          <Link to="/rock-paper-scissors" className="game-card">
            <div className="game-icon">✊</div>
            <h2>Rock Paper Scissors</h2>
            <p>Classic duel vs. computer with score tracking</p>
          </Link>

          <Link to="/tic-tac-toe" className="game-card">
            <div className="game-icon">❌</div>
            <h2>Tic Tac Toe</h2>
            <p>Classic 3×3 grid game with win detection</p>
          </Link>

          <Link to="/quick-draw" className="game-card">
            <div className="game-icon">⚡</div>
            <h2>Quick Draw</h2>
            <p>Fast-paced multiplayer emoji guessing game</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
