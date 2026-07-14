const fs = require('fs');
let eng = fs.readFileSync('frontend/src/engine/gameEngine.ts', 'utf8');

const oldGetGame = `export async function getGame(gameId: string): Promise<GameState | null> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return data ? (data as GameState) : null;
  }
  return null;
}`;

const newGetGame = `export async function getGame(gameId: string): Promise<GameState> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  if (data) return data as GameState;
  throw new Error("Game not found");
}`;

eng = eng.replace(oldGetGame, newGetGame);

// Also let's fix parameter required error in gameEngine
eng = eng.replace(/export async function joinGame\(gameId: string, username: string, playerId: string, previousPlayerId\?: string\)/g, "export async function joinGame(gameId: string, username: string, playerId: string, previousPlayerId?: string)");
// wait, the error is: src/engine/gameEngine.ts(525,93): error TS1016: A required parameter cannot follow an optional parameter.
// Let's just find that line and replace it manually.
const oldJoin = `export async function joinGame(gameId: string, username: string, previousPlayerId?: string, playerId: string) {`;
const newJoin = `export async function joinGame(gameId: string, username: string, playerId: string, previousPlayerId?: string) {`;
eng = eng.replace(oldJoin, newJoin);
// What if we did replace it? Wait, let's just use regex to fix it
eng = eng.replace(/previousPlayerId\?: string, playerId: string/g, "playerId: string, previousPlayerId?: string");

// Let's write it out
fs.writeFileSync('frontend/src/engine/gameEngine.ts', eng);

