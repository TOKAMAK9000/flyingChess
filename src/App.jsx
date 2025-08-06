import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GamePage from './pages/GamePage';
import MapEditorPage from './pages/MapEditorPage';
import OptionsEditorPage from './pages/OptionsEditorPage';
import EventModal from './components/EventModal';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <EventModal />
      <div className="relative min-h-screen md:flex bg-gray-900 text-white">
        {/* Sidebar */}
        <aside
          className={`fixed z-20 inset-y-0 left-0 w-64 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:flex-shrink-0`}
        >
          <h1 className="text-2xl font-bold text-red-500 mb-8">飞行棋引擎</h1>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/" className="text-lg hover:text-red-400" onClick={() => setIsSidebarOpen(false)}>游戏</Link>
              </li>
              <li className="mb-4">
                <Link to="/map-editor" className="text-lg hover:text-red-400" onClick={() => setIsSidebarOpen(false)}>地图管理</Link>
              </li>
              <li>
                <Link to="/options-editor" className="text-lg hover:text-red-400" onClick={() => setIsSidebarOpen(false)}>选项库管理</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Hamburger Button */}
          <button
            className="text-white p-2 mb-4 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/map-editor" element={<MapEditorPage />} />
            <Route path="/options-editor" element={<OptionsEditorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
