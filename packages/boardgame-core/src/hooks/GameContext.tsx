import React, { createContext, useContext } from 'react';
import type { BaseGameState, BaseAction } from '../engine/types';

export interface GameContextType<
  TGameState extends BaseGameState = BaseGameState,
  TAction = any
> {
  gameState: TGameState;
  myPlayerId: string;
  dispatch: (action: TAction) => void;
  onLeaveGame: () => void;
}

export const GameContext = createContext<GameContextType<any, any> | null>(null);

export function useGameContext<
  TGameState extends BaseGameState = BaseGameState,
  TAction = any
>() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context as GameContextType<TGameState, TAction>;
}

export interface GameProviderProps<
  TGameState extends BaseGameState = BaseGameState,
  TAction = any
> {
  value: GameContextType<TGameState, TAction>;
  children: React.ReactNode;
}

export function GameProvider<
  TGameState extends BaseGameState = BaseGameState,
  TAction = any
>({ value, children }: GameProviderProps<TGameState, TAction>) {
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
