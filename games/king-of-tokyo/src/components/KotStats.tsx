import React from 'react';
import type { KotState } from '../engine/reducer';
import { Modal, LineChartWidget, TimelineBarWidget, LineChartData, LineConfig, TimelineSegment, PLAYER_COLORS } from '@erez/boardgame-core';

interface KotStatsProps {
  gameState: KotState;
  onClose: () => void;
}

export const KotStats: React.FC<KotStatsProps> = ({ gameState, onClose }) => {
  const { players, history, playerOrder } = gameState;

  // 1. Prepare Table Data
  const tableData = playerOrder.map(id => players[id]);

  // 2. Prepare Line Chart Data
  const vpData: LineChartData[] = [];
  const healthData: LineChartData[] = [];
  
  history.forEach(snapshot => {
    const vpEntry: LineChartData = { name: `T${snapshot.turnNum}` };
    const hpEntry: LineChartData = { name: `T${snapshot.turnNum}` };
    
    playerOrder.forEach(id => {
      vpEntry[players[id].name] = snapshot.vps[id] || 0;
      hpEntry[players[id].name] = snapshot.healths[id] || 0;
    });
    
    vpData.push(vpEntry);
    healthData.push(hpEntry);
  });

  const lines: LineConfig[] = playerOrder.map((id, index) => ({
    key: players[id].name,
    color: players[id].color || PLAYER_COLORS[index % PLAYER_COLORS.length],
    name: players[id].name
  }));

  // 3. Prepare Timeline Bar Data
  const tokyoData: TimelineSegment[] = history.map(snapshot => {
    let color = 'rgba(255,255,255,0.1)';
    let label = 'Empty';
    if (snapshot.tokyoOccupant) {
      const occupant = players[snapshot.tokyoOccupant];
      const index = playerOrder.indexOf(snapshot.tokyoOccupant);
      color = occupant.color || PLAYER_COLORS[index % PLAYER_COLORS.length];
      label = occupant.name;
    }
    return {
      name: snapshot.turnNum,
      color,
      label
    };
  });

  return (
    <Modal isOpen={true} onClose={onClose} title="Game Statistics" width="800px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Table Stats */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Player Totals</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '10px' }}>Player</th>
                <th style={{ padding: '10px' }}>❤️ Healed</th>
                <th style={{ padding: '10px' }}>⚡ Gained</th>
                <th style={{ padding: '10px' }}>💥 Dealt</th>
                <th style={{ padding: '10px' }}>💀 Kills</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                  <td style={{ padding: '10px' }}>{p.stats.healthHealed}</td>
                  <td style={{ padding: '10px' }}>{p.stats.energyGained}</td>
                  <td style={{ padding: '10px' }}>{p.stats.damageDealt}</td>
                  <td style={{ padding: '10px' }}>{p.stats.playersKilled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        {history.length > 0 ? (
          <>
            <LineChartWidget title="VP Progression" data={vpData} lines={lines} height={200} />
            <LineChartWidget title="Health Progression" data={healthData} lines={lines} height={200} />
            <TimelineBarWidget title="Tokyo Occupancy" data={tokyoData} height={40} />
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'gray', fontStyle: 'italic' }}>Play a few turns to see graphs!</p>
        )}
      </div>
    </Modal>
  );
};
