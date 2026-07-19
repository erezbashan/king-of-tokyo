import { KotCard } from './types';

export const DropFromHighAltitude: KotCard = {
  id: 'drop_from_high_altitude',
  name: 'Drop from High Altitude',
  cost: 5,
  type: 'Discard',
  description: '+ 2 ⭐ and take control of Tokyo if you don\'t already control it.',
  onEvent: (event, payload, state) => {
    if (event === 'BUY_CARD' && payload.cardId === 'drop_from_high_altitude') {
      const player = state.players[payload.playerId];
      let newState = { ...state };
      
      // Grant 2 VP
      newState.players = {
        ...newState.players,
        [player.id]: {
          ...player,
          vp: player.vp + 2
        }
      };
      
      newState.logs = [...newState.logs, `${player.name} instantly gained 2 ⭐ from Drop from High Altitude!`];

      // Take Tokyo if outside
      if (player.location === 'Outside') {
        // Find current occupant and move them out
        const tokyoOccupants = Object.values(newState.players).filter(p => p.location === 'TokyoCity' && p.health > 0);
        tokyoOccupants.forEach(occupant => {
          newState.players[occupant.id] = { ...newState.players[occupant.id], location: 'Outside' };
          newState.logs.push(`${occupant.name} was forced out of Tokyo!`);
        });

        // Move buyer to Tokyo
        newState.players[player.id].location = 'TokyoCity';
        newState.players[player.id].vp += 1; // 1 VP for entering Tokyo
        newState.logs.push(`${player.name} dropped into Tokyo and gained 1 ⭐!`);
      }

      return newState;
    }
  }
};
