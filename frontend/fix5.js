const fs = require('fs');

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

// Rewrite getGame to return GameState and throw if not found
eng = eng.replace(/export async function getGame\(gameId: string\): Promise<GameState \| null> \{[\s\S]*?return null;\n\}/g, `export async function getGame(gameId: string): Promise<GameState> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  if (data) return data as GameState;
  throw new Error("Game not found");
}`);

// Since getGame now throws, we can remove the "if (!game) return;" checks
eng = eng.replace(/if \(!game\) return;/g, "");

// Fix parameter order in joinGame
eng = eng.replace(/previousPlayerId\?: string, playerId: string/g, "playerId: string, previousPlayerId?: string");

// Fix unused variables in joinGame, returnToLobby, addBot, quitGame, resolveDice
// addBot(gameId: string, playerId: string)
// The user said to export them properly, we can just remove unused playerId where it's not read
eng = eng.replace(/export async function addBot\(gameId: string, playerId: string\)/g, "export async function addBot(gameId: string)");
eng = eng.replace(/export async function returnToLobby\(gameId: string, playerId: string\)/g, "export async function returnToLobby(gameId: string)");

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

let logic = fs.readFileSync('frontend/src/engine/gameLogic.ts', 'utf8');
logic = logic.replace(/import type \{ GameState, Card, DiceRoll, DiceFace, Player, PlayerId \} from '@king-of-tokyo\/shared';/g, "import type { GameState, Card, DiceRoll, DiceFace } from '@king-of-tokyo/shared';");
logic = logic.replace(/Player, /g, "");
logic = logic.replace(/PlayerId, /g, "");
logic = logic.replace(/MAX_HEALTH, /g, "");
logic = logic.replace(/WIN_VP, /g, "");
fs.writeFileSync('frontend/src/engine/gameLogic.ts', logic);

