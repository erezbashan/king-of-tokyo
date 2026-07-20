import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleStartGame(st: KotState, action: PendingAction, pId: string) {
  const newDeck = [...st.deck];
  const newMarket = newDeck.splice(0, 3);
  st.deck = newDeck;
  st.market = newMarket;
  st.status = 'Playing';
  st.playerOrder.forEach(id => {
    st.players[id] = { ...st.players[id], health: st.settings.maxHealth, energy: st.settings.startingEnergy, vp: 0, location: 'Outside', cards: [], stats: { healthHealed: 0, energyGained: 0, damageDealt: 0, playersKilled: 0 } };
  });
  st.pendingActions = [{ type: 'START_TURN', playerId: st.playerOrder[st.currentPlayerIndex] }];
}

export function handleStartTurn(st: KotState, action: PendingAction, pId: string) {
  const p = st.players[pId];
  st.pendingActions = [
    { type: 'SETUP_DICE' },
    { type: 'ASK_ROLL', payload: {
       prompt: {
         text: 'Roll Dice?',
         options: [
           { label: 'Roll', action: { type: 'RESPONSE_ROLL', payload: { roll: true } } },
           { label: 'Resolve', action: { type: 'RESPONSE_ROLL', payload: { roll: false } } }
         ]
       }
    } },
    { type: 'RESOLVE_ROLLS' },
    { type: 'GO_TO_MARKET' },
    { type: 'END_TURN' },
    ...st.pendingActions
  ];
  
  if (p && p.location === 'TokyoCity') {
    addLog(st, action, `${p.name} starts turn in Tokyo!`);
    st.pendingActions.unshift({ type: 'VP', payload: { amount: 2 }, playerId: pId });
  }
}

export function handleEndTurn(st: KotState, action: PendingAction, pId: string) {
  let nextIdx = (st.currentPlayerIndex + 1) % st.playerOrder.length;
  while (st.players[st.playerOrder[nextIdx]].health <= 0) {
      nextIdx = (nextIdx + 1) % st.playerOrder.length;
  }
  st.currentPlayerIndex = nextIdx;
  st.pendingActions.unshift({ type: 'START_TURN', playerId: st.playerOrder[nextIdx] });
}

export function handleVP(st: KotState, action: PendingAction, pId: string) {
  if (st.players[pId]) {
    st.players[pId] = { ...st.players[pId], vp: st.players[pId].vp + action.payload.amount };
    addLog(st, action, `${st.players[pId].name} gained ${action.payload.amount} ⭐`);
    if (st.players[pId].vp >= st.settings.maxVp) {
      addLog(st, action, `${st.players[pId].name} wins on VP! 🏆`);
      st.status = 'Finished';
    }
  }
}

export function handleEnergy(st: KotState, action: PendingAction, pId: string) {
  if (st.players[pId]) {
    st.players[pId] = { ...st.players[pId], energy: st.players[pId].energy + action.payload.amount };
    addLog(st, action, `${st.players[pId].name} gained ${action.payload.amount} ⚡`);
  }
}

export function handleHealth(st: KotState, action: PendingAction, pId: string) {
  if (st.players[pId]) {
    const { getPlayerMaxHealth } = require('../utils');
    const max = getPlayerMaxHealth(st, pId);
    const actual = Math.min(max - st.players[pId].health, action.payload.amount);
    if (actual > 0 && st.players[pId].location !== 'TokyoCity') {
      st.players[pId] = { ...st.players[pId], health: st.players[pId].health + actual };
      addLog(st, action, `${st.players[pId].name} healed ${actual} ❤️`);
    }
  }
}
