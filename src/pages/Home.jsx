import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

const Home = () => {
  const { playerName, logout } = usePlayer();



  return (
    <div className="home-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <header className="home-header glass-panel">
        <div className="brand">
          <h1 className="title text-gradient">GameHub</h1>
          <p className="subtitle">Your premium gaming destination</p>
        </div>
        <div className="header-controls">
          {playerName && (
            <div className="player-welcome animate-fade-in">
              <span>Hi, <span className="text-accent">{playerName}</span></span>
              <button onClick={logout} className="btn-secondary logout-btn">Logout</button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="home-main">
        {/* Player Profile section removed as requested */}


        <div className="games-grid">
          <Link to="/memory-match" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">🃏</div>
              <h3>Memory Match</h3>
              <p>Test your memory skills</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/connect-four" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">🔴</div>
              <h3>Connect Four</h3>
              <p>Strategy & planning</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/wordle" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">🧩</div>
              <h3>Wordle</h3>
              <p>Daily word puzzle</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/typing-speed" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">⌨️</div>
              <h3>Typing Speed</h3>
              <p>Test your WPM</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/prime-rush" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">🔢</div>
              <h3>Prime Rush</h3>
              <p>Math reflexes</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/pattern-lock" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">🔒</div>
              <h3>Pattern Lock</h3>
              <p>Memory challenge</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/rock-paper-scissors" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">✊</div>
              <h3>RPS Duel</h3>
              <p>Classic battle</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/tic-tac-toe" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">❌</div>
              <h3>Tic Tac Toe</h3>
              <p>3x3 grid classic</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>

          <Link to="/quick-draw" className="game-card glass-card">
            <div className="card-content">
              <div className="game-icon">⚡</div>
              <h3>Quick Draw</h3>
              <p>Reaction time</p>
            </div>
            <div className="card-action">Play Now →</div>
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <p>Developed by Shamak Patel & Dharmin Patel</p>
      </footer>
    </div>
  );
};

export default Home;
