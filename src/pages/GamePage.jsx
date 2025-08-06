import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import useMapStore from '../store/mapStore';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';

const GamePage = () => {
  const { gameState, setPlayers, startGame } = useGameStore();
  const { maps } = useMapStore();
  
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [selectedMapId, setSelectedMapId] = useState(maps[0]?.id);

  const handlePlayerNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    if (!selectedMapId) {
      alert("请选择一个地图！");
      return;
    }
    const selectedMap = maps.find(m => m.id === selectedMapId);
    const finalPlayerNames = playerNames.slice(0, playerCount).map((name, i) => name || `玩家 ${i + 1}`);
    setPlayers(playerCount, finalPlayerNames);
    startGame(selectedMap);
  };

  if (gameState === 'playing') {
    return (
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0">
          <GameControls />
        </header>
        <main className="flex-grow overflow-auto p-4 bg-gray-900">
          <GameBoard />
        </main>
      </div>
    );
  }

  return (
    <div className="text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-500">开始新游戏</h1>
      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="player-count" className="block mb-2">玩家数量:</label>
          <select
            id="player-count"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
            className="bg-gray-700 border border-gray-600 rounded p-2 w-full"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        {Array.from({ length: playerCount }).map((_, index) => (
          <div key={index}>
            <label htmlFor={`player-name-${index}`} className="block mb-1">玩家 {index + 1} 名称:</label>
            <input
              id={`player-name-${index}`}
              type="text"
              placeholder={`玩家 ${index + 1}`}
              value={playerNames[index]}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              className="w-full bg-gray-700 p-2 rounded"
            />
          </div>
        ))}
        <div>
          <label htmlFor="map-select" className="block mb-2">选择地图:</label>
          <select
            id="map-select"
            value={selectedMapId}
            onChange={(e) => setSelectedMapId(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 w-full"
          >
            {maps.map(map => (
              <option key={map.id} value={map.id}>{map.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStartGame}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          开始游戏
        </button>
      </div>
    </div>
  );
};

export default GamePage;
