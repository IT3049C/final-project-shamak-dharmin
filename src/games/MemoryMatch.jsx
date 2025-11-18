import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import ThemeToggle from '../components/ThemeToggle';
import './MemoryMatch.css';

const cardSymbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

const MemoryMatch = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game when player is selected
  useEffect(() => {
    if (player) {
      initializeGame();
    }
  }, [player]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      if (cards[first]?.symbol === cards[second]?.symbol) {
        // Match found
        setMatchedCards(prev => [...prev, first, second]);
        setFlippedCards([]);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check for win condition
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matchedCards, cards]);

  const initializeGame = () => {
    // Create pairs and shuffle using Fisher-Yates
    const pairs = [...cardSymbols, ...cardSymbols];
    const shuffled = shuffleArray(pairs);
    const gameCards = shuffled.map((symbol, index) => ({
      id: index,
      symbol
    }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleCardClick = (index) => {
    // Prevent clicking if already flipped, matched, or two cards are showing
    if (
      flippedCards.includes(index) ||
      matchedCards.includes(index) ||
      flippedCards.length === 2
    ) {
      return;
    }
    
    setFlippedCards(prev => [...prev, index]);
  };

  const handleReset = () => {
    initializeGame();
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (!player) {
    return <AvatarSelector onSelect={setPlayer} />;
  }

  return (
    <div className="memory-match">
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

        <div className="game-stats">
          <span className="stat">Moves: {moves}</span>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card, index) => {
          const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
          
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">★</div>
                <div className="card-back">{card.symbol}</div>
              </div>
            </div>
          );
        })}
      </div>

      {gameWon && (
        <div className="modal-overlay">
          <div className="win-modal">
            <h2>🎉 Congratulations!</h2>
            <p>You won in {moves} moves!</p>
            <div className="modal-buttons">
              <button onClick={handleReset}>Play Again</button>
              <button onClick={handleBackHome}>Back to Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
