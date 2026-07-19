import { KotCard } from './types';

export const EnergyHoarder: KotCard = {
  id: 'energy_hoarder',
  name: 'Energy Hoarder',
  cost: 3,
  type: 'Keep',
  description: 'You gain 1 ⭐ for every 6 ⚡ you have at the end of your turn.',
  onEvent: (event, payload, state) => {
    if (event === 'END_TURN' && payload.cardOwnerId === payload.playerId) {
      const player = state.players[payload.playerId];
      const vpGain = Math.floor(player.energy / 6);
      
      if (vpGain > 0) {
        return {
          ...state,
          players: {
            ...state.players,
            [player.id]: {
              ...player,
              vp: player.vp + vpGain
            }
          },
          logs: [...state.logs, `${player.name} gained ${vpGain} ⭐ from Energy Hoarder for having ${player.energy} ⚡!`]
        };
      }
    }
  }
};
