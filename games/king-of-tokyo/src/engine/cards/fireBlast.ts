import { KotCard } from './types';
import { dispatchEvent } from '../reducer';

export const FireBlast: KotCard = {
  id: 'fire_blast',
  name: 'Fire Blast',
  cost: 3,
  type: 'Discard',
  description: 'Deal 2 damage to all other monsters.',
  onEvent: (event, payload, state) => {
    if (event === 'BUY_CARD' && payload.cardId === 'fire_blast') {
      const buyer = state.players[payload.playerId];
      let newState = { ...state };
      
      newState.logs = [...newState.logs, `${buyer.name} unleashes a Fire Blast! 💥`];

      let damagedSomeone = false;

      Object.values(newState.players).forEach(p => {
        if (p.id !== buyer.id && p.health > 0) {
          let dmgObj = { damage: 2 };
          newState = dispatchEvent(newState, 'BEFORE_TAKE_DAMAGE', { playerId: p.id, attackerId: buyer.id, damage: dmgObj });
          const actualDmg = dmgObj.damage;

          if (actualDmg > 0) {
            newState.players[p.id].health = Math.max(0, newState.players[p.id].health - actualDmg);
            damagedSomeone = true;
            newState.players[buyer.id].stats.damageDealt += Math.min(p.health, actualDmg);
            
            if (newState.players[p.id].health === 0) {
              newState.players[buyer.id].stats.playersKilled += 1;
              newState.logs.push(`💀 ${p.name} was eliminated!`);
              newState = dispatchEvent(newState, 'MONSTER_DIED', { playerId: buyer.id, deadPlayerId: p.id });
            }
          }
        }
      });
      
      if (!damagedSomeone) {
        newState.logs.push(`Fire Blast didn't damage anyone!`);
      }

      return newState;
    }
  }
};
