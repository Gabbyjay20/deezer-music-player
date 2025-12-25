export default function MusicPlayer({ track, audioRef, onNext, onPrev }) {
  return (
    <footer className="bg-gray-900 text-white p-4">
      {!track ? (
        <div className="text-center text-gray-300">Search and play a track preview 🎶</div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <img
              src={track.album.cover_small}
              alt={`${track.album.title} cover`}
              className="w-12 h-12"
            />
            <div>
              <p className="text-sm font-semibold">{track.title}</p>
              <p className="text-xs opacity-70">{track.artist.name}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button onClick={onPrev}>⏮</button>
            <button onClick={() => audioRef.current?.pause()}>⏸</button>
            <button onClick={() => audioRef.current?.play()}>▶</button>
            <button onClick={onNext}>⏭</button>
          </div>
        </div>
      )}

      {/* Keep the audio element mounted so audioRef.current exists even before first track */}
      <audio ref={audioRef} preload="none" />
    </footer>
  )
}

