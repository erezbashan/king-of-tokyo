import { KotCard } from './types';

export const Energize: KotCard = {
  id: 'energize',
  name: 'Energize',
  cost: 8,
  type: 'Discard',
  description: '+ 9 ⚡',
  onEvent: (event, payload, state) => {
    if (event === 'BUY_CARD' && payload.cardId === 'energize') {
      const player = state.players[payload.playerId];
      return {
        ...state,
        players: {
          ...state.players,
          [player.id]: {
            ...player,
            energy: player.energy + 9
          }
        },
        logs: [...state.logs, `${player.name} instantly gained 9 ⚡ from Energize!`]
      };
    }
  }
};
