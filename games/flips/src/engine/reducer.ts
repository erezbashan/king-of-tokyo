export interface FlipsPlayer {
  id: string;
  name: string;
  isBot: boolean;
  score: number;
  headsCount: number;
  tailsCount: number;
  pointsHistory: number[];
}

export interface FlipsState {
  status: 'Lobby' | 'Playing' | 'Finished';
  targetScore: number;
  players: Record<string, FlipsPlayer>;
  playerOrder: string[];
  currentPlayerIndex: number;
  winnerId: string | null;
  lastFlipResult: { playerId: string, isHeads: boolean } | null;
}

export type FlipsAction = 
  | { type: 'JOIN_GAME', payload: { playerId: string, name: string, isBot: boolean } }
  | { type: 'START_GAME', payload: { targetScore: number } }
  | { type: 'SET_TARGET_SCORE', payload: { targetScore: number } }
  | { type: 'FLIP_COIN', payload: { playerId: string, isHeads: boolean } }
  | { type: 'NEW_GAME' }

export function flipsReducer(state: FlipsState, action: FlipsAction): FlipsState {
  switch (action.type) {
    case 'JOIN_GAME': {
      if (state.status !== 'Lobby') return state;
      if (state.players[action.payload.playerId]) return state; // Already joined
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.playerId]: {
            id: action.payload.playerId,
            name: action.payload.name,
            isBot: action.payload.isBot,
            score: 0,
            headsCount: 0,
            tailsCount: 0,
            pointsHistory: [0]
          }
        },
        playerOrder: [...state.playerOrder, action.payload.playerId]
      };
    }
    
    case 'START_GAME': {
      if (state.status !== 'Lobby' || state.playerOrder.length === 0) return state;
      return {
        ...state,
        status: 'Playing',
        targetScore: action.payload.targetScore,
        currentPlayerIndex: 0
      };
    }

    case 'SET_TARGET_SCORE': {
      if (state.status !== 'Lobby') return state;
      return {
        ...state,
        targetScore: action.payload.targetScore
      };
    }
    
    case 'FLIP_COIN': {
      if (state.status !== 'Playing') return state;
      if (state.playerOrder[state.currentPlayerIndex] !== action.payload.playerId) return state;

      const player = state.players[action.payload.playerId];
      const newScore = player.score + (action.payload.isHeads ? 1 : 0);
      
      const newPlayerState = {
        ...player,
        score: newScore,
        headsCount: player.headsCount + (action.payload.isHeads ? 1 : 0),
        tailsCount: player.tailsCount + (action.payload.isHeads ? 0 : 1),
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

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerOrder.length,
        status: hasWon ? 'Finished' : 'Playing',
        winnerId: hasWon ? action.payload.playerId : null,
        lastFlipResult: {
          playerId: action.payload.playerId,
          isHeads: action.payload.isHeads
        }
      };
    }

    case 'NEW_GAME': {
      const resetPlayers: Record<string, FlipsPlayer> = {};
      for (const pId of state.playerOrder) {
        resetPlayers[pId] = {
          ...state.players[pId],
          score: 0,
          headsCount: 0,
          tailsCount: 0,
          pointsHistory: [0]
        };
      }
      return {
        ...state,
        status: 'Lobby',
        players: resetPlayers,
        currentPlayerIndex: 0,
        winnerId: null,
        lastFlipResult: null
      };
    }
    
    default:
      return state;
  }
}

export const initialFlipsState: FlipsState = {
  status: 'Lobby',
  targetScore: 5,
  players: {},
  playerOrder: [],
  currentPlayerIndex: 0,
  winnerId: null,
  lastFlipResult: null
};
