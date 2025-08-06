import React from 'react';
import useGameStore from '../store/gameStore';

const GameBoard = () => {
  const { activeMap, players } = useGameStore();

  if (!activeMap) {
    return <div>请先选择地图并开始游戏。</div>;
  }

  const { grid } = activeMap;

  // 创建一个位置到玩家的映射
  const playerPositions = {};
  players.forEach(player => {
    if (!playerPositions[player.position]) {
      playerPositions[player.position] = [];
    }
    playerPositions[player.position].push(player);
  });

  const squaresPerRow = 10;
  const numRows = Math.ceil(grid.length / squaresPerRow);

  const boardRows = [];
  for (let i = 0; i < numRows; i++) {
    const rowSquares = grid.slice(i * squaresPerRow, (i + 1) * squaresPerRow);
    if (i % 2 !== 0) {
      // Odd rows (1, 3, 5...) go right-to-left
      rowSquares.reverse();
    }
    boardRows.push(rowSquares);
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg w-full h-full flex flex-col space-y-2">
      {boardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-10 gap-2">
          {row.map((square, squareIndex) => {
            // We need the original index to check for players
            const originalIndex = grid.indexOf(square);
            return (
              <div
                key={squareIndex}
                className={`h-24 w-full rounded flex items-center justify-center text-white font-bold text-lg relative border-2 border-gray-700
                  ${square.type === 'start' && 'bg-green-600 border-green-400'}
                  ${square.type === 'finish' && 'bg-yellow-500 border-yellow-300'}
                  ${square.type === 'normal' && 'bg-gray-600'}
                  ${square.type === 'reward' && 'bg-blue-500 border-blue-300'}
                  ${square.type === 'penalty' && 'bg-red-800 border-red-600'}
                `}
              >
                <span className="text-shadow-lg">{originalIndex + 1}</span>
                {/* Player Icons */}
                <div className="absolute bottom-1 right-1 flex flex-wrap">
                  {playerPositions[originalIndex] && playerPositions[originalIndex].map(p => (
                    <div
                      key={p.id}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
