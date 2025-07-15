import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import Landing from './pages/Landing.jsx'
import VideoPage from './pages/VideoPage.jsx'
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
      </Routes>
    </div>
  )
}

export default App