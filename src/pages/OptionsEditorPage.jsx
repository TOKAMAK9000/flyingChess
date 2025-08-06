import React, { useState } from 'react';
import useOptionsStore from '../store/optionsStore';

const OptionsEditorPage = () => {
  const { libraries, addLibrary, updateLibrary, deleteLibrary, importLibraries } = useOptionsStore();
  const [selectedLib, setSelectedLib] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectLib = (lib) => {
    setSelectedLib(JSON.parse(JSON.stringify(lib)));
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedLib({ name: "新选项库", options: ["新选项1", "新选项2"] });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!selectedLib.name) {
      alert("选项库名称不能为空！");
      return;
    }
    if (isCreating) {
      addLibrary(selectedLib);
    } else {
      updateLibrary(selectedLib);
    }
    setSelectedLib(null);
    setIsCreating(false);
  };

  const handleDelete = (libId) => {
    if (window.confirm("确定要删除这个选项库吗？")) {
      deleteLibrary(libId);
      if (selectedLib?.id === libId) {
        setSelectedLib(null);
      }
    }
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...selectedLib.options];
    newOptions[index] = text;
    setSelectedLib({ ...selectedLib, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...selectedLib.options, "新选项"];
    setSelectedLib({ ...selectedLib, options: newOptions });
  };

  const handleRemoveOption = (index) => {
    const newOptions = selectedLib.options.filter((_, i) => i !== index);
    setSelectedLib({ ...selectedLib, options: newOptions });
  };

  const handleExport = () => {
    if (!selectedLib) {
      alert("请先选择一个要导出的选项库。");
      return;
    }
    const textString = selectedLib.options.join('\n');
    const blob = new Blob([textString], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedLib.name}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      const text = e.target.result;
      const options = text.split(/\r?\n/).filter(line => line.trim() !== '');
      const libraryName = file.name.replace(/\.[^/.]+$/, ""); // Use filename as library name
      
      if (window.confirm(`要导入 "${libraryName}" 并创建新的选项库吗？`)) {
        addLibrary({ name: libraryName, options });
      }
    };
    // Clear the input value to allow re-importing the same file
    event.target.value = null;
  };

  return (
    <div className="p-4 text-white flex space-x-4 h-full">
      {/* Library List */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-red-500">选项库列表</h2>
        <button onClick={handleCreateNew} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          创建新选项库
        </button>
        <ul className="flex-grow overflow-y-auto">
          {libraries.map(lib => (
            <li key={lib.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-700">
              <span onClick={() => handleSelectLib(lib)} className="cursor-pointer flex-grow">{lib.name}</span>
              <button onClick={() => handleDelete(lib.id)} className="bg-red-800 hover:bg-red-900 text-xs font-bold py-1 px-2 rounded">删除</button>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-bold mb-2">数据管理</h3>
          <p className="text-xs text-gray-400 mb-2">导入/导出为纯文本(.txt)文件，每行一个选项。</p>
          <div className="flex space-x-2">
            <button onClick={handleExport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">导出选中库</button>
            <label className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-center">
              导入新库
              <input type="file" accept=".txt" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Options Editor */}
      <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
        {selectedLib ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-500">{isCreating ? "创建新选项库" : "编辑选项库"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">选项库名称</label>
                <input
                  type="text"
                  value={selectedLib.name}
                  onChange={(e) => setSelectedLib({ ...selectedLib, name: e.target.value })}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
              <div className="h-96 overflow-y-auto bg-gray-900 p-2 rounded">
                <h3 className="text-lg font-bold mb-2">选项列表</h3>
                <div className="space-y-2">
                  {selectedLib.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(e.target.value, index)}
                        className="w-full bg-gray-700 p-2 rounded"
                      />
                      <button onClick={() => handleRemoveOption(index)} className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-3 rounded">X</button>
                    </div>
                  ))}
                </div>
                <button onClick={handleAddOption} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">添加新选项</button>
              </div>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {isCreating ? "创建" : "保存"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xl">从左侧选择一个选项库进行编辑，或创建一个新库。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsEditorPage;
