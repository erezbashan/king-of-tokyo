import { KotCard } from './types';

export const EaterOfTheDead: KotCard = {
  id: 'eater_of_the_dead',
  name: 'Eater of the Dead',
  cost: 4,
  type: 'Keep',
  description: 'Gain 3 ⭐ every time a monster\'s ❤️ goes to 0.',
  onEvent: (event, payload, state) => {
    if (event === 'MONSTER_DIED' && payload.cardOwnerId === payload.playerId) {
      const player = state.players[payload.playerId];
      const deadPlayerName = state.players[payload.deadPlayerId!]?.name || 'A monster';
      return {
        ...state,
        players: {
          ...state.players,
          [player.id]: {
            ...player,
            vp: player.vp + 3
          }
        },
        logs: [...state.logs, `${player.name} gained 3 ⭐ from Eater of the Dead because ${deadPlayerName} was eliminated!`]
      };
    }
  }
};
