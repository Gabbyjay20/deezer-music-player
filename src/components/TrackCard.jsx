export default function TrackCard({ track, onPlay, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex gap-4">
      <img
        src={track.album.cover_medium}
        alt={`${track.album.title} cover`}
        className="w-20 h-20 rounded"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm opacity-80 truncate">{track.artist.name}</p>
            <p className="text-xs opacity-60 truncate">{track.album.title}</p>
          </div>

          {typeof onToggleFavorite === 'function' && (
            <button
              type="button"
              onClick={() => onToggleFavorite(track)}
              className={`text-lg leading-none ${
                isFavorite ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          )}
        </div>
        <button onClick={() => onPlay(track)} className="mt-2 text-indigo-500">
          ▶ Play Preview
        </button>
      </div>
    </div>
  )
}

