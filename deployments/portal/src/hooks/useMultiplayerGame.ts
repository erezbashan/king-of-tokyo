import { useEffect, useState } from 'react';
import { db, functions, auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import type { FlipsState, FlipsAction } from '@erez/flips';

export function useMultiplayerGame(gameId: string, gameType: string, username: string) {
  const [gameState, setGameState] = useState<FlipsState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeSnap: () => void;
    
    signInAnonymously(auth).then(async (userCredential) => {
      const uid = userCredential.user.uid;
      setMyPlayerId(uid);

      const docRef = doc(db, 'games', gameId);
      unsubscribeSnap = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.gameType === gameType) {
            setGameState(data.state as FlipsState);
          } else {
            setError(`Game type mismatch. Expected ${gameType}, got ${data.gameType}`);
          }
        } else {
          // Game doesn't exist yet! Create it.
          const createFn = httpsCallable(functions, 'createGame');
          createFn({ gameType, requestedId: gameId }).catch(e => {
            console.error("Failed to create game", e);
            setError("Failed to create game");
          });
        }
      });
    }).catch((err) => {
      console.error("Auth error", err);
      setError(err.message);
    });

    return () => {
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, [gameId, gameType]);

  // When we join, we need to dispatch JOIN_GAME if we haven't already.
  // We can do this in a separate effect once we have gameState and myPlayerId
  useEffect(() => {
    if (gameState && myPlayerId && gameState.status === 'Lobby') {
      const iAmInGame = !!gameState.players[myPlayerId];
      if (!iAmInGame) {
        dispatchToBackend({ type: 'JOIN_GAME', payload: { playerId: myPlayerId, name: username || 'Guest', isBot: false } });
      }
    }
  }, [gameState?.status, myPlayerId, username]);

  const dispatchToBackend = async (action: FlipsAction) => {
    const dispatchFn = httpsCallable(functions, 'dispatchAction');
    try {
      await dispatchFn({ gameId, gameType, action });
    } catch (e) {
      console.error("Dispatch failed", e);
    }
  };

  return { gameState, myPlayerId, dispatchToBackend, error };
}
