import { useProfile } from '../features/profile/profileStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { toast } from 'sonner'

export default function Settings() {
  const { clearProfile } = useProfile()

  function handleClearData() {
    if (confirm('Clear the locally stored profile? All documents and personal data will be permanently removed.')) {
      clearProfile()
      toast.success('Local profile data has been cleared.')
    }
  }

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Manage your application workspace data and privacy preferences.
        </p>
      </div>

      <Card className="max-w-2xl bg-[#111111] border-[#262626] shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-white">Your profile data</CardTitle>
          <CardDescription className="text-xs text-[#A1A1AA]">
            Your information is stored locally in your browser's secure cache.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            ApplyOnce AI processes your files locally using Web Workers. Your data is only shared with Gemini for processing when you click "Extract profile with AI".
          </p>
          <div className="pt-2">
            <Button variant="danger" onClick={handleClearData}>
              Clear local data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
