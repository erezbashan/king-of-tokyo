import React from 'react';
import type { KotState, KotAction } from '../engine/reducer';
import { GameLayout, useGameContext } from '@erez/boardgame-core';

export const KotBoard: React.FC = () => {
  const { gameState, myPlayerId, dispatch } = useGameContext<KotState, KotAction>();
  const { status, players, dice, rollCount } = gameState;

  const isMyTurn = gameState.playerOrder[gameState.currentPlayerIndex] === myPlayerId;

  const handleRoll = () => {
    if (!isMyTurn || status !== 'Playing') return;
    dispatch({ type: 'ROLL_DICE', payload: { playerId: myPlayerId } });
  };

  const toggleKeep = (diceId: string) => {
    if (!isMyTurn || status !== 'Playing' || rollCount === 0 || rollCount >= 3) return;
    dispatch({ type: 'TOGGLE_KEEP_DICE', payload: { playerId: myPlayerId, diceId } });
  };

  const renderGraphics = () => {
    if (status !== 'Playing' && status !== 'Finished') return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
        <h2>Dice (Rolls left: {3 - rollCount})</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          {dice.map((d) => (
            <div 
              key={d.id} 
              onClick={() => toggleKeep(d.id)}
              style={{
                width: '80px',
                height: '80px',
                background: d.kept ? '#22c55e' : 'rgba(255,255,255,0.1)',
                border: d.kept ? '3px solid #4ade80' : '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                cursor: (isMyTurn && rollCount > 0 && rollCount < 3) ? 'pointer' : 'default',
                boxShadow: d.kept ? '0 0 15px rgba(74, 222, 128, 0.5)' : 'none',
                opacity: rollCount === 0 ? 0.3 : 1
              }}
            >
              {rollCount > 0 ? d.value : '?'}
            </div>
          ))}
        </div>

        {status === 'Playing' && (
          <button 
            className="btn primary"
            onClick={handleRoll} 
            disabled={!isMyTurn || rollCount >= 3}
            style={{ 
              padding: '20px 40px', 
              fontSize: '24px', 
              cursor: isMyTurn && rollCount < 3 ? 'pointer' : 'not-allowed',
              opacity: isMyTurn && rollCount < 3 ? 1 : 0.5,
              borderRadius: '12px',
              boxShadow: isMyTurn && rollCount < 3 ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            {isMyTurn ? (rollCount === 0 ? "🎲 ROLL DICE" : `🎲 REROLL DICE`) : "Waiting for turn..."}
          </button>
        )}
      </div>
    );
  };

  const renderPlayerDetails = (playerId: string) => {
    const p = players[playerId];
    return (
      <div style={{ marginTop: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>❤️ {p.health}</div>
        <div style={{ color: '#eab308', fontWeight: 'bold' }}>⭐ {p.vp}</div>
        <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>⚡ {p.energy}</div>
        {p.location === 'TokyoCity' && (
          <div style={{ color: '#a855f7', fontWeight: 'bold', border: '1px solid #a855f7', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
            TOKYO
          </div>
        )}
      </div>
    );
  };

  return (
    <GameLayout
      gameName="King of Tokyo"
      helpText="Roll dice up to 3 times. Reach 20 VP or be the last monster standing!"
      renderGameSpecificPlayerDetails={renderPlayerDetails}
    >
      {renderGraphics()}
    </GameLayout>
  );
};
