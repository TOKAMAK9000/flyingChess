import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GamePage from './pages/GamePage';
import MapEditorPage from './pages/MapEditorPage';
import OptionsEditorPage from './pages/OptionsEditorPage';
import EventModal from './components/EventModal';

function App() {
  return (
    <Router>
      <EventModal />
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-red-500 mb-8">飞行棋引擎</h1>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/" className="text-lg hover:text-red-400">游戏</Link>
              </li>
              <li className="mb-4">
                <Link to="/map-editor" className="text-lg hover:text-red-400">地图管理</Link>
              </li>
              <li>
                <Link to="/options-editor" className="text-lg hover:text-red-400">选项库管理</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
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
