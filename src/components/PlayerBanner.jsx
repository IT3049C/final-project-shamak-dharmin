import { usePlayer } from '../context/PlayerContext';
import './PlayerBanner.css';

const PlayerBanner = () => {
  const { playerName } = usePlayer();

  if (!playerName) return null;

  return (
    <div className="player-banner" aria-label="Current player">
      <span className="player-banner-label">Player:</span>
      <span className="player-banner-name">{playerName}</span>
    </div>
  );
};

export default PlayerBanner;