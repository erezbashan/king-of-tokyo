import type { BaseGameState, BaseAction } from '@erez/boardgame-core';
import { baseReducer, baseInitialState } from '@erez/boardgame-core';

import type { BasePlayer } from '@erez/boardgame-core';

export interface FlipsPlayer extends BasePlayer {
  score: number;
  headsCount: number;
  tailsCount: number;
  pointsHistory: number[];
}

export interface FlipsState extends BaseGameState<FlipsPlayer> {
  targetScore: number;
  lastFlipResult: { playerId: string, isHeads: boolean } | null;
}

export type FlipsAction = 
  | BaseAction
  | { type: 'FLIP_COIN', payload: { playerId: string } }
  | { type: 'SET_TARGET_SCORE', payload: { targetScore: number } };

export const initialFlipsState: FlipsState = {
  ...(baseInitialState as unknown as FlipsState),
  targetScore: 3,
  lastFlipResult: null
};

function queueBotActionsIfNeeded(state: FlipsState): FlipsState {
  if (state.status !== 'Playing') return state;
  const currentPlayerId = state.playerOrder[state.currentPlayerIndex];
  const player = state.players[currentPlayerId];
  if (!player?.isBot) return state;

  let newActionQueue = state.actionQueue || [];
  
  // Bot does the flip
  newActionQueue = [...newActionQueue, { delayMs: 1500, action: { type: 'FLIP_COIN', payload: { playerId: currentPlayerId } } }];
  
  // Random chatter logic
  const humanSpoke = state.chatMessages.some((m: any) => !state.players[m.sender]?.isBot);
  if (!humanSpoke && Math.random() > 0.7) {
    const msgs = ["I'm feeling lucky!", "Tails never fails...", "Beep boop, calculating flip...", "You humans stand no chance!"];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    newActionQueue = [...newActionQueue, { delayMs: 0, action: { type: 'SEND_CHAT_MESSAGE', payload: { sender: player.name, text: msg, color: player.color } } }];
  }

  return { ...state, actionQueue: newActionQueue };
}

export function flipsReducer(state: FlipsState, action: FlipsAction): FlipsState {
  // Pass to base reducer first to handle JOIN_GAME, START_GAME, NEW_GAME, SEND_CHAT_MESSAGE
  let newState = baseReducer(state, action) as FlipsState;
  
  if (newState !== state) {
    // If a new player joined, we need to initialize their Flips-specific fields
    if (action.type === 'JOIN_GAME') {
      const playerId = action.payload.playerId;
      const basePlayer = newState.players[playerId];
      if (basePlayer && !('score' in basePlayer)) {
        newState = {
          ...newState,
          players: {
            ...newState.players,
            [playerId]: {
              ...(basePlayer as any),
              score: 0,
              headsCount: 0,
              tailsCount: 0,
              pointsHistory: [0]
            }
          }
        };
      }
    }
    
    // If game started, clear the last flip result graphic and trigger bot if needed
    if (action.type === 'START_GAME') {
      newState = { ...newState, lastFlipResult: null };
      newState = queueBotActionsIfNeeded(newState);
    }
    
    // If new game, reset player points
    if (action.type === 'NEW_GAME') {
      const resetPlayers: Record<string, FlipsPlayer> = {};
      Object.keys(newState.players).forEach(pId => {
        resetPlayers[pId] = { 
          ...newState.players[pId], 
          score: 0, 
          headsCount: 0, 
          tailsCount: 0, 
          pointsHistory: [0] 
        } as FlipsPlayer;
      });
      newState = { ...newState, lastFlipResult: null, players: resetPlayers };
    }

    return newState;
  }

  // Handle Flips-specific actions
  switch (action.type) {
    case 'SET_TARGET_SCORE': {
      if (state.status !== 'Lobby') return state;
      return { ...state, targetScore: action.payload.targetScore };
    }
    case 'FLIP_COIN': {
      if (state.status !== 'Playing') return state;
      if (state.playerOrder[state.currentPlayerIndex] !== action.payload.playerId) return state;

      const player = state.players[action.payload.playerId];
      const isHeads = Math.random() > 0.5;
      const newScore = player.score + (isHeads ? 1 : 0);
      
      const newPlayerState = {
        ...player,
        score: newScore,
        headsCount: player.headsCount + (isHeads ? 1 : 0),
        tailsCount: player.tailsCount + (isHeads ? 0 : 1),
        pointsHistory: [...player.pointsHistory, newScore]
      };

      // Pad others
      const updatedPlayers = { ...state.players, [action.payload.playerId]: newPlayerState };
      for (const pId of state.playerOrder) {
        if (pId !== action.payload.playerId) {
          updatedPlayers[pId] = {
            ...updatedPlayers[pId],
            pointsHistory: [...updatedPlayers[pId].pointsHistory, updatedPlayers[pId].score]
          };
        }
      }

      const hasWon = newScore >= state.targetScore;
      let newStatus = state.status;
      let newWinnerId = state.winnerId;

      if (hasWon) {
        newStatus = 'Finished' as any;
        newWinnerId = action.payload.playerId;
      }

      const logMessage = `${player.name} flipped ${isHeads ? 'Heads' : 'Tails'}!`;

      return queueBotActionsIfNeeded({
        ...state,
        players: updatedPlayers,
        status: newStatus,
        winnerId: newWinnerId,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerOrder.length,
        lastFlipResult: { playerId: action.payload.playerId, isHeads },
        logs: [...state.logs, logMessage]
      });
    }
    default:
      return state;
  }
}
