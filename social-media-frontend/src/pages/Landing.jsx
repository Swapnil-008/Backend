import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPlay, FaHome, FaThumbsUp, FaUser, FaBook,
  FaBars, FaQuestionCircle, FaCog
} from 'react-icons/fa'
import axios from 'axios'

function Landing() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/api/v1/videos', {
          params: { page: 1, limit: 12 }
        })
        const filteredVideos = response.data.data.docs.filter(video => video.owner._id !== userId)
        setVideos(filteredVideos)
      } catch (err) {
        setError('Failed to fetch videos. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [userId])

  const formatTimeAgo = (createdAt) => {
    if (!createdAt) return ''
    const now = new Date()
    const createdDate = new Date(createdAt)
    const seconds = Math.floor((now - createdDate) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} days ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} weeks ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} months ago`
    const years = Math.floor(days / 365)
    return `${years} years ago`
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-md z-10 pt-16 flex flex-col justify-between">
          <div>
            <nav className="p-4 space-y-2">
              <Link to="/landing" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaHome className="mr-2" /> Home
              </Link>
              <Link to="/liked" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaThumbsUp className="mr-2" /> Liked Videos
              </Link>
              <Link to="/subscriptions" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaUser className="mr-2" /> Subscriptions
              </Link>
              <Link to="/library" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaBook className="mr-2" /> My Content
              </Link>
              <Link to="/collections" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaBook className="mr-2" /> Collections
              </Link>
              <Link to="/subscribers" className="flex items-center p-2 hover:bg-red-800 rounded">
                <FaUser className="mr-2" /> Subscribers
              </Link>
            </nav>
          </div>
          <div className="p-4 space-y-2 border-t border-gray-700">
            <Link to="/support" className="flex items-center p-2 hover:bg-red-800 rounded">
              <FaQuestionCircle className="mr-2" /> Support
            </Link>
            <Link to="/settings" className="flex items-center p-2 hover:bg-red-800 rounded">
              <FaCog className="mr-2" /> Settings
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} flex-1 flex flex-col`}>
        {/* Header */}
        <header className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-red-800 to-red-700 shadow-md z-20 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="text-white text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars />
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red rounded-full flex items-center justify-center text-white font-bold">
                <FaPlay className="text-white text-xl ml-1" />
              </div>
              <span className="text-2xl font-semibold text-white">YouTube</span>
            </div>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-full bg-white text-black focus:outline-none"
            />
          </div>
          <div className="text-white flex items-center gap-4">{/* Future icons */}</div>
        </header>

        {/* Scrollable Main Content */}
        <main className="pt-20 pb-8 px-6 overflow-y-auto flex-1 bg-gray-900">
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {loading ? (
            <p className="text-center text-gray-600">Loading videos...</p>
          ) : videos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link to={`/video/${video._id}`} key={video._id}>
                  <div
                    className="bg-white rounded-md shadow hover:shadow-lg transition duration-200 cursor-pointer"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-md" 
                    />
                    <div className="flex p-3 bg-gray-200"> {/* Changed to bg-gray-200 for lightish white-grey */}
                      <img
                        src={video.owner.avatar || './default.user.jpeg'}
                        alt={video.owner.username}
                        className="w-10 h-10 rounded-full mr-3 border-1 border-black"
                      />
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{video.title}</h3>
                        <p className="text-black text-sm">
                          {video.owner.username} • {video.views} views • {formatTimeAgo(video.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No videos available.</p>
          )}
        </main>
      </div>
    </div>
  )
}

export default Landing