import type { KotAction, KotState } from '../engine/types';

export function getBotAction(state: KotState, playerId: string): KotAction | null {
  const player = state.players[playerId];
  if (!player) return null;

  const topAction = state.pendingActions[0];
  if (topAction?.type.startsWith('ASK') && topAction.payload?.prompt?.playerId === playerId) {
    const prompt = topAction.payload.prompt;
    if (prompt.options && prompt.options.length > 0) {
      // Pick a random option to return its exact action (RESPONSE_ROLL, RESPONSE_MARKET, etc)
      const randomIdx = Math.floor(Math.random() * prompt.options.length);
      const opt = prompt.options[randomIdx];
      return opt.action;
    }
  }

  return null;
}
