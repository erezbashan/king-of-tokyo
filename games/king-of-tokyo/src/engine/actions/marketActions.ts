import { KotState, PendingAction } from '../types';
import { addLog } from '../utils';

export function handleGoToMarket(st: KotState, action: PendingAction, pId: string) {
  st.pendingActions = [
    { type: 'SETUP_CARD_PRICES' },
    { type: 'BUY_OR_SWEEP' },
    ...st.pendingActions
  ];
}

export function handleSetupCardPrices(st: KotState, action: PendingAction, pId: string) {
  // For now, prices are static. 
}

export function handleBuyOrSweep(st: KotState, action: PendingAction, pId: string) {
  const canSweep = st.players[pId].energy >= 2;
  const canPurchase = false; // simplifying for now
  if (canSweep || canPurchase) {
     st.pendingActions.unshift({ type: 'ASK_MARKET', payload: {
        prompt: {
          text: 'Buy Cards?',
          options: [
            { label: 'Done', action: { type: 'RESPONSE_MARKET', payload: { action: 'DONE' } } },
            { label: 'Sweep (2⚡)', action: { type: 'RESPONSE_MARKET', payload: { action: 'SWEEP' } } }
          ]
        }
     } });
  }
}

export function handleResponseMarket(st: KotState, action: PendingAction, pId: string) {
  if (action.payload.action === 'SWEEP') {
    st.pendingActions.unshift({ type: 'SWEEP' });
    st.pendingActions.unshift({ type: 'BUY_OR_SWEEP' }); // Go back to buy options
  } else if (action.payload.action === 'BUY') {
    st.pendingActions.unshift({ type: 'BUY', payload: { cardId: action.payload.cardId, marketIndex: action.payload.marketIndex } });
    st.pendingActions.unshift({ type: 'BUY_OR_SWEEP' });
  }
}

export function handleSweep(st: KotState, action: PendingAction, pId: string) {
  st.players[pId].energy -= 2;
  addLog(st, action, `${st.players[pId].name} paid 2 ⚡ to sweep the market!`);
  const newDeck = [...st.deck];
  st.market = newDeck.splice(0, 3);
  st.deck = newDeck;
}

export function handleBuy(st: KotState, action: PendingAction, pId: string) {
  // Not fully implemented without cards, just deduct cost and put in array
  const cardId = action.payload.cardId;
  addLog(st, action, `${st.players[pId].name} bought a card! (Not fully implemented)`);
}
