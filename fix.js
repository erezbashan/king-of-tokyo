const fs = require('fs');
let gameLogic = fs.readFileSync('frontend/src/engine/gameLogic.ts', 'utf8');
gameLogic = gameLogic.replace(
  "import { GameState, Player, Card, DiceRoll, DiceFace, PlayerId, MAX_HEALTH, WIN_VP, marketCards } from '@king-of-tokyo/shared';",
  "import type { GameState, Player, Card, DiceRoll, DiceFace, PlayerId } from '@king-of-tokyo/shared';\nimport { MAX_HEALTH, WIN_VP, marketCards } from '@king-of-tokyo/shared';"
);
fs.writeFileSync('frontend/src/engine/gameLogic.ts', gameLogic);

let gameEngine = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');
// Fix imports
gameEngine = gameEngine.replace(
  "import { GameState, Player, Card, DiceRoll, DiceFace, PlayerId } from '@king-of-tokyo/shared';",
  "import type { GameState, Player, Card, DiceRoll, DiceFace, PlayerId } from '@king-of-tokyo/shared';"
);
gameEngine = gameEngine.replace(
  "import { doc, getDoc, setDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport type { TurnHistory } from '@king-of-tokyo/shared';"
);

// Fix getGame error
gameEngine = gameEngine.replace("return snapshot.data() as GameState;", "const data = snapshot.data();\n    return data ? (data as GameState) : null;");

// Replace games[...] with game
gameEngine = gameEngine.replace(/games\[gameId\]\s*&&\s*games\[gameId\]\.settings/g, "game.settings");
gameEngine = gameEngine.replace(/games\[gameId\]\.settings/g, "game.settings");
gameEngine = gameEngine.replace(/games\[gameId\]\.players/g, "game.players");
gameEngine = gameEngine.replace(/games\[gameId\]\.playerOrder/g, "game.playerOrder");
gameEngine = gameEngine.replace(/games\[gameId\]/g, "game");

// Remove io and SOCKET_EVENTS
gameEngine = gameEngine.replace(/console\.error\(SOCKET_EVENTS\.ERROR, 'Game not found'\);/g, "console.error('Game not found');");
gameEngine = gameEngine.replace(/console\.error\(SOCKET_EVENTS\.ERROR, 'Game already started'\);/g, "console.error('Game already started');");
gameEngine = gameEngine.replace(/!io\.sockets\.sockets\.has\(p\.id\)/g, "false /* replace logic later */");

// Fix p as any and implicit anys
gameEngine = gameEngine.replace(/const evadeIdx = other\.cards\.findIndex\(c => c\.effect\?\.evade\);/g, "const evadeIdx = other.cards.findIndex((c: Card) => c.effect?.evade);");
gameEngine = gameEngine.replace(/const extraDice = game\.players\[playerId\]\.cards\.reduce\(\(sum, c\) => sum \+ \(c\.effect\?\.extraDie \|\| 0\), 0\);/g, "const extraDice = game.players[playerId].cards.reduce((sum: number, c: Card) => sum + (c.effect?.extraDie || 0), 0);");

// Fix h: any
gameEngine = gameEngine.replace(/game\.history\.forEach\(h => \{/g, "game.history.forEach((h: TurnHistory) => {");

// Fix createGame missing declaration
gameEngine = gameEngine.replace(/const gameId = Math.random\(\).toString\(36\).substring\(2, 8\).toUpperCase\(\);/g, "// removed re-declaration of gameId");

fs.writeFileSync('frontend/src/engine/gameEngine.ts', gameEngine);
