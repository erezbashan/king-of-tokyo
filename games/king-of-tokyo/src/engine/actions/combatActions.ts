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

export function handleDead(st: KotState, action: PendingAction, pId: string) {
   addLog(st, action, `💀 ${st.players[pId].name} was eliminated!`);
   const alive = st.playerOrder.filter(id => st.players[id].health > 0);
   if (alive.length <= 1) {
      addLog(st, action, `${st.players[alive[0]].name} is the last monster standing! 🏆`);
      st.status = 'Finished';
   }
}

export function handleAttack(st: KotState, action: PendingAction, pId: string) {
  const attacker = st.players[pId];
  const damage = action.payload.damage;
  addLog(st, action, `${attacker.name} attacks for ${damage}! (not fully implemented)`);

  const actionsToPush: PendingAction[] = [];

  if (attacker.location === 'Outside') {
     const tokyoPlayers = st.playerOrder.filter(id => st.players[id].location === 'TokyoCity' && st.players[id].health > 0);
     if (tokyoPlayers.length === 0) {
        actionsToPush.push({ type: 'ENTER_TOKYO', playerId: pId });
     } else {
        tokyoPlayers.forEach(tId => {
           actionsToPush.push({ type: 'TAKE_DAMAGE', payload: { amount: damage }, playerId: tId });
           actionsToPush.push({ type: 'ASK', payload: {
              prompt: {
                playerId: tokyoPlayers[0],
                text: `Will you yield Tokyo?`,
              options: [
                { label: 'Yield', action: { type: 'RESPONSE_YIELD', payload: { yield: true, attackerId: pId } } },
                { label: 'Stay', action: { type: 'RESPONSE_YIELD', payload: { yield: false } } }
              ]
              }
           }});
        });
     }
  } else {
     st.playerOrder.forEach(tId => {
        if (tId !== pId && st.players[tId].location === 'Outside' && st.players[tId].health > 0) {
           actionsToPush.push({ type: 'TAKE_DAMAGE', payload: { amount: damage }, playerId: tId });
        }
     });
  }

  st.pendingActions = [...actionsToPush, ...st.pendingActions];
}

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

export function handleEnterTokyo(st: KotState, action: PendingAction, pId: string) {
  st.players[pId] = { ...st.players[pId], location: 'TokyoCity' };
  addLog(st, action, `${st.players[pId].name} enters Tokyo!`);
  st.pendingActions.unshift({ type: 'VP', payload: { amount: 1 }, playerId: pId });
}
