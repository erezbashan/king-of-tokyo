import { CardBehavior } from './types';

export const MorePoints: CardBehavior = {
  id: 'c8',
  onBuy: (context) => {
    const player = context.gameState.players[context.playerId];
    player.victoryPoints += 4;
    context.log(`⭐ ${player.name} gained 4 VP!`);
    context.highlight(context.playerId, 'vp');
  },

};
