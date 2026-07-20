import { KotState, PendingAction } from '../types';

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
