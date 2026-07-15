import { CardBehavior } from './types';

export const SpikedTail: CardBehavior = {
  id: 'c17',
  onBuy: (context) => {
    const player = context.gameState.players[context.playerId];
    for (const pId in context.gameState.players) {
      if (pId !== context.playerId) {
        context.gameState.players[pId].health = Math.max(0, context.gameState.players[pId].health - 2);
      }
    }
  },

};
