import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import AIChatBubble from '../ui/AIChatBubble'
import { LayoutDashboard, UserRound, FileText, Briefcase, History } from 'lucide-react'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const mobile = [
    [LayoutDashboard, '/dashboard'],
    [UserRound, '/profile'],
    [FileText, '/documents'],
    [Briefcase, '/job-assistant'],
    [History, '/history'],
  ]

  return (
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden select-none">
      <div className="flex w-full h-full">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        {/* Main Content Area */}
        <main className="min-w-0 flex-1 h-[calc(100vh-2rem)] my-4 mr-4 ml-4 md:ml-4 bg-card border border-border rounded-2xl overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto pb-16 md:pb-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Companion Bubble */}
      <AIChatBubble />

      {/* Floating Bottom Nav for Mobile */}
      <nav className="fixed bottom-4 left-4 right-4 z-30 flex justify-around border border-border bg-card p-2 md:hidden rounded-2xl shadow-none">
        {mobile.map(([Icon, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#4F8CFF] bg-[#4F8CFF]/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-secondary/40'
              }`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
