import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#111111] px-5 py-12 text-[#A1A1AA] select-none">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black shrink-0 shadow-sm">
              <Sparkles size={16} className="fill-current" />
            </span>
            <span className="tracking-tight">ApplyOnce AI</span>
          </div>
          <p className="mt-3 text-xs">Upload once. Apply anywhere.</p>
        </div>
        <div className="text-xs">
          <p className="font-semibold text-white">Product</p>
          <p className="mt-3">Features · Privacy · Chrome Extension</p>
        </div>
        <p className="text-xs md:text-right">
          © {new Date().getFullYear()} ApplyOnce AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
