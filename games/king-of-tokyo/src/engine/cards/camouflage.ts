import { KotCard } from './types';

export const Camouflage: KotCard = {
  id: 'camouflage',
  name: 'Camouflage',
  cost: 3,
  type: 'Keep',
  description: 'If you take damage roll a die for each damage point. On a ❤️ you do not take that damage point.',
  onEvent: (event, payload, state) => {
    if (event === 'BEFORE_TAKE_DAMAGE') {
      const { playerId, cardOwnerId, damage } = payload;
      if (playerId === cardOwnerId && damage.damage > 0) {
        const player = state.players[playerId];
        const diceCount = damage.damage;
        
        let heartsRolled = 0;
        const DICE_FACES = ['1', '2', '3', 'Energy', 'Heart', 'Smash'];
        const outcomeEmojiMap: Record<string, string> = { Heart: '❤️', Energy: '⚡', Smash: '💥', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣' };
        
        const rolledFaces: string[] = [];
        for (let i = 0; i < diceCount; i++) {
          const face = DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
          rolledFaces.push(outcomeEmojiMap[face] || face);
          if (face === 'Heart') {
            heartsRolled++;
          }
        }
        
        const originalDamage = damage.damage;
        damage.damage = Math.max(0, originalDamage - heartsRolled);
        
        const logMsg = `🛡️ ${player.name} activated Camouflage! Rolled ${diceCount} dice: ${rolledFaces.join(' ')}. Blocked ${heartsRolled} damage!`;
        
        return {
          ...state,
          logs: [...state.logs, logMsg]
        };
      }
    }
  }
};
