import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleResponseYield(st: KotState, action: PendingAction, pId: string) {
  const subAction = action.payload;
  if (subAction.yield) {
     const { attackerId } = subAction;
     st.players[pId] = { ...st.players[pId], location: 'Outside' };
     addLog(st, action, `${st.players[pId].name} yielded Tokyo!`);
     st.pendingActions.unshift({ type: 'ENTER_TOKYO', playerId: attackerId });
  } else {
     addLog(st, action, `${st.players[pId].name} stays in Tokyo!`);
  }
}
