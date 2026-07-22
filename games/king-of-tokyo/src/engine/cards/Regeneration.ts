import { CardImplementation } from './types';
import { addLog } from '../utils';

export const Regeneration: CardImplementation = {
  id: 'regeneration',
  name: 'Regeneration',
  cost: 4,
  type: 'Keep',
  description: 'When you heal, heal 1 extra damage.',
  onPreEvent: (st, action, pId) => {
    if (action.type === 'HEALTH' && action.playerId === pId && action.payload.amount > 0) {
      action.payload.amount += 1;
      addLog(st, action, `${st.players[pId].name} heals 1 extra damage (Regeneration)`);
    }
    return st;
  }
};
