import { CardImplementation } from './types';
import { PendingAction } from '../types';
import { addLog } from '../utils';

export const NovaBreath: CardImplementation = {
  id: 'nova_breath',
  name: 'Nova Breath',
  cost: 7,
  type: 'Keep',
  description: 'Your attacks damage all other monsters.',
  onPreEvent: (st, action, pId) => {
    if (action.type === 'ATTACK' && action.playerId === pId) {
      const damage = action.payload.damage;
      addLog(st, action, `${st.players[pId].name} attacks for ${damage} everywhere! (Nova Breath)`);
      const actionsToPush: PendingAction[] = [];
      st.playerOrder.forEach(tId => {
         if (tId !== pId && st.players[tId].health > 0) {
            const isTokyo = st.players[tId].location === 'TokyoCity';
            actionsToPush.push({ type: 'TAKE_DAMAGE', payload: { amount: damage, yield_after: isTokyo, attackerId: pId }, playerId: tId });
         }
      });
      // Replace original ATTACK with NOP
      action.type = 'NOP';
      st.pendingActions = [...actionsToPush, ...st.pendingActions];
    }
    return st;
  }
};
