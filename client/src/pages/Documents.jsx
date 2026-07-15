import { useState } from 'react'
import { toast } from 'sonner'
import { FileText, Trash2, ShieldAlert, Check, X, ArrowRight, CheckCircle2 } from 'lucide-react'
import DropZone from '../components/upload/DropZone'
import OCRProgress from '../components/upload/OCRProgress'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { extractText } from '../services/ocrService'
import { extractProfileFromText } from '../services/geminiService'
import { useProfile } from '../features/profile/profileStore'

const types = [
  'Resume / CV',
  'Aadhaar',
  'PAN',
  'Driving License',
  'Passport',
  'Marksheet',
  'Degree',
  'Certificate',
  'Other'
]

export default function Documents() {
  const [docType, setDocType] = useState('Resume / CV')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(null)
  const { profile, updateProfile } = useProfile()

  // Conflict state
  const [conflicts, setConflicts] = useState([])
  const [pendingData, setPendingData] = useState(null)
  const [resolvedValues, setResolvedValues] = useState({}) // { fieldName: 'current' | 'new' }

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
      toast.success(`${docType} processed and uploaded.`)
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
      const extractedData = await extractProfileFromText(preview.text, preview.type)
      
      // Look for conflicts between existing profile fields and extracted fields
      const foundConflicts = []
      const initialResolutions = {}

      const fieldsToCheck = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'dob', label: 'Date of Birth' },
        { key: 'gender', label: 'Gender' },
        { key: 'aadhaarNumber', label: 'Aadhaar ID' },
        { key: 'panNumber', label: 'PAN Card ID' },
        { key: 'passportNumber', label: 'Passport' },
        { key: 'drivingLicense', label: 'Driving License' }
      ]

      fieldsToCheck.forEach(({ key, label }) => {
        const extractedVal = extractedData[key]
        const currentVal = profile[key]
        if (
          extractedVal && 
          extractedVal.trim() !== '' && 
          currentVal && 
          currentVal.trim() !== '' && 
          extractedVal.toLowerCase().replace(/[^a-z0-9]/g, '') !== currentVal.toLowerCase().replace(/[^a-z0-9]/g, '')
        ) {
          foundConflicts.push({
            key,
            label,
            currentVal,
            extractedVal
          })
          initialResolutions[key] = 'current' // default to keep current
        }
      })

      if (foundConflicts.length > 0) {
        setConflicts(foundConflicts)
        setPendingData(extractedData)
        setResolvedValues(initialResolutions)
        toast.warning('Conflict detected: Some extracted fields do not match your current profile.')
      } else {
        // No conflicts, merge fields directly (avoid overwriting existing with blank values)
        const merged = mergeProfile(profile, extractedData)
        updateProfile(merged)
        toast.success('Information successfully extracted and merged into your profile.')
      }
    } catch (e) {
      toast.error(
        e.response?.data?.error?.message ||
          'AI extraction failed. Make sure server & API key are configured.'
      )
    } finally {
      setBusy(false)
    }
  }

  // Merge logic helper
  function mergeProfile(current, extracted) {
    const merged = { ...current }
    
    // Copy simple fields if they are empty
    Object.keys(extracted).forEach((key) => {
      if (Array.isArray(extracted[key])) {
        // Append arrays (e.g. merge skills, education lists)
        if (key === 'skills') {
          const union = new Set([...(current.skills || []), ...(extracted.skills || [])])
          merged.skills = Array.from(union)
        } else if (key === 'education') {
          merged.education = [...(current.education || []), ...(extracted.education || [])]
        } else if (key === 'experience') {
          merged.experience = [...(current.experience || []), ...(extracted.experience || [])]
        } else if (key === 'certificates') {
          merged.certificates = [...(current.certificates || []), ...(extracted.certificates || [])]
        }
      } else if (typeof extracted[key] === 'object' && extracted[key] !== null) {
        merged[key] = { ...current[key], ...extracted[key] }
      } else if (extracted[key] && !current[key]) {
        // Copy if current is empty
        merged[key] = extracted[key]
      }
    })

    // Update field confidence/source metadata map
    const meta = { ...(current.metadata || {}) }
    Object.keys(extracted).forEach((key) => {
      if (extracted[key] && typeof extracted[key] !== 'object') {
        meta[key] = { confidence: 95, source: docType }
      }
    })
    merged.metadata = meta

    return merged
  }

  function resolveConflictSubmit() {
    const finalData = { ...pendingData }

    conflicts.forEach(({ key }) => {
      if (resolvedValues[key] === 'current') {
        // Keep current value
        finalData[key] = profile[key]
      } else {
        // Set metadata source for the new selected value
        if (!finalData.metadata) finalData.metadata = {}
        finalData.metadata[key] = { confidence: 98, source: docType }
      }
    })

    const merged = mergeProfile(profile, finalData)
    updateProfile(merged)

    // Clear conflict states
    setConflicts([])
    setPendingData(null)
    setResolvedValues({})
    toast.success('Profile updated with conflict resolutions.')
  }

  function remove(id) {
    updateProfile({ documents: (profile.documents || []).filter((x) => x.id !== id) })
    if (preview?.id === id) setPreview(null)
  }

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Document Intelligence</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Upload documents to extract credentials and verify profile accuracy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Upload Form Area */}
        <section className="lg:col-span-3 space-y-6">
          <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-white">Upload Documents</CardTitle>
              <CardDescription className="text-xs text-[#A1A1AA]">
                Upload Aadhaar, PAN, passport, or CVs to build your AI profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="document-type" className="text-xs text-[#A1A1AA]">Document category</Label>
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
                  <h3 className="font-semibold text-sm text-white">Extracted Document Text</h3>
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-[#2A2D3A] bg-[#1E2030]/30 p-4 text-xs text-[#A1A1AA] font-mono leading-relaxed">
                    {preview.text || 'No readable text parsed.'}
                  </pre>
                  <Button className="w-full bg-[#4F8CFF] hover:bg-[#3D7AED] text-white" loading={busy} onClick={useAI}>
                    Analyze & Merge with Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent uploads */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight text-white">Document Ledger</h2>
          <div className="space-y-3">
            {profile.documents && profile.documents.length ? (
              profile.documents.map((doc) => (
                <Card key={doc.id} className="bg-[#171923] border-[#2A2D3A] hover:border-[#4F8CFF]/20 hover:shadow-none transition-all shadow-none">
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-[#4F8CFF]/10 p-2.5 text-[#4F8CFF] border border-[#4F8CFF]/20 shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{doc.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#FF5D73] hover:bg-[#FF5D73]/10 hover:text-[#FF5D73] shrink-0"
                      aria-label="Delete document"
                      onClick={() => remove(doc.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#2A2D3A] p-8 text-center text-xs text-[#A1A1AA] bg-[#171923]/30">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Conflict Resolution Overlay */}
      {conflicts.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="bg-[#171923] border-[#2A2D3A] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <CardHeader className="flex flex-row items-start gap-3 border-b border-[#2A2D3A] pb-4">
              <div className="rounded-full bg-[#FFC857]/10 p-2 border border-[#FFC857]/20 text-[#FFC857]">
                <ShieldAlert size={20} />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Resolve Profile Mismatches</CardTitle>
                <CardDescription className="text-xs text-[#A1A1AA]">
                  The new document contains conflicting details. Please choose which values to retain.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              <div className="space-y-3">
                {conflicts.map(({ key, label, currentVal, extractedVal }) => (
                  <div key={key} className="border border-[#2A2D3A] rounded-xl p-3 bg-[#1E2030]/20">
                    <p className="text-xs font-semibold text-[#4F8CFF] mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Current Option */}
                      <button
                        type="button"
                        onClick={() => setResolvedValues({ ...resolvedValues, [key]: 'current' })}
                        className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                          resolvedValues[key] === 'current'
                            ? 'bg-[#4F8CFF]/10 border-[#4F8CFF] text-white'
                            : 'bg-[#171923] border-[#2A2D3A] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Keep Current</span>
                        <span className="text-sm font-medium mt-1 truncate">{currentVal}</span>
                      </button>

                      {/* Extracted Option */}
                      <button
                        type="button"
                        onClick={() => setResolvedValues({ ...resolvedValues, [key]: 'new' })}
                        className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                          resolvedValues[key] === 'new'
                            ? 'bg-[#00D26A]/10 border-[#00D26A] text-white'
                            : 'bg-[#171923] border-[#2A2D3A] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Use Extracted ({docType})</span>
                        <span className="text-sm font-medium mt-1 truncate">{extractedVal}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2D3A]">
                <Button variant="ghost" className="text-white hover:bg-secondary" onClick={() => setConflicts([])}>
                  Cancel
                </Button>
                <Button className="bg-[#4F8CFF] hover:bg-[#3D7AED] text-white" onClick={resolveConflictSubmit}>
                  Apply Resolutions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
