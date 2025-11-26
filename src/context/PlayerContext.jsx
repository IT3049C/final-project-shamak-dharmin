import { createContext, useContext, useState, useEffect } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('game_player');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (player) {
      localStorage.setItem('game_player', JSON.stringify(player));
    } else {
      localStorage.removeItem('game_player');
    }
  }, [player]);

  const login = (playerData) => {
    setPlayer(playerData);
  };

  const logout = () => {
    setPlayer(null);
  };

  return (
    <PlayerContext.Provider value={{
      player,
      login,
      logout,
      // Keep these for backward compatibility if needed, or better yet, update consumers
      playerName: player?.name || '',
      playerAvatar: player?.avatar || null,
      setPlayerName: (name) => setPlayer(prev => ({ ...prev, name })) // Partial update if needed
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};