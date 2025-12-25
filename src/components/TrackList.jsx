import TrackCard from './TrackCard'

export default function TrackList({ tracks, onPlay }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} onPlay={onPlay} />
      ))}
    </div>
  )
}

