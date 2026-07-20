import { KotState, PendingAction } from '../types';
import { handleStartGame, handleStartTurn, handleEndTurn, handleVP, handleEnergy, handleHealth } from './baseActions';
import { handleSetupDice, handleResponseRoll, handleResolveRolls } from './diceActions';
import { handleTakeDamage, handleDead, handleAttack, handleResponseYield, handleEnterTokyo } from './combatActions';
import { handleGoToMarket, handleSetupCardPrices, handleBuyOrSweep, handleResponseMarket, handleSweep, handleBuy } from './marketActions';

export type ActionHandler = (st: KotState, action: PendingAction, pId: string) => void;

export const ACTION_HANDLERS: Record<string, ActionHandler> = {
  START_GAME: handleStartGame,
  START_TURN: handleStartTurn,
  END_TURN: handleEndTurn,
  VP: handleVP,
  ENERGY: handleEnergy,
  HEALTH: handleHealth,
  SETUP_DICE: handleSetupDice,
  RESPONSE_ROLL: handleResponseRoll,
  RESOLVE_ROLLS: handleResolveRolls,
  TAKE_DAMAGE: handleTakeDamage,
  DEAD: handleDead,
  ATTACK: handleAttack,
  RESPONSE_YIELD: handleResponseYield,
  ENTER_TOKYO: handleEnterTokyo,
  GO_TO_MARKET: handleGoToMarket,
  SETUP_CARD_PRICES: handleSetupCardPrices,
  BUY_OR_SWEEP: handleBuyOrSweep,
  RESPONSE_MARKET: handleResponseMarket,
  SWEEP: handleSweep,
  BUY: handleBuy,
};
