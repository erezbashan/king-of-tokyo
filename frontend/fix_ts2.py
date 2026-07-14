import re

with open('frontend/src/engine/gameEngine.ts', 'r') as f:
    eng = f.read()

new_get_game = """export async function getGame(gameId: string): Promise<GameState> {
  const docRef = doc(db, 'games', gameId);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  if (data) return data as GameState;
  throw new Error("Game not found");
}"""

eng = re.sub(r'export async function getGame\(gameId: string\): Promise<GameState \| null> \{.*?return null;\n\}', new_get_game, eng, flags=re.DOTALL)

# Fix parameter required error
# previousPlayerId?: string, playerId: string -> playerId: string, previousPlayerId?: string
eng = re.sub(r'previousPlayerId\?: string,\s*playerId:\s*string', 'playerId: string, previousPlayerId?: string', eng)

# Remove unused variables in gameEngine
eng = re.sub(r'export async function addBot\(gameId: string,\s*playerId:\s*string\)', 'export async function addBot(gameId: string)', eng)
eng = re.sub(r'export async function returnToLobby\(gameId: string,\s*playerId:\s*string\)', 'export async function returnToLobby(gameId: string)', eng)
eng = re.sub(r'export async function quitGame\(gameId: string,\s*playerId:\s*string\)', 'export async function quitGame(gameId: string, playerId: string)', eng) # keep it, it's used

with open('frontend/src/engine/gameEngine.ts', 'w') as f:
    f.write(eng)

# Also fix gameLogic.ts unused imports
with open('frontend/src/engine/gameLogic.ts', 'r') as f:
    logic = f.read()

logic = logic.replace("Player, ", "")
logic = logic.replace("PlayerId, ", "")
logic = logic.replace("MAX_HEALTH, ", "")
logic = logic.replace("WIN_VP, ", "")
# handle if they are not followed by comma space
logic = re.sub(r'\bPlayer,\s*', '', logic)
logic = re.sub(r'\bPlayerId,\s*', '', logic)
logic = re.sub(r'\bMAX_HEALTH,\s*', '', logic)
logic = re.sub(r'\bWIN_VP,\s*', '', logic)

with open('frontend/src/engine/gameLogic.ts', 'w') as f:
    f.write(logic)

