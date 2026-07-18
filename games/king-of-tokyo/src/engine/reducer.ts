import type { BaseGameState, BaseAction } from '@erez/boardgame-core';
import { baseReducer, baseInitialState, withBotChatter } from '@erez/boardgame-core';
import type { BasePlayer } from '@erez/boardgame-core';

export type DiceFace = '1' | '2' | '3' | 'Energy' | 'Heart' | 'Smash';

export interface KotDice {
  id: string; // To track them stably in UI
  value: DiceFace;
  kept: boolean;
}

export interface KotPlayer extends BasePlayer {
  health: number;
  vp: number;
  energy: number;
  location: 'Outside' | 'TokyoCity';
}

export interface KotState extends BaseGameState<KotPlayer> {
  dice: KotDice[];
  rollCount: number;
}

export type KotAction = 
  | BaseAction
  | { type: 'ROLL_DICE', payload: { playerId: string } }
  | { type: 'TOGGLE_KEEP_DICE', payload: { playerId: string, diceId: string } }
  | { type: 'RESOLVE_DICE', payload: { playerId: string } };

export const initialKotState: KotState = {
  ...(baseInitialState as unknown as KotState),
  dice: [
    { id: 'd1', value: '1', kept: false },
    { id: 'd2', value: '2', kept: false },
    { id: 'd3', value: '3', kept: false },
    { id: 'd4', value: 'Energy', kept: false },
    { id: 'd5', value: 'Heart', kept: false },
    { id: 'd6', value: 'Smash', kept: false },
  ],
  rollCount: 0
};

const DICE_FACES: DiceFace[] = ['1', '2', '3', 'Energy', 'Heart', 'Smash'];

function queueBotActionsIfNeeded(state: KotState): KotState {
  if (state.status !== 'Playing') return state;
  const currentPlayerId = state.playerOrder[state.currentPlayerIndex];
  const player = state.players[currentPlayerId];
  if (!player?.isBot) return state;

  let newActionQueue = state.actionQueue || [];
  
  if (state.rollCount < 3) {
    newActionQueue = [...newActionQueue, { delayMs: 1500, action: { type: 'ROLL_DICE', payload: { playerId: currentPlayerId } } }];
  } else {
    newActionQueue = [...newActionQueue, { delayMs: 1500, action: { type: 'RESOLVE_DICE', payload: { playerId: currentPlayerId } } }];
  }

  const botState = { ...state, actionQueue: newActionQueue };
  
  // Only chatter on first roll
  if (state.rollCount === 0) {
    const msgs = ["RAWR!", "Tokyo will be MINE!", "Feel my wrath!", "Smash everything!"];
    return withBotChatter(botState, currentPlayerId, msgs);
  }
  
  return botState;
}

export function kingOfTokyoReducer(state: KotState, action: KotAction): KotState {
  let newState = baseReducer(state, action) as KotState;
  
  if (newState !== state) {
    if (action.type === 'JOIN_GAME') {
      const playerId = action.payload.playerId;
      const basePlayer = newState.players[playerId];
      if (basePlayer && !('health' in basePlayer)) {
        newState = {
          ...newState,
          players: {
            ...newState.players,
            [playerId]: {
              ...(basePlayer as any),
              health: 10,
              vp: 0,
              energy: 0,
              location: 'Outside'
            }
          }
        };
      }
    }
    
    if (action.type === 'START_GAME') {
      newState = { 
        ...newState, 
        rollCount: 0,
        dice: newState.dice.map(d => ({ ...d, kept: false }))
      };
      newState = queueBotActionsIfNeeded(newState);
    }
    
    if (action.type === 'NEW_GAME') {
      const resetPlayers: Record<string, KotPlayer> = {};
      Object.keys(newState.players).forEach(pId => {
        resetPlayers[pId] = { 
          ...newState.players[pId], 
          health: 10,
          vp: 0,
          energy: 0,
          location: 'Outside'
        } as KotPlayer;
      });
      newState = { 
        ...newState, 
        rollCount: 0, 
        players: resetPlayers,
        dice: newState.dice.map(d => ({ ...d, kept: false }))
      };
    }

    return newState;
  }

  switch (action.type) {
    case 'ROLL_DICE': {
      if (state.status !== 'Playing') return state;
      if (state.playerOrder[state.currentPlayerIndex] !== action.payload.playerId) return state;
      if (state.rollCount >= 3) return state;

      const newDice = state.dice.map(d => {
        if (d.kept) return d;
        const randomFace = DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
        return { ...d, value: randomFace };
      });

      const finalState = {
        ...state,
        dice: newDice,
        rollCount: state.rollCount + 1
      };

      return queueBotActionsIfNeeded(finalState);
    }
    case 'RESOLVE_DICE': {
      if (state.status !== 'Playing') return state;
      if (state.playerOrder[state.currentPlayerIndex] !== action.payload.playerId) return state;

      const player = state.players[action.payload.playerId];
      
      // Calculate outcome string
      const outcomeMap: Record<string, number> = {};
      state.dice.forEach(d => { outcomeMap[d.value] = (outcomeMap[d.value] || 0) + 1; });
      const outcomeStr = Object.entries(outcomeMap).map(([face, count]) => `${count}x ${face}`).join(', ');
      
      const logMessage = `${player.name} resolved: ${outcomeStr}.`;

      const finalState: KotState = {
        ...state,
        rollCount: 0,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerOrder.length,
        dice: state.dice.map(d => ({ ...d, kept: false })),
        logs: [...state.logs, logMessage]
      };

      return queueBotActionsIfNeeded(finalState);
    }
    case 'TOGGLE_KEEP_DICE': {
      if (state.status !== 'Playing') return state;
      if (state.playerOrder[state.currentPlayerIndex] !== action.payload.playerId) return state;
      if (state.rollCount === 0 || state.rollCount >= 3) return state;

      const newDice = state.dice.map(d => 
        d.id === action.payload.diceId ? { ...d, kept: !d.kept } : d
      );

      return { ...state, dice: newDice };
    }
    default:
      return state;
  }
}
