import { LayoutDashboard, UserRound, FileText, Globe, History, Briefcase, Settings, ChevronLeft, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useProfile } from '../../features/profile/profileStore'
import { storageService } from '../../services/storageService'

const links = [
  [LayoutDashboard, 'Dashboard', '/dashboard'],
  [UserRound, 'AI Profile', '/profile'],
  [FileText, 'Documents', '/documents'],
  [Briefcase, 'Job Assistant', '/job-assistant'],
  [Globe, 'Extension', '/extension'],
  [History, 'Autofill History', '/history'],
  [Settings, 'Settings', '/settings'],
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const { profile } = useProfile()
  const displayName = profile.name || 'Your Profile'
  const displayEmail = profile.email || 'Personal workspace'
  const avatarLetter = profile.name ? profile.name.trim().charAt(0).toUpperCase() : 'Y'
  const completion = storageService.getProfileCompletion()

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } hidden h-[calc(100vh-2rem)] my-4 ml-4 shrink-0 rounded-2xl border border-border bg-card p-4 transition-all duration-300 md:flex md:flex-col justify-between select-none animate-fade-in`}
    >
      <div>
        <button
          className="mb-8 flex w-full items-center gap-2.5 px-1.5 py-1 font-bold text-foreground hover:bg-secondary rounded-xl transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4F8CFF] text-white font-extrabold text-sm shadow-sm shrink-0">
            <Sparkles size={16} className="fill-current" />
          </span>
          {!collapsed && <span className="tracking-tight text-sm text-[#FAFAFA]">ApplyOnce</span>}
          <ChevronLeft
            className={`ml-auto text-[#A1A1AA] hover:text-white transition duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
            size={16}
          />
        </button>

        <nav className="space-y-1">
          {links.map(([Icon, label, to]) => (
            <NavLink
              to={to}
              key={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#4F8CFF]/10 text-[#4F8CFF] border border-[#4F8CFF]/20'
                    : 'text-[#A1A1AA] hover:bg-secondary/80 hover:text-[#FAFAFA]'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-border pt-4 text-xs text-[#A1A1AA] space-y-3">
        {/* Profile Completion Mini */}
        {!collapsed && (
          <div className="px-2">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] text-[#A1A1AA]">Profile</span>
              <span className="text-[10px] font-semibold text-[#4F8CFF]">{completion}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4F8CFF] transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-secondary/40 border border-border/40">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#4F8CFF]/10 font-semibold text-[#4F8CFF] shrink-0 text-xs">
            {avatarLetter}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-medium text-[#FAFAFA] text-xs">{displayName}</p>
              <p className="truncate text-[10px] text-[#A1A1AA]">{displayEmail}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
