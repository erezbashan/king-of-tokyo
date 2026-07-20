import { KotState, PendingAction } from '../types';

export function handleGoToMarket(st: KotState, action: PendingAction, pId: string) {
  st.pendingActions = [
    { type: 'SETUP_CARD_PRICES' },
    { type: 'BUY_OR_SWEEP' },
    ...st.pendingActions
  ];
}
