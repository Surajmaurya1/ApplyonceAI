import { useState } from 'react'
import { toast } from 'sonner'
import { FileText, Trash2 } from 'lucide-react'
import DropZone from '../components/upload/DropZone'
import OCRProgress from '../components/upload/OCRProgress'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { extractText } from '../services/ocrService'
import { extractProfileFromText } from '../services/geminiService'
import { useProfile } from '../features/profile/profileStore'

const types = ['Aadhaar', 'PAN', 'Resume / CV', 'Marksheet', 'Certificate', 'Other']

export default function Documents() {
  const [docType, setDocType] = useState('Resume / CV')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(null)
  const { profile, updateProfile } = useProfile()

  async function onFile(file) {
    setBusy(true)
    setProgress(1)
    setPreview(null)
    try {
      const text = await extractText(file, setProgress)
      setProgress(100)
      const document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: docType,
        text,
        createdAt: new Date().toISOString(),
      }
      updateProfile({ documents: [...(profile.documents || []), document] })
      setPreview(document)
      toast.success('Document processed successfully')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function useAI() {
    if (!preview) return
    setBusy(true)
    try {
      const data = await extractProfileFromText(preview.text, preview.type)
      updateProfile(data)
      toast.success('Profile updated with extracted details')
    } catch (e) {
      toast.error(
        e.response?.data?.error?.message ||
          'AI extraction failed. Please configure GEMINI_API_KEY and try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  function remove(id) {
    updateProfile({ documents: (profile.documents || []).filter((x) => x.id !== id) })
    if (preview?.id === id) setPreview(null)
  }

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Documents</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Upload a document to extract information for your profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <Card className="bg-[#111111] border-[#262626] shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-white">Upload Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="document-type" className="text-xs text-[#A1A1AA]">Document type</Label>
                <Select
                  id="document-type"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  {types.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Select>
              </div>

              <DropZone onFile={onFile} />

              {busy && (
                <div className="mt-5">
                  <OCRProgress progress={progress} />
                </div>
              )}

              {preview && (
                <div className="mt-5 space-y-3">
                  <h3 className="font-semibold text-sm text-white">Extracted raw text</h3>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-[#262626] bg-[#171717] p-4 text-xs text-[#A1A1AA] font-mono leading-relaxed">
                    {preview.text || 'No readable text found.'}
                  </pre>
                  <Button className="w-full sm:w-auto" loading={busy} onClick={useAI}>
                    Extract profile with AI
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight text-white">Recent documents</h2>
          <div className="space-y-3">
            {profile.documents && profile.documents.length ? (
              profile.documents.map((doc) => (
                <Card key={doc.id} className="bg-[#111111] border-[#262626] hover:border-white/20 hover:shadow-none transition-all shadow-none">
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-white/10 p-2.5 text-white shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{doc.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444] shrink-0"
                      aria-label="Delete document"
                      onClick={() => remove(doc.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#262626] p-8 text-center text-xs text-[#A1A1AA] bg-[#111111]/30">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
