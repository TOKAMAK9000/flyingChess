import React, { useEffect } from 'react';
import useGameStore from '../store/gameStore';

const EventModal = () => {
  const { lastEvent, clearLastEvent } = useGameStore();

  useEffect(() => {
    // 如果有事件，3秒后自动关闭
    if (lastEvent) {
      const timer = setTimeout(() => {
        clearLastEvent();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent, clearLastEvent]);

  if (!lastEvent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-8 max-w-md w-full text-center text-white shadow-2xl transform transition-all scale-100">
        <h2 className="text-3xl font-bold mb-4 text-red-500">事件发生！</h2>
        <div className="text-lg space-y-2">
          <p>
            玩家 <span className="font-bold text-yellow-400">{lastEvent.player}</span> 掷出了 <span className="font-bold text-green-400">{lastEvent.dice}</span> 点。
          </p>
          <p className="bg-gray-700 p-3 rounded-md">{lastEvent.text}</p>
        </div>
        <button
          onClick={clearLastEvent}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default EventModal;
