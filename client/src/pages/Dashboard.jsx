import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FileUp, UserRound, ArrowRight, Clock, Target,
  FileCheck2, Zap, TrendingUp, Sparkles, CheckCircle2, AlertCircle,
  Upload, Globe, TestTubeDiagonal
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { useProfile, useAnalytics } from '../features/profile/profileStore'
import { storageService } from '../services/storageService'

// Animated number counter
function AnimatedCounter({ value, suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const end = Number(value) || 0
    if (end === 0) { setDisplay(0); return }
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * end))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [value, duration])

  return <>{display.toLocaleString()}{suffix}</>
}

function formatTimeSaved(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${(seconds / 3600).toFixed(1)}h`
}

export default function Dashboard() {
  const { profile } = useProfile()
  const { analytics, history } = useAnalytics()
  const completion = storageService.getProfileCompletion()
  const achievements = storageService.getAchievements()

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  const statCards = [
    {
      icon: FileCheck2,
      label: 'Forms Filled',
      value: analytics.formsFilled,
      color: '#4F8CFF',
      bg: 'rgba(79,140,255,0.08)',
      border: 'rgba(79,140,255,0.15)',
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: formatTimeSaved(analytics.timeSavedSeconds),
      isText: true,
      color: '#00D26A',
      bg: 'rgba(0,210,106,0.08)',
      border: 'rgba(0,210,106,0.15)',
    },
    {
      icon: Zap,
      label: 'Characters Saved',
      value: analytics.charactersSaved,
      color: '#FFC857',
      bg: 'rgba(255,200,87,0.08)',
      border: 'rgba(255,200,87,0.15)',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: analytics.formsFilled > 0 ? '~95%' : '—',
      isText: true,
      color: '#7C5CFF',
      bg: 'rgba(124,92,255,0.08)',
      border: 'rgba(124,92,255,0.15)',
    },
  ]

  const suggestions = []
  if (!profile.aadhaarNumber) suggestions.push({ text: 'Upload Aadhaar to complete identity', link: '/documents', icon: Upload })
  if (!profile.panNumber) suggestions.push({ text: 'Add PAN Card for government forms', link: '/documents', icon: Upload })
  if (profile.education?.length === 0) suggestions.push({ text: 'Add education details', link: '/profile', icon: UserRound })
  if (!profile.socialLinks?.linkedin) suggestions.push({ text: 'Connect your LinkedIn profile', link: '/profile', icon: Globe })

  return (
    <div className="space-y-8 select-none animate-fade-in">
      {/* Header */}
      <header>
        <p className="text-xs font-medium text-muted-foreground">{formattedDate}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Welcome{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Never type the same information twice. Your AI workspace is ready.
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, isText, color, bg, border: borderColor }) => (
          <Card key={label} className="bg-card border-border shadow-none hover:border-[#4F8CFF]/30 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="rounded-xl p-2.5 shrink-0"
                  style={{ background: bg, border: `1px solid ${borderColor}` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground leading-none">
                {isText ? value : <AnimatedCounter value={value} />}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile + Quick Actions Row */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Profile Completion */}
        <Card className="md:col-span-2 bg-card border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#4F8CFF]" />
              <CardTitle className="text-base text-foreground">Profile Completion</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Complete your profile for better auto-fill accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-4">
              <strong className="text-4xl font-extrabold text-foreground">{completion}%</strong>
              <Link
                className="text-xs font-medium text-[#4F8CFF] hover:underline inline-flex items-center gap-1 transition-all"
                to="/profile"
              >
                Complete profile <ArrowRight size={13} />
              </Link>
            </div>
            <Progress value={completion} className="h-2 bg-secondary" />

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              {achievements.map((a) => (
                <span
                  key={a.label}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    a.done
                      ? 'bg-[#00D26A]/10 text-[#00D26A] border-[#00D26A]/20'
                      : 'bg-secondary/60 text-muted-foreground border-border'
                  }`}
                >
                  <CheckCircle2 size={11} />
                  {a.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="flex flex-col justify-between bg-card border-border shadow-none">
          <CardHeader className="pb-2">
            <div className="rounded-xl bg-[#00D26A]/10 p-2.5 w-fit border border-[#00D26A]/20">
              <CheckCircle2 className="text-[#00D26A] h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <h3 className="font-semibold text-sm text-foreground">Privacy-first storage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
              All data is stored locally in your browser. Zero server-side persistence of personal information.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { Icon: FileUp, title: 'Upload Documents', desc: 'Extract info from files', to: '/documents' },
            { Icon: UserRound, title: 'Manage Profile', desc: 'Edit your credentials', to: '/profile' },
            { Icon: TestTubeDiagonal, title: 'Test Autofill', desc: 'Try filling forms', to: '/applications' },
            { Icon: Sparkles, title: 'Job Assistant', desc: 'Cover letter & ATS', to: '/job-assistant' },
          ].map(({ Icon, title, desc, to }) => (
            <Link to={to} key={title} className="group">
              <Card className="bg-card border-border shadow-none group-hover:border-[#4F8CFF]/40 transition-all h-full">
                <CardContent className="pt-5 pb-4">
                  <div className="rounded-xl bg-[#4F8CFF]/10 p-2.5 w-fit border border-[#4F8CFF]/20 mb-3 group-hover:bg-[#4F8CFF]/15 transition-colors">
                    <Icon size={18} className="text-[#4F8CFF]" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <AlertCircle size={16} className="text-[#FFC857]" />
            Suggestions to improve your profile
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((s) => (
              <Link key={s.text} to={s.link}>
                <Card className="bg-card border-border shadow-none hover:border-[#FFC857]/30 transition-colors">
                  <CardContent className="py-3.5 flex items-center gap-3">
                    <div className="rounded-lg bg-[#FFC857]/10 p-2 border border-[#FFC857]/20">
                      <s.icon size={14} className="text-[#FFC857]" />
                    </div>
                    <span className="text-sm text-muted-foreground">{s.text}</span>
                    <ArrowRight size={14} className="ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-[#4F8CFF]" />
              Recent Activity
            </h2>
            <Link to="/history" className="text-xs text-[#4F8CFF] hover:underline">View all</Link>
          </div>
          <Card className="bg-card border-border shadow-none">
            <CardContent className="py-3">
              <div className="space-y-0 divide-y divide-border">
                {history.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#4F8CFF]/10 p-2 border border-[#4F8CFF]/20 shrink-0">
                        <Globe size={14} className="text-[#4F8CFF]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.website}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.fieldsFilled} fields · {formatTimeSaved(entry.timeSavedSeconds)} saved
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
