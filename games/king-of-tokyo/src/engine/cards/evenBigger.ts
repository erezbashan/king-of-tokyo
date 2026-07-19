import { KotCard } from './types';
import { getPlayerMaxHealth } from '../reducer';

export const EvenBigger: KotCard = {
  id: 'even_bigger',
  name: 'Even Bigger',
  cost: 4,
  type: 'Keep',
  description: 'Your maximum ❤️ is increased by 2. Gain 2 ❤️ when you get this card.',
  onEvent: (event, payload, state) => {
    if (event === 'BUY_CARD' && payload.cardId === 'even_bigger') {
      const player = state.players[payload.playerId];
      const maxHealth = getPlayerMaxHealth(state, player.id);
      const actualHeal = Math.min(maxHealth - player.health, 2);
      
      if (actualHeal > 0) {
        return {
          ...state,
          players: {
            ...state.players,
            [player.id]: {
              ...player,
              health: player.health + actualHeal,
              stats: {
                ...player.stats,
                healthHealed: player.stats.healthHealed + actualHeal
              }
            }
          },
          logs: [...state.logs, `${player.name} gained ${actualHeal} ❤️ from Even Bigger!`]
        };
      } else {
        return {
          ...state,
          logs: [...state.logs, `${player.name} is Even Bigger! (Already at max health)`]
        };
      }
    }
  }
};
