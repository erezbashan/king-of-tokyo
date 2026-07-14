const fs = require('fs');

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

// Fix startTurn
eng = eng.replace(/export async function startTurn\(gameId: string, playerId: string\) \{\n  const game = await getGame\(gameId\);\n  \n  \n  \n  const p = game\.players\[playerId\];/g, "export async function startTurn(gameId: string, playerId: string) {\n  const game = await getGame(gameId);\n  if (!game) return;\n  \n  const p = game.players[playerId];");

// Fix endTurnAutomatically
eng = eng.replace(/export async function endTurnAutomatically\(gameId: string, playerId: string\) \{\n  const game = await getGame\(gameId\);\n  \n  \n  \n  if \(!game\.history\)/g, "export async function endTurnAutomatically(gameId: string, playerId: string) {\n  const game = await getGame(gameId);\n  if (!game) return;\n  \n  if (!game.history)");

// Fix resolveDiceAutomatically
eng = eng.replace(/export async function resolveDiceAutomatically\(gameId: string, playerId: string\) \{\n  const game = await getGame\(gameId\);\n  \n  \n  game\.rollsLeft = 0;/g, "export async function resolveDiceAutomatically(gameId: string, playerId: string) {\n  const game = await getGame(gameId);\n  if (!game) return;\n  \n  game.rollsLeft = 0;");

// Fix joinGame
eng = eng.replace(/previousPlayerId\?: string, playerId: string/g, "playerId: string, previousPlayerId?: string");

// Fix unused variables in gameLogic.ts
let logic = fs.readFileSync('frontend/src/engine/gameLogic.ts', 'utf8');
logic = logic.replace(/import type \{ GameState, Player, Card, DiceRoll, DiceFace, PlayerId \} from '@king-of-tokyo\/shared';/g, "import type { GameState, Card, DiceRoll, DiceFace } from '@king-of-tokyo/shared';");
logic = logic.replace(/import \{ MAX_HEALTH, WIN_VP, marketCards \} from '@king-of-tokyo\/shared';/g, "import { marketCards } from '@king-of-tokyo/shared';");
fs.writeFileSync('frontend/src/engine/gameLogic.ts', logic);

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);
