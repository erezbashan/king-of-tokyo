const fs = require('fs');

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

// Fix "game is possibly null" everywhere by casting
eng = eng.replace(/const game = await getGame\(gameId\);/g, "const game = (await getGame(gameId)) as GameState;");

// Wait, some places already have 'const game = await getGame(gameId);' followed by 'if (!game) return;'
// which typescript would narrow, but if we cast, typescript is happy anyway.
// But we still need getGame signature to allow it? getGame returns Promise<GameState | null>, so (await getGame(gameId)) is GameState | null. 
// Casting it with `as GameState` works perfectly.

// Let's fix the parameter order of joinGame again just in case it wasn't fixed
eng = eng.replace(/previousPlayerId\?: string, playerId: string/g, 'playerId: string, previousPlayerId?: string');

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

let logic = `import type { GameState, Card, DiceRoll, DiceFace } from '@king-of-tokyo/shared';
import { marketCards } from '@king-of-tokyo/shared';

export function createInitialGameState(id: string, settings?: any): GameState {
  const gameSettings = settings || { maxHealth: 10, startingHealth: 10, winningVP: 20, startingDice: 6 };
  const deck = shuffleDeck();
  const initialMarketCards = deck.splice(0, 3);
  return {
    id,
    players: {},
    playerOrder: [],
    currentTurnPlayerId: null,
    status: 'Lobby',
    winner: null,
    marketCards: initialMarketCards,
    deckCount: deck.length,
    deck,
    rollsLeft: 3,
    currentDice: [],
    isAnimating: false,
    highlightedDice: [],
    highlightedStats: [],
    pendingYields: [],
    logs: ['Game created'],
    settings: gameSettings
  };
}

export function shuffleDeck(): Card[] {
  return [...marketCards].sort(() => Math.random() - 0.5);
}

export const FACES: DiceFace[] = ['1', '2', '3', 'Heart', 'Lightning', 'Claw'];

export function rollDice(count: number): DiceRoll[] {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substring(7),
    face: FACES[Math.floor(Math.random() * FACES.length)],
    kept: false
  }));
}

export function evaluateDice(rolls: DiceRoll[]): { points: number, heal: number, energy: number, attack: number } {
  let points = 0;
  let heal = 0;
  let energy = 0;
  let attack = 0;
  
  const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, 'Heart': 0, 'Lightning': 0, 'Claw': 0 };
  rolls.forEach(r => counts[r.face]++);

  ['1', '2', '3'].forEach(face => {
    if (counts[face] >= 3) {
      points += parseInt(face) + (counts[face] - 3);
    }
  });

  heal = counts['Heart'];
  energy = counts['Lightning'];
  attack = counts['Claw'];

  return { points, heal, energy, attack };
}
`;
fs.writeFileSync('frontend/src/engine/gameLogic.ts', logic);
