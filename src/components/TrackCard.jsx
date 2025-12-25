export default function TrackCard({ track, onPlay }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex gap-4">
      <img
        src={track.album.cover_medium}
        alt={`${track.album.title} cover`}
        className="w-20 h-20 rounded"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{track.title}</h3>
        <p className="text-sm opacity-80">{track.artist.name}</p>
        <p className="text-xs opacity-60">{track.album.title}</p>
        <button onClick={() => onPlay(track)} className="mt-2 text-indigo-500">
          ▶ Play Preview
        </button>
      </div>
    </div>
  )
}

