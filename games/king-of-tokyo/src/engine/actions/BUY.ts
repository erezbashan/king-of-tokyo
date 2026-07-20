import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleBuy(st: KotState, action: PendingAction, pId: string) {
  // Not fully implemented without cards, just deduct cost and put in array
  const cardId = action.payload.cardId;
  addLog(st, action, `${st.players[pId].name} bought a card! (Not fully implemented)`);
}
