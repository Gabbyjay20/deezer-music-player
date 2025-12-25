import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(value)
      }}
      className="flex gap-2"
    >
      <input
        className="flex-1 p-2 rounded border dark:bg-gray-800"
        placeholder="Search song, artist, or album"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="bg-indigo-600 text-white px-4 rounded">Search</button>
    </form>
  )
}

