import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://game-room-api.fly.dev/api/rooms';

export const useGameRoom = (pollInterval = 2000) => {
    const [roomId, setRoomId] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Create a new room
    const createRoom = async (initialState) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initialState }),
            });
            if (!response.ok) throw new Error('Failed to create room');
            const data = await response.json();
            setRoomId(data.roomId);
            setGameState(data.gameState);
            return data.roomId;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Join an existing room
    const joinRoom = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Room not found');
            const data = await response.json();
            setRoomId(data.id);
            setGameState(data.gameState);
            return data.gameState;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Update game state
    const updateGameState = async (newState) => {
        if (!roomId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${roomId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameState: newState }),
            });
            if (!response.ok) throw new Error('Failed to update game state');
            const data = await response.json();
            setGameState(data.gameState);
        } catch (err) {
            setError(err.message);
        }
    };

    // Poll for updates
    useEffect(() => {
        if (!roomId) return;

        const fetchState = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${roomId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Only update if state has actually changed to avoid unnecessary re-renders
                    // Simple JSON stringify comparison for now
                    setGameState(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(data.gameState)) {
                            return data.gameState;
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        const intervalId = setInterval(fetchState, pollInterval);
        return () => clearInterval(intervalId);
    }, [roomId, pollInterval]);

    const resetRoom = useCallback(() => {
        setRoomId(null);
        setGameState(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        roomId,
        gameState,
        error,
        isLoading,
        createRoom,
        joinRoom,
        updateGameState,
        resetRoom
    };
};
