import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleDead(st: KotState, action: PendingAction, pId: string) {
   addLog(st, action, `💀 ${st.players[pId].name} was eliminated!`);
   const alive = st.playerOrder.filter(id => st.players[id].health > 0);
   if (alive.length <= 1) {
      addLog(st, action, `${st.players[alive[0]].name} is the last monster standing! 🏆`);
      st.status = 'Finished';
   }
}
