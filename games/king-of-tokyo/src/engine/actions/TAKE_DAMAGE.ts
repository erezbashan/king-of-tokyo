import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleTakeDamage(st: KotState, action: PendingAction, pId: string) {
  const targetId = pId;
  const dmg = action.payload.amount;
  if (st.players[targetId] && st.players[targetId].health > 0) {
     const newHealth = Math.max(0, st.players[targetId].health - dmg);
     st.players[targetId] = { ...st.players[targetId], health: newHealth };
     addLog(st, action, `${st.players[targetId].name} took ${dmg} 💥`);
     if (newHealth === 0) {
        st.pendingActions.unshift({ type: 'DEAD', playerId: targetId });
     }
  }
}
