import { Globe, Trash2, Clock, Zap, FileCheck2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAnalytics } from '../features/profile/profileStore'
import { toast } from 'sonner'

function formatTimeSaved(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${(seconds / 3600).toFixed(1)}h`
}

export default function History() {
  const { analytics, history, clearHistory } = useAnalytics()

  function handleClear() {
    clearHistory()
    toast.success('History and analytics cleared.')
  }

  return (
    <div className="space-y-8 select-none animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Autofill History</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track every form you&apos;ve filled with ApplyOnce AI.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="text-[#FF5D73] hover:text-[#FF5D73] hover:bg-[#FF5D73]/10 border-[#FF5D73]/20">
            <Trash2 size={14} className="mr-1.5" />
            Clear all
          </Button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { icon: FileCheck2, label: 'Total Forms', value: analytics.formsFilled, color: '#4F8CFF' },
          { icon: Clock, label: 'Time Saved', value: formatTimeSaved(analytics.timeSavedSeconds), color: '#00D26A' },
          { icon: Zap, label: 'Characters Saved', value: analytics.charactersSaved.toLocaleString(), color: '#FFC857' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="bg-card border-border shadow-none">
            <CardContent className="pt-5 pb-4 flex items-center gap-3">
              <div className="rounded-xl p-2.5 shrink-0" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      {history.length === 0 ? (
        <Card className="bg-card border-border shadow-none">
          <CardContent className="py-16 text-center">
            <Globe size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">No autofill history yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Fill a form using the extension or demo page to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Activity Log</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {history.length} form{history.length > 1 ? 's' : ''} filled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-border">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#4F8CFF]/10 p-2 border border-[#4F8CFF]/20 shrink-0">
                      <Globe size={16} className="text-[#4F8CFF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.website}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.fieldsFilled} fields filled · {formatTimeSaved(entry.timeSavedSeconds)} saved · {entry.charactersSaved} chars
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
