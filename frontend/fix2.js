const fs = require('fs');

function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}

let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

eng = eng.replace(/Object\.values\(game\.players\)\.forEach\(other => \{/g, "Object.values(game.players).forEach((other: any) => {");
eng = eng.replace(/Object\.values\(game\.players\)\.forEach\(\(p, index\) => \{/g, "Object.values(game.players).forEach((p: any, index) => {");
eng = eng.replace(/Object\.values\(game\.players\)\.forEach\(p => \{/g, "Object.values(game.players).forEach((p: any) => {");
eng = eng.replace(/Object\.values\(game\.players\)\.some\(pl => pl\.inTokyo/g, "Object.values(game.players).some((pl: any) => pl.inTokyo");

eng = eng.replace(/d => d\.kept/g, "(d: any) => d.kept");
eng = eng.replace(/d => faceMap\[d\.face\]/g, "(d: any) => faceMap[d.face]");
eng = eng.replace(/c => c\.effect\?/g, "(c: any) => c.effect?");

eng = eng.replace(/\(sum, c\) =>/g, "(sum: number, c: any) =>");
eng = eng.replace(/\(h => \{/g, "((h: any) => {");

eng = eng.replace(/export async function createGame\(gameId: string, playerId: string, username: string\) \{/g, "export async function createGame(gameId: string, playerId: string, username: string) {\n  const game = await getGame(gameId);\n  if (!game) return;");

fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

let over = fs.readFileSync('frontend/src/GameOverScreen.tsx', 'utf8');
over = over.replace(/import { TurnHistory } from '@king-of-tokyo\/shared';/g, "import type { TurnHistory } from '@king-of-tokyo/shared';");
over = over.replace(/a\.vp \+ a\.health \- \(b\.vp \+ b\.health\)/g, "(a as any).vp + (a as any).health - ((b as any).vp + (b as any).health)");
over = over.replace(/Object\.entries\(dataByTurn\)\.sort\(\(a, b\)/g, "Object.entries(dataByTurn).sort((a: any, b: any)");
over = over.replace(/\(h => /g, "((h: any) => ");
over = over.replace(/x => x\[1\]/g, "(x: any) => x[1]");
over = over.replace(/turn => turn\.turnNumber/g, "(turn: any) => turn.turnNumber");
over = over.replace(/h\.vp >= 20/g, "(h as any).vp >= 20");
fs.writeFileSync('frontend/src/GameOverScreen.tsx', over);

let sock = fs.readFileSync('frontend/src/SocketContext.tsx', 'utf8');
sock = sock.replace(/import { GameState, Card } from '@king-of-tokyo\/shared';/g, "import type { GameState, Card } from '@king-of-tokyo/shared';");
sock = sock.replace(/import { SOCKET_EVENTS } from '@king-of-tokyo\/shared';/g, "import { SOCKET_EVENTS } from '@king-of-tokyo/shared';");
fs.writeFileSync('frontend/src/SocketContext.tsx', sock);

let appTsx = '';
try {
  appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');
  appTsx = appTsx.replace(/import { GameState } from '@king-of-tokyo\/shared';/g, "import type { GameState } from '@king-of-tokyo/shared';");
  fs.writeFileSync('frontend/src/App.tsx', appTsx);
} catch(e) {}
