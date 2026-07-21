import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

import { CARD_REGISTRY } from '../cards/registry';

export function handleEnergy(st: KotState, action: PendingAction, pId: string) {
  if (st.players[pId]) {
    st.players[pId] = { ...st.players[pId], energy: st.players[pId].energy + action.payload.amount };
    if (action.payload.amount > 0) st.players[pId].stats.energyGained += action.payload.amount;
    
    let sourceText = '';
    if (action.payload.sourceCard && CARD_REGISTRY[action.payload.sourceCard]) {
       sourceText = ` via ${CARD_REGISTRY[action.payload.sourceCard].name}`;
    }
    
    addLog(st, action, `${st.players[pId].name} gained ${action.payload.amount} ⚡${sourceText}`);
  }
}
