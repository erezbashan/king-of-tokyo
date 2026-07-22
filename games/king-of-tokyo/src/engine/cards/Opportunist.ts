import { CardImplementation } from './types';
import { CARD_REGISTRY } from './registry';

export const Opportunist: CardImplementation = {
  id: 'opportunist',
  name: 'Opportunist',
  cost: 3,
  type: 'Keep',
  description: 'Whenever a new card is revealed, you have the option of buying it as soon as it is revealed.',
  onPostEvent: (st, action, pId) => {
    // When a new card is revealed in the market, ask the Opportunist owner if they want to buy it.
    if (action.type === 'CARD_REVEALED') {
      const cardId = action.payload.cardId;
      const marketIndex = action.payload.marketIndex;
      const owner = st.players[pId];
      
      const cardDef = CARD_REGISTRY[cardId];
      if (!cardDef) return st;

      let cost = cardDef.cost;
      if (owner.cards.includes('alien_metabolism')) {
         cost = Math.max(0, cost - 1);
      }

      if (owner.energy >= cost && !owner.cards.includes(cardId)) {
         st.pendingActions.unshift({
           type: 'ASK_OPPORTUNIST',
           playerId: pId, // The Opportunist owner gets the prompt
           payload: {
              prompt: {
                 playerId: pId,
                 text: `Opportunist: Buy ${cardDef.name}?`,
                 options: [
                    { label: `Buy for ${cost} ⚡`, action: { type: 'BUY', payload: { cardId, marketIndex, source: 'market' } } },
                    { label: 'Decline', action: { type: 'RESPONSE_NOP', payload: {} } }
                 ]
              }
           }
         });
      }
    }
    return st;
  }
};
