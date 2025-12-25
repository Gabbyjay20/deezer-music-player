import { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import MusicPlayer from './components/MusicPlayer'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (!query) return
    const fetchTracks = async () => {
      try {
        setLoading(true)
        setError('')
        // Use same-origin API route.
        // - Local dev: Vite proxies /api/* to https://api.deezer.com (see vite.config.js)
        // - Production (Vercel): serverless function in /api/search.js fetches Deezer server-side
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!data.data || data.data.length === 0) {
          setTracks([])
          setError('No tracks found. Try another search.')
        } else {
          setTracks(data.data)
        }
      } catch {
        setError('Network error. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [query])

  const playTrack = (track) => {
    if (!audioRef.current || !track?.preview) return
    setCurrentTrack(track)
    audioRef.current.src = track.preview
    audioRef.current.play()
  }

  const skipTrack = (direction) => {
    if (!currentTrack) return
    const index = tracks.findIndex((t) => t.id === currentTrack.id)
    const nextIndex =
      direction === 'next'
        ? (index + 1) % tracks.length
        : (index - 1 + tracks.length) % tracks.length
    playTrack(tracks[nextIndex])
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
      <header className="flex justify-between items-center bg-indigo-600 text-white p-4">
        <h1 className="text-xl font-bold">🎧 Deezer Music Player</h1>
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>

      <main className="flex-1 container mx-auto p-4">
        <SearchBar onSearch={setQuery} />
        {loading && <p className="mt-6 text-center">Loading tracks...</p>}
        {error && <p className="mt-6 text-center text-red-400">{error}</p>}
        <TrackList tracks={tracks} onPlay={playTrack} />
      </main>

      <MusicPlayer
        track={currentTrack}
        audioRef={audioRef}
        onNext={() => skipTrack('next')}
        onPrev={() => skipTrack('prev')}
      />
    </div>
  )
}

