import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import MemoryMatch from './games/MemoryMatch';
import ConnectFour from './games/ConnectFour';
import Wordle from './games/Wordle';
import TypingSpeed from './games/TypingSpeed';
import PrimeRush from './games/PrimeRush';
import PatternLock from './games/PatternLock';
import RockPaperScissors from './games/RockPaperScissors';
import TicTacToe from './games/TicTacToe';
import QuickDraw from './games/QuickDraw';
import PlayerBanner from './components/PlayerBanner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <PlayerBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memory-match" element={<MemoryMatch />} />
            <Route path="/connect-four" element={<ConnectFour />} />
            <Route path="/wordle" element={<Wordle />} />
            <Route path="/typing-speed" element={<TypingSpeed />} />
            <Route path="/prime-rush" element={<PrimeRush />} />
            <Route path="/pattern-lock" element={<PatternLock />} />
            <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/quick-draw" element={<QuickDraw />} />
          </Routes>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
