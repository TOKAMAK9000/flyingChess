import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// 默认地图
const defaultMap = {
  id: uuidv4(),
  name: "经典60格地图",
  totalSquares: 60,
  grid: [
    { type: "start", text: "起点" },
    ...Array.from({ length: 58 }, () => ({ type: "normal", text: "" })),
    { type: "finish", text: "终点" }
  ]
};

const useMapStore = create(
  persist(
    (set) => ({
      maps: [defaultMap],
      
      // --- ACTIONS ---

      // 添加新地图
      addMap: (map) => set((state) => ({ maps: [...state.maps, { ...map, id: uuidv4() }] })),

      // 更新地图
      updateMap: (updatedMap) => set((state) => ({
        maps: state.maps.map(map => map.id === updatedMap.id ? updatedMap : map)
      })),

      // 删除地图
      deleteMap: (mapId) => set((state) => ({
        maps: state.maps.filter(map => map.id !== mapId)
      })),

      // 导入地图 (添加，非替换)
      importMaps: (newMaps) => set((state) => {
        // 为导入的地图分配新ID以避免冲突
        const mapsWithNewIds = newMaps.map(map => ({ ...map, id: uuidv4() }));
        return { maps: [...state.maps, ...mapsWithNewIds] };
      }),
    }),
    {
      name: 'fly-chess-map-storage', // local storage中的key
    }
  )
);

export default useMapStore;
