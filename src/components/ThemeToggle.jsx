export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="bg-white/20 px-3 py-1 rounded"
    >
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

