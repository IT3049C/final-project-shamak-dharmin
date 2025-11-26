import { useState, useEffect } from 'react';
import GameLayout from '../components/GameLayout';
import './MemoryMatch.css';
import { usePlayer } from '../context/PlayerContext'; // Assuming this path
import AvatarSelector from '../components/AvatarSelector'; // Assuming this path

const cardSymbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

const MemoryMatch = () => {
  const { player, login } = usePlayer();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Keep flippedCards state as its removal would break other logic not covered by the diff
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

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
    if (cards.length > 0 && matchedCards.length === cards.length) {
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

  if (!player) {
    return <AvatarSelector onSelect={login} />;
  }

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

  return (
    <GameLayout
      title="Memory Match"
      onReset={initializeGame}
      score={moves}
    >
      <div className="memory-match-container">
        <div className="memory-board glass-panel">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            const isMatched = matchedCards.includes(index);

            return (
              <div
                key={card.id}
                className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front"></div>
                  <div className="card-back">{card.symbol}</div>
                </div>
              </div>
            );
          })}
        </div>

        {gameWon && (
          <div className="win-overlay glass-card animate-fade-in">
            <h2>🎉 Congratulations!</h2>
            <p>You won in <span className="text-accent">{moves}</span> moves!</p>
            <button onClick={initializeGame} className="btn-primary">Play Again</button>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default MemoryMatch;
