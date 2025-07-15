import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaPlay, FaThumbsUp, FaComment, FaShare, FaHome, FaUser, FaBook, FaBars } from 'react-icons/fa'
import axios from 'axios'
import defaultAvatar from '../assets/default.user.jpeg'

function VideoPage() {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [recommendedVideos, setRecommendedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/v1/videos/${videoId}`)
        setVideo(response.data.data)
        // Fetch recommended videos from the same owner
        const recResponse = await axios.get('/api/v1/videos/', {
          params: {
            userId: response.data.data.owner._id,
            page: 1,
            limit: 5, // Limit to 5 recommended videos
            sortBy: 'createdAt',
            sortType: 'desc'
          }
        })
        setRecommendedVideos(recResponse.data.data.docs.filter(v => v._id !== videoId)) // Exclude the current video
      } catch (err) {
        setError('Failed to fetch video details.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId])

  if (loading) return <p className="text-center text-gray-600">Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!video) return <p className="text-center text-gray-600">Video not found.</p>

  const owner = video.owner || {};

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-md z-10 transition-all duration-300 ${sidebarOpen ? 'w-64 pt-16' : 'w-16 pt-16'}`}>
        {/* Change made here: Updated bg-gray-800 to bg-gray-900 to match the page's main background */}
        <button
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 text-white text-xl p-2 bg-gray-900 rounded-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <nav className="p-4 space-y-2">
          <Link to="/landing" className={`flex items-center p-2 hover:bg-red-800 rounded ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <FaHome className={`${sidebarOpen ? 'mr-2 text-base' : 'text-2xl mx-auto'}`} />
            {sidebarOpen && <span>Home</span>}
          </Link>
          <Link to="/liked" className={`flex items-center p-2 hover:bg-red-800 rounded ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <FaThumbsUp className={`${sidebarOpen ? 'mr-2 text-base' : 'text-2xl mx-auto'}`} />
            {sidebarOpen && <span>Liked Videos</span>}
          </Link>
          <Link to="/subscriptions" className={`flex items-center p-2 hover:bg-red-800 rounded ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <FaUser className={`${sidebarOpen ? 'mr-2 text-base' : 'text-2xl mx-auto'}`} />
            {sidebarOpen && <span>Subscriptions</span>}
          </Link>
          <Link to="/library" className={`flex items-center p-2 hover:bg-red-800 rounded ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <FaBook className={`${sidebarOpen ? 'mr-2 text-base' : 'text-2xl mx-auto'}`} />
            {sidebarOpen && <span>My Content</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} flex-1 flex flex-col`}>
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

        {/* Video Details and Recommendations */}
        <main className="pt-20 pb-8 px-6 overflow-y-auto flex-1 flex bg-gray-900"> 
          {/* Left Column: Video Player and Details */}
          <div className="w-2/3 pr-6">
            <div className="w-full aspect-video mb-4">
              <video
                controls
                className="w-full h-full object-cover rounded-md"
                src={video.videoFile}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className="text-2xl text-white font-bold mb-2">{video.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={owner.avatar || defaultAvatar}
                  alt={owner.username || 'Unknown User'}
                  className="w-10 h-10 rounded-full mr-3  border-1 border-black"
                />
                <div>
                  <Link to={`/channel/${owner.username}`} className="text-lg text-white font-semibold hover:underline">
                    {owner.username || 'Unknown User'}
                  </Link>
                  <p className="text-sm text-gray-400">{video.views} views</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <FaThumbsUp className="mr-2" /> Like
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <FaComment className="mr-2" /> Comment
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <FaShare className="mr-2" /> Share
                </button>
              </div>
            </div>
            <p className="text-white mb-4">{video.description}</p>
            <div className="mt-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Comments</h2>
              {/* Comments section placeholder */}
              <div className="space-y-4">
                {/* Add dynamic comments here using video._id with getVideoComments API */}
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-800">Sample comment</p>
                  <p className="text-sm text-gray-500">User • 5 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Videos */}
          <div className="w-1/3 text-white">
            <h2 className="text-xl font-semibold mb-4">Recommended</h2>
            {recommendedVideos.length > 0 ? (
              <div className="space-y-4 ">
                {recommendedVideos.map((recVideo) => (
                  <Link to={`/video/${recVideo._id}`} key={recVideo._id}>
                    <div className="group flex items-center cursor-pointer hover:bg-white p-2 rounded">
                      <img
                        src={recVideo.thumbnail}
                        alt={recVideo.title}
                        className="w-15 h-16 object-cover mr-2"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-white group-hover:text-black">
                          {recVideo.title}
                        </h3>
                        <p className="text-xs text-gray-400 group-hover:text-black">
                          {recVideo.owner.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recommended videos available.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default VideoPage