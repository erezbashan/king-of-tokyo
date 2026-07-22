import { KotState, PendingAction } from '../types';

export function handleResponseNop(st: KotState, action: PendingAction, pId: string) {
  // Do nothing. Used to safely pop an ASK prompt without any consequences.
}
