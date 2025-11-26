import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import ThemeToggle from './ThemeToggle';
import './GameLayout.css';

const GameLayout = ({ title, children, onReset, score, controls }) => {
    const navigate = useNavigate();
    const { playerName, playerAvatar } = usePlayer();

    return (
        <div className="game-layout">
            <header className="game-header glass-panel">
                <div className="header-left">
                    <button onClick={() => navigate('/')} className="btn-secondary back-btn">
                        <span className="icon">←</span> Back
                    </button>
                </div>

                <div className="header-center">
                    <h1 className="game-title text-gradient">{title}</h1>
                </div>

                <div className="header-right">
                    <div className="player-badge glass-card">
                        {playerAvatar && (
                            <img src={playerAvatar.image} alt="Avatar" className="avatar-mini" />
                        )}
                        <span className="player-name">{playerName || 'Player'}</span>
                    </div>
                    <ThemeToggle />
                    <button onClick={() => navigate('/')} className="btn-secondary logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            <main className="game-content animate-fade-in">
                {children}
            </main>

            <footer className="game-footer glass-panel">
                <div className="game-controls">
                    {onReset && (
                        <button onClick={onReset} className="btn-primary reset-btn">
                            Restart Game
                        </button>
                    )}
                    {controls}
                </div>
                {score !== undefined && (
                    <div className="score-display glass-card">
                        <span className="score-label">Score</span>
                        <span className="score-value">{score}</span>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default GameLayout;
