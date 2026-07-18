import { KotState, KotAction } from '../engine/reducer';

function runRandomStrategy(state: KotState, playerId: string): KotAction | null {
  const player = state.players[playerId];
  if (!player) return null;

  // If there is a prompt for this player
  if (state.prompt && state.prompt.playerId === playerId) {
    // Randomly pick an option
    const options = state.prompt.options;
    if (options.length > 0) {
      const choice = options[Math.floor(Math.random() * options.length)];
      return choice.action as KotAction;
    }
  }

  // If it's the bot's turn
  if (state.playerOrder[state.currentPlayerIndex] === playerId && state.status === 'Playing' && !state.prompt) {
    if (state.rollCount < 3) {
      // Randomly decide which dice to keep if rollCount > 0
      const keptDiceIds: string[] = [];
      if (state.rollCount > 0) {
        for (const d of state.dice) {
          if (Math.random() > 0.5) {
            keptDiceIds.push(d.id);
          }
        }
      }
      return { type: 'ROLL_DICE', payload: { playerId, keptDiceIds } };
    } else {
      // After 3 rolls, must resolve
      return { type: 'RESOLVE_DICE', payload: { playerId } };
    }
  }

  return null;
}

export function runBotStrategy(state: KotState, playerId: string, strategy: string = 'random'): KotAction | null {
  switch (strategy) {
    case 'random':
    default:
      return runRandomStrategy(state, playerId);
  }
}
