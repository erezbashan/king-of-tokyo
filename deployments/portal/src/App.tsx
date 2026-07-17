import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Lobby } from '@erez/boardgame-core';
import { useReducer, useEffect } from 'react';
import { FlipsBoard, flipsReducer, initialFlipsState } from '@erez/flips';

function GameSelector() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>Erez Boardgames</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div 
          onClick={() => navigate('/flips')}
          style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center', minWidth: '200px' }}
        >
          <h2>Flips</h2>
          <p>A simple test game</p>
        </div>
        <div 
          onClick={() => navigate('/kot')}
          style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center', minWidth: '200px' }}
        >
          <h2>King of Tokyo</h2>
          <p>The main event</p>
        </div>
      </div>
    </div>
  );
}

function GameLobbyWrapper() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const handleCreateGame = (username: string) => {
    console.log(`Create ${gameType} game with username:`, username);
    const mockId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/${gameType}/${mockId}`);
  };

  const handleJoinGame = (gameId: string, username: string) => {
    console.log(`Join ${gameType} game:`, gameId, "as", username);
    navigate(`/${gameType}/${gameId}`);
  };

  const formattedTitle = gameType === 'kot' ? 'King of Tokyo Lobby' : 'Flips Lobby';

  return (
    <Lobby 
      title={formattedTitle}
      onCreateGame={handleCreateGame}
      onJoinGame={handleJoinGame}
      pendingGames={gameType === 'flips' ? [
        { id: "FLIP-111", gameType: "Flips", playersCount: 1, status: "Lobby" }
      ] : [
        { id: "KOT-123", gameType: "King of Tokyo", playersCount: 2, status: "Lobby" }
      ]}
    />
  );
}

function ActiveFlipsGame({ gameId }: { gameId: string }) {
  const [state, dispatch] = useReducer(flipsReducer, initialFlipsState);
  const navigate = useNavigate();
  
  // Simulate joining the game for local testing
  useEffect(() => {
    dispatch({ type: 'JOIN_GAME', payload: { playerId: 'p1', name: 'Erez', isBot: false } });
  }, [gameId]);

  return <FlipsBoard gameState={state} myPlayerId="p1" dispatch={dispatch} onLeaveGame={() => navigate('/flips')} />;
}

function ActiveGameWrapper() {
  const { gameType, gameId } = useParams();
  const navigate = useNavigate();

  if (gameType === 'flips') {
    return <ActiveFlipsGame gameId={gameId!} />;
  }

  return (
    <div style={{ padding: '40px', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Playing {gameType?.toUpperCase()}</h1>
      <p>Game ID: {gameId}</p>
      <button 
        onClick={() => navigate(`/${gameType}`)} 
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white' }}
      >
        Leave Game
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameSelector />} />
      <Route path="/:gameType" element={<GameLobbyWrapper />} />
      <Route path="/:gameType/:gameId" element={<ActiveGameWrapper />} />
    </Routes>
  );
}

export default App;
