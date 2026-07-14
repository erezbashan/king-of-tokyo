const fs = require('fs');

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

// replace getGame
const searchStr = `export async function getGame(gameId: string): Promise<GameState | null> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return data ? (data as GameState) : null;
  }
  return null;
}`;
const replaceStr = `export async function getGame(gameId: string): Promise<GameState> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  if (data) return data as GameState;
  throw new Error("Game not found");
}`;

if (eng.includes(searchStr)) {
  eng = eng.replace(searchStr, replaceStr);
} else {
  console.log("Could not find searchStr");
}

// Fix joinGame
eng = eng.replace(/previousPlayerId\?: string, playerId: string/g, 'playerId: string, previousPlayerId?: string');

// Fix addBot
eng = eng.replace(/export async function addBot\(gameId: string, playerId: string\)/g, 'export async function addBot(gameId: string)');

// Fix returnToLobby
eng = eng.replace(/export async function returnToLobby\(gameId: string, playerId: string\)/g, 'export async function returnToLobby(gameId: string)');

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

// Fix gameLogic.ts
let logic = fs.readFileSync('frontend/src/engine/gameLogic.ts', 'utf8');
logic = logic.replace(/import type \{ GameState, Card, DiceRoll, DiceFace, Player, PlayerId \} from '@king-of-tokyo\/shared';/g, "import type { GameState, Card, DiceRoll, DiceFace } from '@king-of-tokyo/shared';");
logic = logic.replace(/import \{ MAX_HEALTH, WIN_VP, marketCards \} from '@king-of-tokyo\/shared';/g, "import { marketCards } from '@king-of-tokyo/shared';");

// if not found the above exact matches, do regex
logic = logic.replace(/\bPlayer,\s*/g, '');
logic = logic.replace(/\bPlayerId,\s*/g, '');
logic = logic.replace(/\bMAX_HEALTH,\s*/g, '');
logic = logic.replace(/\bWIN_VP,\s*/g, '');

fs.writeFileSync('frontend/src/engine/gameLogic.ts', logic);
