import re

with open('frontend/src/engine/gameEngine.ts', 'r') as f:
    eng = f.read()

# Fix getGame
old_get_game = """export async function getGame(gameId: string): Promise<GameState | null> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return data ? (data as GameState) : null;
  }
  return null;
}"""

new_get_game = """export async function getGame(gameId: string): Promise<GameState> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  if (data) return data as GameState;
  throw new Error("Game not found");
}"""

eng = eng.replace(old_get_game, new_get_game)

# Remove unused imports and fix parameter order
eng = re.sub(r'previousPlayerId\?: string, playerId: string', 'playerId: string, previousPlayerId?: string', eng)
eng = re.sub(r'export async function joinGame\(gameId: string, username: string, previousPlayerId\?: string, playerId: string\)', 'export async function joinGame(gameId: string, username: string, playerId: string, previousPlayerId?: string)', eng)
eng = re.sub(r'export async function addBot\(gameId: string, playerId: string\)', 'export async function addBot(gameId: string)', eng)
eng = re.sub(r'export async function returnToLobby\(gameId: string, playerId: string\)', 'export async function returnToLobby(gameId: string)', eng)

# Remove unused vars in gameLogic.ts
with open('frontend/src/engine/gameLogic.ts', 'r') as f:
    logic = f.read()

logic = logic.replace("Player, ", "")
logic = logic.replace("PlayerId, ", "")
logic = logic.replace("MAX_HEALTH, ", "")
logic = logic.replace("WIN_VP, ", "")

with open('frontend/src/engine/gameLogic.ts', 'w') as f:
    f.write(logic)

with open('frontend/src/engine/gameEngine.ts', 'w') as f:
    f.write(eng)

