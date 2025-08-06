import React from 'react';
import useGameStore from '../store/gameStore';

const GameControls = () => {
  const { players, currentPlayerIndex, rollDice, resetGame } = useGameStore();
  
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="mb-4 p-4 bg-gray-900 rounded-lg flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">当前玩家: 
          <span style={{ color: currentPlayer?.color }}> {currentPlayer?.name}</span>
        </h2>
        {/* 可以添加更多游戏信息，如骰子结果 */}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={rollDice}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          掷骰子
        </button>
        <button
          onClick={resetGame}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          重置游戏
        </button>
      </div>
    </div>
  );
};

export default GameControls;
