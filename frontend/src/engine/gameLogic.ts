import { GameState, Player, Card, DiceRoll, DiceFace, PlayerId, MAX_HEALTH, WIN_VP, marketCards } from '@king-of-tokyo/shared';

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

  // Points for numbers
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
