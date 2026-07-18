import type { BaseAction, BasePlayer } from '../engine/types';
import { BOT_NAMES } from '../engine/types';

export interface GameController {
  handleStart: () => void;
  handleAddBot: () => void;
  handleSendMessage: (msg: string, senderName: string, senderColor?: string) => void;
  handleRemovePlayer: (playerId: string) => void;
  handleNewGame: () => void;
}

export function useGameController(dispatch: (action: BaseAction) => void): GameController {
  const handleStart = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleAddBot = () => {
    const botId = 'bot-' + Math.random().toString(36).substring(2, 6);
    const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    dispatch({ type: 'JOIN_GAME', payload: { playerId: botId, name: botName, isBot: true, botStrategy: 'random' } });
  };

  const handleSendMessage = (msg: string, senderName: string, senderColor?: string) => {
    dispatch({ 
      type: 'SEND_CHAT_MESSAGE', 
      payload: { sender: senderName, text: msg, color: senderColor } 
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: { playerId } });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  return { handleStart, handleAddBot, handleSendMessage, handleRemovePlayer, handleNewGame };
}
