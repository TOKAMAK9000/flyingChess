import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// 默认选项库
const defaultOptions = {
  id: uuidv4(),
  name: "趣味冷笑话",
  options: [
    "为什么程序员喜欢在黑暗模式下工作？因为光会产生bug（光虫）。",
    "一个SQL查询走进一家酒吧，径直走向两张桌子，然后问道：‘我可以加入你们吗？’",
    "“!false” 这句话是真的。",
  ]
};

const useOptionsStore = create(
  persist(
    (set) => ({
      libraries: [defaultOptions],
      
      // --- ACTIONS ---

      // 添加新选项库
      addLibrary: (library) => set((state) => ({ libraries: [...state.libraries, { ...library, id: uuidv4() }] })),

      // 更新选项库
      updateLibrary: (updatedLibrary) => set((state) => ({
        libraries: state.libraries.map(lib => lib.id === updatedLibrary.id ? updatedLibrary : lib)
      })),

      // 删除选项库
      deleteLibrary: (libraryId) => set((state) => ({
        libraries: state.libraries.filter(lib => lib.id !== libraryId)
      })),

      // 导入选项库 (替换所有)
      importLibraries: (newLibraries) => set({ libraries: newLibraries }),
    }),
    {
      name: 'fly-chess-options-storage', // local storage中的key
    }
  )
);

export default useOptionsStore;
