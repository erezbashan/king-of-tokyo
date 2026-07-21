import { CardImplementation } from './types';
import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';
import { CARD_REGISTRY } from './registry';

export const MadeInALab: CardImplementation = {
  id: 'made_in_a_lab',
  name: 'Made in a Lab',
  cost: 2,
  type: 'Keep',
  description: 'When purchasing cards you can peek at and purchase the top card of the deck.',
  onPreEvent: (st: KotState, action: PendingAction, pId: string) => {
    if (action.type === 'BUY_OR_SWEEP' && action.playerId === pId) {
      if (st.deck.length > 0) {
         st.turnContext.marketExtraCards = [
            ...(st.turnContext.marketExtraCards || []),
            { cardId: st.deck[0], source: 'deck' }
         ];
      }
    }
    return st;
  },
  onPostEvent: (st: KotState, action: PendingAction, pId: string) => {
    if (action.type === 'BUY' && action.playerId === pId && action.payload.source === 'deck') {
       // The generic BUY action handled deducting energy and adding the card.
       // We just need to remove it from the deck.
       st.deck.shift();
       addLog(st, action, `🧪 ${st.players[pId].name} used Made in a Lab to buy from the deck!`);
    }
    return st;
  }
};
