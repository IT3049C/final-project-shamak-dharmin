import { useState } from 'react';
import { avatars } from '../assets/avatars/avatarData.js';
import './AvatarSelector.css';

const AvatarSelector = ({ onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [playerName, setPlayerName] = useState('');

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleStart = () => {
    if (selectedAvatar && playerName.trim()) {
      onSelect({
        avatar: selectedAvatar,
        name: playerName.trim()
      });
    }
  };

  return (
    <div className="avatar-selector">
      <h2>Choose Your Avatar</h2>
      
      <div className="avatar-grid">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            className={`avatar-option ${selectedAvatar?.id === avatar.id ? 'selected' : ''}`}
            onClick={() => handleSelect(avatar)}
          >
            <img 
              src={avatar.image} 
              alt={avatar.name} 
              className="avatar-image"
            />
            <span className="avatar-name">{avatar.name}</span>
          </button>
        ))}
      </div>

      <div className="player-name-section">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          className="player-name-input"
        />
      </div>

      <button
        className="start-button"
        onClick={handleStart}
        disabled={!selectedAvatar || !playerName.trim()}
      >
        Start Playing
      </button>
    </div>
  );
};

export default AvatarSelector;
