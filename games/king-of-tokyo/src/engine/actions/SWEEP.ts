import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleSweep(st: KotState, action: PendingAction, pId: string) {
  st.players[pId].energy -= 2;
  addLog(st, action, `${st.players[pId].name} paid 2 ⚡ to sweep the market!`);
  const newDeck = [...st.deck];
  st.market = newDeck.splice(0, 3);
  st.deck = newDeck;
  
  // Note: we unshift in reverse order so they appear in correct index order in the action queue
  for (let i = st.market.length - 1; i >= 0; i--) {
     st.pendingActions.unshift({ type: 'CARD_REVEALED', playerId: pId, payload: { cardId: st.market[i], marketIndex: i } });
  }
}
