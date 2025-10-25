export default function Header() {
  return (
    <header className="border-b bg-mhbg">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-display">Modern Solvra</span>
          <span className="text-sm text-mhmuted hidden md:inline">Automated Attendance & Marks</span>
        </div>

        <nav className="space-x-4">
          <a className="text-sm text-mhmuted hover:text-mhcharcoal" href="#">Docs</a>
          <a className="text-sm text-mhmuted hover:text-mhcharcoal" href="#">Support</a>
        </nav>
      </div>
    </header>
  )
}
