import { Link } from 'react-router-dom'
import { FileUp, UserRound, ClipboardList, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useProfile } from '../features/profile/profileStore'

export default function Dashboard() {
  const { profile } = useProfile()
  
  // Calculate completion percentage based on basic fields
  const vals = [
    profile.name,
    profile.email,
    profile.phone,
    profile.dob,
    profile.address?.full
  ].filter(Boolean).length
  
  const pct = Math.round((vals / 5) * 100)

  // Current date formatting
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="space-y-8 select-none animate-fade-in">
      <header>
        <p className="text-xs font-medium text-[#A1A1AA]">{formattedDate}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Welcome{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Your application workspace is ready.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2 bg-[#111111] border-[#262626] shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-white">Profile completion</CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Complete your profile for better auto-fill results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-4">
              <strong className="text-4xl font-extrabold text-white">{pct}%</strong>
              <Link
                className="text-xs font-medium text-white hover:underline inline-flex items-center gap-1 transition-all"
                to="/profile"
              >
                Complete profile <ArrowRight size={13} />
              </Link>
            </div>
            <Progress value={pct} className="h-2 bg-[#171717]" />
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between bg-[#111111] border-[#262626] shadow-none">
          <CardHeader className="pb-2">
            <div className="rounded-xl bg-[#22C55E]/10 p-2.5 w-fit border border-[#22C55E]/20">
              <CheckCircle2 className="text-[#22C55E] h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="font-semibold text-sm text-white">Secure storage</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mt-1.5">
              Your data stays inside your browser and is never stored on external database servers.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight text-white">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              Icon: FileUp,
              title: 'Upload a document',
              desc: 'Extract information from files',
              to: '/documents'
            },
            {
              Icon: UserRound,
              title: 'Edit profile',
              desc: 'Manage your credentials',
              to: '/profile'
            },
            {
              Icon: ClipboardList,
              title: 'Try auto-fill',
              desc: 'Test filling forms instantly',
              to: '/applications'
            }
          ].map(({ Icon, title, desc, to }) => (
            <Link to={to} key={title} className="group">
              <Card className="h-full bg-[#111111] border-[#262626] hover:border-white/20 transition-all duration-200 shadow-none">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div className="rounded-xl bg-white/10 group-hover:bg-white/20 p-3 w-fit text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-semibold text-sm text-white group-hover:text-white transition-colors">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#A1A1AA] leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
