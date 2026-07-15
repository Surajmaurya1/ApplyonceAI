import { Link } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = ['Features', 'How It Works', 'Pricing']

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#090909]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground hover:opacity-90">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black shrink-0 shadow-sm">
            <Sparkles size={16} className="fill-current" />
          </span>
          <span className="tracking-tight text-[#FAFAFA]">ApplyOnce AI</span>
        </Link>
        
        <div className="hidden items-center gap-6 md:flex">
          {links.map((x) => (
            <a
              key={x}
              href={`/#${x.toLowerCase().replaceAll(' ', '-')}`}
              className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
            >
              {x}
            </a>
          ))}
          <Button asChild size="sm">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </nav>

      {open && (
        <div className="border-t border-border bg-[#090909] px-5 py-4 md:hidden space-y-3 animate-fade-in">
          {links.map((x) => (
            <a
              className="block py-2 text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
              href={`/#${x.toLowerCase().replaceAll(' ', '-')}`}
              key={x}
              onClick={() => setOpen(false)}
            >
              {x}
            </a>
          ))}
          <Button asChild className="w-full">
            <Link to="/signup" onClick={() => setOpen(false)}>Get Started</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
