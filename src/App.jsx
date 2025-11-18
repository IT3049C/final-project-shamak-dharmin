import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import MemoryMatch from './games/MemoryMatch';
import ConnectFour from './games/ConnectFour';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memory-match" element={<MemoryMatch />} />
          <Route path="/connect-four" element={<ConnectFour />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
