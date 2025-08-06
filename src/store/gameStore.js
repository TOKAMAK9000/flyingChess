import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set) => ({
      // 游戏状态: 'setup', 'playing', 'finished'
      gameState: 'setup',
      
      // 玩家列表
      players: [],
      
      // 当前回合的玩家索引
      currentPlayerIndex: 0,
      
      // 当前地图配置
      activeMap: null,

      // 记录上一个发生的事件，用于UI提示
      lastEvent: null,


      // --- ACTIONS ---

      // 设置玩家
      setPlayers: (playerCount, playerNames) => {
        const colors = ['#ff4d4d', '#4d4dff', '#4dff4d', '#ffff4d'];
        const newPlayers = [];
        for (let i = 0; i < playerCount; i++) {
          newPlayers.push({
            id: i + 1,
            name: playerNames[i] || `玩家 ${i + 1}`,
            color: colors[i],
            position: 0, // 所有玩家从起点开始
          });
        }
        set({ players: newPlayers });
      },

      // 开始游戏
      startGame: (map) => set({ activeMap: map, gameState: 'playing', currentPlayerIndex: 0 }),

      // 掷骰子并移动玩家
      rollDice: () => {
        set((state) => {
          if (state.gameState !== 'playing' || !state.activeMap) return {};

          const diceResult = Math.floor(Math.random() * 6) + 1;
          const currentPlayer = state.players[state.currentPlayerIndex];
          let newPosition = currentPlayer.position + diceResult;
          let event = { player: currentPlayer.name, dice: diceResult, text: '' };
          let newSequentialIndex = { ...state.sequentialOptionIndex };

          // 检查是否到达或超过终点
          if (newPosition >= state.activeMap.totalSquares - 1) {
            newPosition = state.activeMap.totalSquares - 1;
            event.text = `恭喜 ${currentPlayer.name} 到达终点！`;
            // 可以在这里添加游戏结束逻辑
          } else {
            const square = state.activeMap.grid[newPosition];
            switch (square.type) {
              case 'reward':
                newPosition += square.value || 1;
                event.text = `奖励！前进 ${square.value || 1} 步！`;
                break;
              case 'penalty':
                newPosition -= square.value || 1;
                if (newPosition < 0) newPosition = 0;
                event.text = `惩罚！后退 ${square.value || 1} 步！`;
                break;
              case 'normal':
                event.text = square.text || `安全。`;
                break;
              default:
                event.text = `前进了 ${diceResult} 步。`;
            }
          }
          
          // 再次检查是否超过终点
          if (newPosition >= state.activeMap.totalSquares - 1) {
            newPosition = state.activeMap.totalSquares - 1;
          }

          const updatedPlayers = state.players.map((p, index) =>
            index === state.currentPlayerIndex ? { ...p, position: newPosition } : p
          );

          const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

          return { 
            players: updatedPlayers, 
            currentPlayerIndex: nextPlayerIndex,
            lastEvent: event
          };
        });
      },

      // 重置游戏
      resetGame: () => set({ gameState: 'setup', players: [], currentPlayerIndex: 0, activeMap: null, lastEvent: null }),

      // 清除事件
      clearLastEvent: () => set({ lastEvent: null }),
    }),
    {
      name: 'fly-chess-game-storage', // local storage中的key
    }
  )
);

export default useGameStore;
