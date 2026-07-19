import { KotCard } from './types';

export const ExtraHead: KotCard = {
  id: 'extra_head',
  name: 'Extra Head',
  cost: 7,
  type: 'Keep',
  description: 'You get 1 extra die.',
  copies: 2,
  // The logic for rolling extra dice is handled centrally in reducer.ts inside ROLL_DICE.
};
