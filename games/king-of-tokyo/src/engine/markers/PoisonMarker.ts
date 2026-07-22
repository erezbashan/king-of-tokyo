import { MarkerImplementation } from './registry';
import { PendingAction } from '../types';
import { addLog } from '../utils';

export const PoisonMarker: MarkerImplementation = {
  id: 'poison',
  name: 'Poison',
  icon: '☠️',
  description: 'Take 1 damage per poison marker at the end of your turn. You can remove a poison marker by spending a ❤️ (that ❤️ does not heal a damage).',
  onPostEvent: (st, action, ownerId) => {
    if (action.type === 'END_TURN' && action.playerId === ownerId) {
       const poisonCount = st.players[ownerId].markers?.['poison'] || 0;
       if (poisonCount > 0) {
          addLog(st, action, `${st.players[ownerId].name} takes ${poisonCount} damage from Poison!`);
          st.pendingActions.unshift({ type: 'TAKE_DAMAGE', payload: { amount: poisonCount, yield_after: false }, playerId: ownerId });
       }
    }
    return st;
  }
};
