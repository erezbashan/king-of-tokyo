import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleSweep(st: KotState, action: PendingAction, pId: string) {
  st.players[pId].energy -= 2;
  addLog(st, action, `${st.players[pId].name} paid 2 ⚡ to sweep the market!`);
  const newDeck = [...st.deck];
  st.market = newDeck.splice(0, 3);
  st.deck = newDeck;
}
