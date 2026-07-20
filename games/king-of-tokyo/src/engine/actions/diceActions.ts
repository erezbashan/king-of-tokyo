import { KotState, PendingAction } from '../types';
import { addLog, DICE_FACES } from '../utils';

export function handleSetupDice(st: KotState, action: PendingAction, pId: string) {
  st.dice = st.dice.map(d => ({ ...d, kept: false, value: '1' }));
  st.rollCount = 3;
  addLog(st, action, `Dice have been reset.`);
}

export function handleResponseRoll(st: KotState, action: PendingAction, pId: string) {
  if (action.payload.roll) {
    st.dice = st.dice.map(d => action.payload.keptDiceIds?.includes(d.id) ? d : { ...d, value: DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)] });
    st.rollCount -= 1;
    if (st.rollCount > 0) {
      st.pendingActions.unshift({ type: 'ASK_ROLL', payload: {
         prompt: {
           text: 'Roll Dice?',
           options: [
             { label: 'Roll', action: { type: 'RESPONSE_ROLL', payload: { roll: true } } },
             { label: 'Resolve', action: { type: 'RESPONSE_ROLL', payload: { roll: false } } }
           ]
         }
      } });
    } else {
      st.pendingActions.unshift({ type: 'RESOLVE_ROLLS' });
    }
  } else {
    st.pendingActions.unshift({ type: 'RESOLVE_ROLLS' });
  }
}

export function handleResolveRolls(st: KotState, action: PendingAction, pId: string) {
  const outcomeMap: Record<string, number> = {};
  st.dice.forEach(d => { outcomeMap[d.value] = (outcomeMap[d.value] || 0) + 1; });
  
  const diceActions: PendingAction[] = [];
  
  const emojiMap: Record<string, string> = { Heart: '❤️', Energy: '⚡', Smash: '💥', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣' };
  const outcomeStr = st.dice.map(d => emojiMap[d.value] || d.value).join(' ');
  addLog(st, action, `${st.players[pId].name} resolved: ${outcomeStr}`);

  if (outcomeMap['Heart']) diceActions.push({ type: 'HEALTH', payload: { amount: outcomeMap['Heart'] }, playerId: pId });
  if (outcomeMap['Energy']) diceActions.push({ type: 'ENERGY', payload: { amount: outcomeMap['Energy'] }, playerId: pId });
  if (outcomeMap['1'] >= 3) diceActions.push({ type: 'VP', payload: { amount: 1 + (outcomeMap['1'] - 3) }, playerId: pId });
  if (outcomeMap['2'] >= 3) diceActions.push({ type: 'VP', payload: { amount: 2 + (outcomeMap['2'] - 3) }, playerId: pId });
  if (outcomeMap['3'] >= 3) diceActions.push({ type: 'VP', payload: { amount: 3 + (outcomeMap['3'] - 3) }, playerId: pId });
  if (outcomeMap['Smash']) diceActions.push({ type: 'ATTACK', payload: { damage: outcomeMap['Smash'] }, playerId: pId });

  st.pendingActions = [...diceActions, ...st.pendingActions];
}
