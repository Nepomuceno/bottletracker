import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="px-6 py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm text-white border-b border-slate-700/50">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.svg" alt="Bottle Tracker Logo" className="w-10 h-10" />
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-emerald-400">Bottle Tracker</span>
          </h1>
          <p className="text-xs text-gray-500">Carbon Footprint Calculator</p>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <a
          href="https://www.microsoft.com/en-us/sustainability"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-emerald-400 transition-colors hidden sm:block"
        >
          Learn About Sustainability
        </a>
      </div>
    </header>
  )
}
