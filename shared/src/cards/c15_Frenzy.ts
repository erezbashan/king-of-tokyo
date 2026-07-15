import { CardBehavior } from './types';

export const Frenzy: CardBehavior = {
  id: 'c15',
  onBuy: (context) => {
    const player = context.gameState.players[context.playerId];
    // frenzy logic: game engine will handle if player has frenzy
  },

};
