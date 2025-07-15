import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaPlay, FaTwitter, FaVideo, FaList, FaUsers } from 'react-icons/fa'

function Home() {
  const features = [
    {
      title: 'Your Own Channel',
      description: 'Create and personalize your own channel to showcase your content and build your audience.',
      icon: <FaUser className="text-red-500 text-5xl" />,
    },
    {
      title: 'Watch Videos',
      description: 'Explore and watch videos from any channel on the platform, anytime, anywhere.',
      icon: <FaPlay className="text-red-500 text-5xl" />,
    },
    {
      title: 'Post Tweets',
      description: 'Share your thoughts and updates by posting tweets directly on your channel.',
      icon: <FaTwitter className="text-red-500 text-5xl" />,
    },
    {
      title: 'Upload Videos',
      description: 'Easily upload your own videos to engage your followers and grow your channel.',
      icon: <FaVideo className="text-red-500 text-5xl" />,
    },
    {
      title: 'Create Playlists',
      description: 'Organize your favorite videos into custom playlists for easy access and sharing.',
      icon: <FaList className="text-red-500 text-5xl" />,
    },
    {
      title: 'Follow & Interact',
      description: 'Follow other users’ channels, like, comment, and interact to stay connected.',
      icon: <FaUsers className="text-red-600 text-5xl" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-600 to-red-700 shadow-md z-10">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* Logo Placeholder */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red rounded-full flex items-center justify-center text-white font-bold">
              <FaPlay className="text-white-800 text-xl ml-1" />
            </div>
            <span className="ml-3 text-2xl font-semibold text-white">YouTube</span>
          </div>
          {/* Navigation Links */}
          <nav className="space-x-3">
            <Link
              to="/login"
              className="text-white hover:text-indigo-200 font-semibold font-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-indigo-200 font-semibold font-medium px-5"
            >
              <button className="bg-purple-700 text-white px-4  py-2 rounded-md hover:bg-purple-800 focus:outline-none">
                Sign Up
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 pb-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-3 mt-10">
          Welcome to the Social Media App
        </h1>
        <p className="text-center text-lg text-gray-700 mb-4 max-w-xl mx-auto">
          Discover a platform where you can create, share, and connect through videos, tweets, and channels.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols- sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 pr-6 pl-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 bg-opacity-80 backdrop-blur-md rounded-lg shadow-md p-2 flex flex-col items-center justify-between h-56 w-full aspect-square hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 pt-10 flex items-center justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 text-center pt-3">{feature.title}</h3>
              <p className="text-gray-600 text-center text-base pb-6">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home