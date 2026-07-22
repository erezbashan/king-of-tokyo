import { KotState, PendingAction } from '../types';

export interface MarkerImplementation {
  id: string;
  name: string;
  icon: string;
  description: string;
  onPreEvent?: (st: KotState, action: PendingAction, ownerId: string) => KotState;
  onPostEvent?: (st: KotState, action: PendingAction, ownerId: string) => KotState;
}

import { PoisonMarker } from './PoisonMarker';

export const MARKER_REGISTRY: Record<string, MarkerImplementation> = {
  [PoisonMarker.id]: PoisonMarker
};
