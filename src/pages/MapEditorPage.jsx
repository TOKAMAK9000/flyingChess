import React, { useState } from 'react';
import useMapStore from '../store/mapStore';
import useOptionsStore from '../store/optionsStore';

const MapEditorPage = () => {
  const { libraries } = useOptionsStore();
  const { maps, addMap, updateMap, deleteMap, importMaps } = useMapStore();
  const [selectedMap, setSelectedMap] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [applyLibId, setApplyLibId] = useState(libraries[0]?.id);
  const [applyMode, setApplyMode] = useState('random');
  const [rewardCount, setRewardCount] = useState(5);
  const [penaltyCount, setPenaltyCount] = useState(5);

  const handleSelectMap = (map) => {
    setSelectedMap(JSON.parse(JSON.stringify(map)));
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedMap({ name: "新地图", totalSquares: 60, grid: [] });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!selectedMap.name || selectedMap.totalSquares <= 0) {
      alert("地图名称和格子数不能为空或小于等于0");
      return;
    }
    
    const newGrid = Array.from({ length: selectedMap.totalSquares }, (_, i) => {
        const existingSquare = selectedMap.grid[i];
        if (i === 0) return { type: "start", text: "起点" };
        if (i === selectedMap.totalSquares - 1) return { type: "finish", text: "终点" };
        return existingSquare || { type: "normal", text: "" };
    });
    const mapToSave = { ...selectedMap, grid: newGrid };

    if (isCreating) {
      addMap(mapToSave);
    } else {
      updateMap(mapToSave);
    }
    setSelectedMap(null);
    setIsCreating(false);
  };

  const handleDelete = (mapId) => {
    if (window.confirm("确定要删除这个地图吗？")) {
      deleteMap(mapId);
      if (selectedMap?.id === mapId) {
        setSelectedMap(null);
      }
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(maps, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "fly-chess-maps.json";
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      try {
        const newMaps = JSON.parse(e.target.result);
        if (Array.isArray(newMaps) && newMaps.every(m => m.name && m.grid)) {
          if (window.confirm(`确定要导入 ${newMaps.length} 个新地图吗？`)) {
            importMaps(newMaps);
          }
        } else {
          alert("文件格式无效！");
        }
      } catch (error) {
        alert("导入失败，文件可能已损坏。");
      }
    };
    event.target.value = null;
  };

  const handleApplyOptions = () => {
    if (!selectedMap) return;
    const library = libraries.find(l => l.id === applyLibId);
    if (!library || library.options.length === 0) {
      alert("选择的选项库为空或不存在！");
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(selectedMap.grid));
    const normalSquaresIndices = newGrid.map((sq, i) => sq.type === 'normal' ? i : -1).filter(i => i !== -1);
    if (applyMode === 'random') {
      normalSquaresIndices.forEach(index => {
        const randomIndex = Math.floor(Math.random() * library.options.length);
        newGrid[index].text = library.options[randomIndex];
      });
    } else {
      let optionIndex = 0;
      normalSquaresIndices.forEach(index => {
        newGrid[index].text = library.options[optionIndex];
        optionIndex = (optionIndex + 1) % library.options.length;
      });
    }
    setSelectedMap({ ...selectedMap, grid: newGrid });
    alert("选项库已成功应用到普通格子！");
  };

  const handleRandomizeSpecialSquares = () => {
    if (!selectedMap) return;
    let newGrid = JSON.parse(JSON.stringify(selectedMap.grid));
    // Reset all non-start/finish squares to normal
    newGrid = newGrid.map((sq, i) => {
      if (i === 0 || i === newGrid.length - 1) return sq;
      return { type: 'normal', text: sq.text || "" };
    });

    const availableIndices = newGrid.map((sq, i) => sq.type === 'normal' ? i : -1).filter(i => i !== -1);
    if (availableIndices.length < rewardCount + penaltyCount) {
      alert("奖励和惩罚格子总数不能超过可用格子数！");
      return;
    }

    // Shuffle available indices
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    // Apply rewards
    for (let i = 0; i < rewardCount; i++) {
      const index = availableIndices.pop();
      newGrid[index] = { type: 'reward', value: Math.floor(Math.random() * 6) + 1 };
    }

    // Apply penalties
    for (let i = 0; i < penaltyCount; i++) {
      const index = availableIndices.pop();
      newGrid[index] = { type: 'penalty', value: Math.floor(Math.random() * 6) + 1 };
    }

    setSelectedMap({ ...selectedMap, grid: newGrid });
    alert("已随机应用奖励和惩罚格子！");
  };

  return (
    <div className="p-4 text-white flex space-x-4 h-full">
      {/* Map List */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-red-500">地图列表</h2>
        <button onClick={handleCreateNew} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          创建新地图
        </button>
        <ul className="flex-grow overflow-y-auto">
          {maps.map(map => (
            <li key={map.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-700">
              <span onClick={() => handleSelectMap(map)} className="cursor-pointer flex-grow">{map.name}</span>
              <button onClick={() => handleDelete(map.id)} className="bg-red-800 hover:bg-red-900 text-xs font-bold py-1 px-2 rounded">删除</button>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-bold mb-2">数据管理</h3>
          <div className="flex space-x-2">
            <button onClick={handleExport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">导出地图</button>
            <label className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-center">
              导入地图
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Map Editor */}
      <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
        {selectedMap ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-500">{isCreating ? "创建新地图" : "编辑地图"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">地图名称</label>
                <input type="text" value={selectedMap.name} onChange={(e) => setSelectedMap({ ...selectedMap, name: e.target.value })} className="w-full bg-gray-700 p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">格子总数</label>
                <input type="number" value={selectedMap.totalSquares} onChange={(e) => setSelectedMap({ ...selectedMap, totalSquares: parseInt(e.target.value, 10) })} className="w-full bg-gray-700 p-2 rounded" />
              </div>
              
              <div className="bg-gray-900 p-3 rounded-lg space-y-3">
                <div>
                  <h3 className="text-lg font-bold mb-2">应用选项库到普通格</h3>
                  <div className="flex items-end space-x-2">
                    <div className="flex-grow"><label className="block mb-1 text-sm">选择库</label><select value={applyLibId} onChange={e => setApplyLibId(e.target.value)} className="w-full bg-gray-700 p-2 rounded">{libraries.map(lib => (<option key={lib.id} value={lib.id}>{lib.name}</option>))}</select></div>
                    <div className="flex-grow"><label className="block mb-1 text-sm">选择模式</label><select value={applyMode} onChange={e => setApplyMode(e.target.value)} className="w-full bg-gray-700 p-2 rounded"><option value="random">随机</option><option value="sequential">尽可能不重复</option></select></div>
                    <button onClick={handleApplyOptions} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">应用</button>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <h3 className="text-lg font-bold mb-2">随机生成特殊格</h3>
                  <div className="flex items-end space-x-2">
                    <div className="flex-grow"><label className="block mb-1 text-sm">奖励数量</label><input type="number" value={rewardCount} onChange={e => setRewardCount(parseInt(e.target.value, 10))} className="w-full bg-gray-700 p-2 rounded" /></div>
                    <div className="flex-grow"><label className="block mb-1 text-sm">惩罚数量</label><input type="number" value={penaltyCount} onChange={e => setPenaltyCount(parseInt(e.target.value, 10))} className="w-full bg-gray-700 p-2 rounded" /></div>
                    <button onClick={handleRandomizeSpecialSquares} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">随机应用</button>
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto bg-gray-900 p-2 rounded">
                <h3 className="text-lg font-bold mb-2">格子编辑器</h3>
                <div className="space-y-2">
                  {Array.from({ length: selectedMap.totalSquares || 0 }).map((_, index) => {
                    const square = selectedMap.grid[index] || { type: 'normal', text: '' };
                    if (index === 0 || index === (selectedMap.totalSquares - 1)) {
                      return (<div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded"><span className="w-8">{index + 1}.</span><span className="font-bold">{square.type === 'start' ? '起点' : '终点'}</span></div>);
                    }
                    return (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                        <span className="w-8">{index + 1}.</span>
                        <select value={square.type} onChange={(e) => { const newGrid = [...selectedMap.grid]; newGrid[index].type = e.target.value; setSelectedMap({ ...selectedMap, grid: newGrid }); }} className="bg-gray-600 p-1 rounded"><option value="normal">普通</option><option value="reward">奖励</option><option value="penalty">惩罚</option></select>
                        {square.type === 'normal' ? (<input type="text" placeholder="普通格文本" value={square.text || ''} onChange={(e) => { const newGrid = [...selectedMap.grid]; newGrid[index].text = e.target.value; setSelectedMap({ ...selectedMap, grid: newGrid }); }} className="w-full bg-gray-600 p-1 rounded" />) : (<input type="number" placeholder="步数" value={square.value || 0} onChange={(e) => { const newGrid = [...selectedMap.grid]; newGrid[index].value = parseInt(e.target.value, 10) || 0; setSelectedMap({ ...selectedMap, grid: newGrid }); }} className="w-full bg-gray-600 p-1 rounded" />)}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{isCreating ? "创建地图" : "保存更改"}</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full"><p className="text-gray-400 text-xl">从左侧选择一个地图进行编辑，或创建一个新地图。</p></div>
        )}
      </div>
    </div>
  );
};

export default MapEditorPage;
