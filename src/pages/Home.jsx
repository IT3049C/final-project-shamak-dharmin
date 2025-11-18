import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <ThemeToggle />
      <div className="home-container">
        <h1 className="title">🎮 GameHub</h1>
        <p className="subtitle">Choose your game and start playing!</p>
        
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
          
          <div className="game-card coming-soon">
            <div className="game-icon">💣</div>
            <h2>Minesweeper</h2>
            <p>Coming Soon!</p>
            <span className="badge">In Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
