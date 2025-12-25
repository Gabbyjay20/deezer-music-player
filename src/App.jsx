import { useEffect, useMemo, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import MusicPlayer from './components/MusicPlayer'
import ThemeToggle from './components/ThemeToggle'
import useLocalStorageState from './lib/useLocalStorageState'

export default function App() {
  const [view, setView] = useState('search') // 'search' | 'favorites'
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [notice, setNotice] = useState('')

  const [user, setUser] = useLocalStorageState('dmp:user', null)
  const [favorites, setFavorites] = useLocalStorageState('dmp:favorites', [])
  const [loginName, setLoginName] = useState('')

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

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 2500)
    return () => clearTimeout(t)
  }, [notice])

  const favoriteIdSet = useMemo(() => {
    return new Set((favorites || []).map((t) => t.id))
  }, [favorites])

  const isFavorite = (trackId) => favoriteIdSet.has(trackId)

  const toggleFavorite = (track) => {
    if (!user) {
      setNotice('Log in to save favorites.')
      return
    }
    setFavorites((prev) => {
      const list = Array.isArray(prev) ? prev : []
      const exists = list.some((t) => t.id === track.id)
      if (exists) return list.filter((t) => t.id !== track.id)

      // store a compact subset (enough to render + play preview)
      const compact = {
        id: track.id,
        title: track.title,
        preview: track.preview,
        artist: { name: track.artist?.name },
        album: {
          title: track.album?.title,
          cover_small: track.album?.cover_small,
          cover_medium: track.album?.cover_medium,
        },
      }
      return [compact, ...list]
    })
  }

  const playTrack = (track) => {
    if (!audioRef.current || !track?.preview) return
    setCurrentTrack(track)
    audioRef.current.src = track.preview

    // Ensure the new source is loaded before attempting playback.
    // Catch play() rejections (autoplay policy, unsupported format, etc.)
    try {
      audioRef.current.load()
      const p = audioRef.current.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          setNotice(
            'Playback was blocked by the browser. Click ▶ in the player controls to start audio.'
          )
        })
      }
    } catch {
      setNotice('Unable to start playback for this preview.')
    }
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
      <header className="bg-indigo-600 text-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-xl font-bold">🎧 Deezer Music Player</h1>

            <nav className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setView('search')}
                className={`px-3 py-1 rounded bg-white/20 ${
                  view === 'search' ? 'ring-2 ring-white/70' : ''
                }`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setView('favorites')}
                className={`px-3 py-1 rounded bg-white/20 ${
                  view === 'favorites' ? 'ring-2 ring-white/70' : ''
                }`}
              >
                Favorites ({favorites?.length || 0})
              </button>
            </nav>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="opacity-90">Hi, {user.name}</span>
                <button
                  type="button"
                  onClick={() => setUser(null)}
                  className="bg-white/20 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const name = loginName.trim()
                  if (!name) return
                  setUser({ name })
                  setLoginName('')
                  setNotice(`Logged in as ${name}`)
                }}
                className="flex items-center gap-2"
              >
                <input
                  className="w-40 sm:w-48 p-2 rounded text-gray-900 placeholder:text-gray-500"
                  placeholder="Enter name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
                <button type="submit" className="bg-white/20 px-3 py-1 rounded">
                  Login
                </button>
              </form>
            )}

            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        {notice && (
          <p className="mt-4 text-center text-sm text-indigo-600 dark:text-indigo-300">
            {notice}
          </p>
        )}

        {view === 'search' ? (
          <>
            <SearchBar onSearch={setQuery} />
            {loading && <p className="mt-6 text-center">Loading tracks...</p>}
            {error && <p className="mt-6 text-center text-red-400">{error}</p>}
            <TrackList
              tracks={tracks}
              onPlay={playTrack}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Your Favorites</h2>
              {!user && (
                <span className="text-sm opacity-70">Log in to save favorites</span>
              )}
            </div>

            {!user ? (
              <p className="mt-6 text-center opacity-80">
                Log in (top right) to start saving favorites.
              </p>
            ) : favorites.length === 0 ? (
              <p className="mt-6 text-center opacity-80">
                No favorites yet. Go to Search and tap the ♡ on a track.
              </p>
            ) : (
              <TrackList
                tracks={favorites}
                onPlay={playTrack}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </>
        )}
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

