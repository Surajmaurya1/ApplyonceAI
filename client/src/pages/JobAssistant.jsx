import { useState } from 'react'
import { Sparkles, FileText, Copy, Download, Loader2, Briefcase, Target, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import { useProfile } from '../features/profile/profileStore'
import { toast } from 'sonner'

export default function JobAssistant() {
  const { profile } = useProfile()
  const [activeTab, setActiveTab] = useState('cover-letter')

  // Cover Letter state
  const [clForm, setClForm] = useState({ company: '', role: '', jobDescription: '' })
  const [coverLetter, setCoverLetter] = useState('')
  const [clLoading, setClLoading] = useState(false)

  // ATS Analyzer state
  const [atsJobDescription, setAtsJobDescription] = useState('')
  const [atsResult, setAtsResult] = useState(null)
  const [atsLoading, setAtsLoading] = useState(false)

  async function generateCoverLetter() {
    if (!clForm.company || !clForm.role) {
      toast.error('Company name and role are required.')
      return
    }
    setClLoading(true)
    setCoverLetter('')
    try {
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
          },
          company: clForm.company,
          role: clForm.role,
          jobDescription: clForm.jobDescription,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCoverLetter(data.data.coverLetter)
        toast.success('Cover letter generated!')
      } else {
        toast.error(data.error?.message || 'Failed to generate cover letter.')
      }
    } catch {
      toast.error('Network error. Make sure the server is running.')
    } finally {
      setClLoading(false)
    }
  }

  async function analyzeResume() {
    if (!atsJobDescription.trim()) {
      toast.error('Paste a job description to analyze against.')
      return
    }
    setAtsLoading(true)
    setAtsResult(null)
    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: profile.name,
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
          },
          jobDescription: atsJobDescription,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAtsResult(data.data.analysis)
        toast.success('Analysis complete!')
      } else {
        toast.error(data.error?.message || 'Failed to analyze.')
      }
    } catch {
      toast.error('Network error. Make sure the server is running.')
    } finally {
      setAtsLoading(false)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  function downloadAsText(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'cover-letter', label: 'Cover Letter', icon: FileText },
    { id: 'ats-analyzer', label: 'ATS Analyzer', icon: Target },
  ]

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles size={24} className="text-[#7C5CFF]" />
          Job Assistant
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          AI-powered tools to supercharge your job applications.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Cover Letter Tab */}
      {activeTab === 'cover-letter' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Briefcase size={16} className="text-[#4F8CFF]" />
                Job Details
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter the job details to generate a personalized cover letter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Company Name *</Label>
                <Input
                  placeholder="e.g. Google"
                  value={clForm.company}
                  onChange={(e) => setClForm({ ...clForm, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Role / Position *</Label>
                <Input
                  placeholder="e.g. Software Engineer"
                  value={clForm.role}
                  onChange={(e) => setClForm({ ...clForm, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Job Description (optional)</Label>
                <textarea
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F8CFF]/30 resize-none min-h-[120px]"
                  placeholder="Paste the full job description here for a more tailored letter..."
                  value={clForm.jobDescription}
                  onChange={(e) => setClForm({ ...clForm, jobDescription: e.target.value })}
                />
              </div>
              <Button onClick={generateCoverLetter} disabled={clLoading} className="w-full bg-[#4F8CFF] hover:bg-[#3D7AED] text-white">
                {clLoading ? <><Loader2 size={16} className="animate-spin mr-2" /> Generating...</> : <><Sparkles size={16} className="mr-2" /> Generate Cover Letter</>}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Generated Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              {coverLetter ? (
                <div className="space-y-4">
                  <div className="bg-secondary rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto border border-border">
                    {coverLetter}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(coverLetter)}>
                      <Copy size={14} className="mr-1.5" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadAsText(coverLetter, `Cover_Letter_${clForm.company}.txt`)}>
                      <Download size={14} className="mr-1.5" /> Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your generated cover letter will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ATS Analyzer Tab */}
      {activeTab === 'ats-analyzer' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Target size={16} className="text-[#7C5CFF]" />
                Resume Analyzer
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Paste a job description to analyze your profile against it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Job Description *</Label>
                <textarea
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 resize-none min-h-[200px]"
                  placeholder="Paste the full job description here..."
                  value={atsJobDescription}
                  onChange={(e) => setAtsJobDescription(e.target.value)}
                />
              </div>
              <Button onClick={analyzeResume} disabled={atsLoading} className="w-full bg-[#7C5CFF] hover:bg-[#6B4FDE] text-white">
                {atsLoading ? <><Loader2 size={16} className="animate-spin mr-2" /> Analyzing...</> : <><Target size={16} className="mr-2" /> Analyze Profile</>}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {atsResult ? (
                <div className="space-y-5">
                  {/* ATS Score */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={atsResult.score >= 70 ? '#00D26A' : atsResult.score >= 40 ? '#FFC857' : '#FF5D73'}
                          strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(atsResult.score / 100) * 264} 264`}
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold text-foreground">{atsResult.score}%</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-2">ATS Compatibility Score</p>
                  </div>

                  {/* Matching Skills */}
                  {atsResult.matchingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Matching Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {atsResult.matchingSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {atsResult.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Missing Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {atsResult.missingSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {atsResult.suggestions?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Improvement Suggestions</p>
                      <ul className="space-y-2">
                        {atsResult.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle size={14} className="text-[#FFC857] mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Target size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your analysis results will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
