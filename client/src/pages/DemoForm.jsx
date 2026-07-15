import { useState } from 'react'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { useProfile } from '../features/profile/profileStore'
import { toast } from 'sonner'
import { Badge } from '../components/ui/Badge'
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function DemoForm() {
  const { profile } = useProfile()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gender: '',
  })
  const [fieldStatus, setFieldStatus] = useState({}) // 'success' | 'review' | 'missing'

  function autofill() {
    const updatedForm = {}
    const updatedStatus = {}

    const fields = [
      { key: 'name', value: profile.name, highConfidence: true },
      { key: 'email', value: profile.email, highConfidence: true },
      { key: 'phone', value: profile.phone, highConfidence: true },
      { key: 'dob', value: profile.dob, highConfidence: false },
      { key: 'address', value: profile.address?.full, highConfidence: false },
      { key: 'city', value: profile.address?.city, highConfidence: false },
      { key: 'state', value: profile.address?.state, highConfidence: false },
      { key: 'pincode', value: profile.address?.pincode, highConfidence: false },
      { key: 'gender', value: profile.gender, highConfidence: false },
      { key: 'aadhaar', value: profile.aadhaarNumber, highConfidence: true },
      { key: 'pan', value: profile.panNumber, highConfidence: true },
      { key: 'qualification', value: profile.education?.[0]?.level, highConfidence: false },
      { key: 'percentage', value: profile.education?.[0]?.percentage, highConfidence: false },
      { key: 'passingYear', value: profile.education?.[0]?.year, highConfidence: false },
    ]

    fields.forEach(({ key, value, highConfidence }) => {
      const stringVal = value ? String(value).trim() : ''
      if (stringVal !== '') {
        updatedForm[key] = stringVal
        updatedStatus[key] = highConfidence ? 'success' : 'review'
      } else {
        updatedForm[key] = ''
        updatedStatus[key] = 'missing'
      }
    })

    setForm(updatedForm)
    setFieldStatus(updatedStatus)
    toast.success('Auto-fill complete — review highlighted fields.')
  }

  function handleFieldChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldStatus((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function getHighlightClass(status) {
    if (status === 'success') {
      return 'border-[#22C55E] focus-visible:ring-[#22C55E]/20 bg-[#22C55E]/5 ring-1 ring-[#22C55E]/20'
    }
    if (status === 'review') {
      return 'border-[#F59E0B] focus-visible:ring-[#F59E0B]/20 bg-[#F59E0B]/5 ring-1 ring-[#F59E0B]/20'
    }
    if (status === 'missing') {
      return 'border-[#EF4444] focus-visible:ring-[#EF4444]/20 bg-[#EF4444]/5 ring-1 ring-[#EF4444]/20'
    }
    return ''
  }

  function submit(e) {
    e.preventDefault()
    toast.success('Demo form saved successfully.')
  }

  const fieldsConfig = [
    { key: 'name', label: 'Full name', type: 'text' },
    { key: 'email', label: 'Email address', type: 'email' },
    { key: 'phone', label: 'Mobile number', type: 'tel' },
    { key: 'dob', label: 'Date of birth', type: 'text', placeholder: 'DD/MM/YYYY' },
    { key: 'address', label: 'Permanent address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'pincode', label: 'PIN code', type: 'text' },
    { key: 'aadhaar', label: 'Aadhaar Number', type: 'text' },
    { key: 'pan', label: 'PAN Card Number', type: 'text' },
    { key: 'qualification', label: 'Highest Qualification', type: 'text' },
    { key: 'percentage', label: 'Percentage / CGPA', type: 'text' },
    { key: 'passingYear', label: 'Passing Year', type: 'text' },
  ]

  return (
    <div className="space-y-6 max-w-4xl select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Demo application</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          This form demonstrates how the saved profile populates fields with confidence scores.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="bg-[#111111] border-[#262626] shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base text-white">Job Application Form</CardTitle>
                <CardDescription className="text-xs text-[#A1A1AA]">Demo Portal</CardDescription>
              </div>
              <Button type="button" onClick={autofill} variant="outline" className="flex items-center gap-2 border-[#262626] text-white hover:bg-white/10 shrink-0">
                <ShieldCheck size={16} /> Auto-fill profile
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                {fieldsConfig.map(({ key, label, type, placeholder }) => (
                  <div key={key} className={key === 'address' ? 'sm:col-span-2 space-y-2' : 'space-y-2'}>
                    <div className="flex justify-between items-center">
                      <Label htmlFor={key} className="text-xs text-[#A1A1AA]">{label}</Label>
                      {fieldStatus[key] && (
                        <span className="text-[10px]">
                          {fieldStatus[key] === 'success' && <span className="text-[#22C55E] font-medium">✓ Auto-filled</span>}
                          {fieldStatus[key] === 'review' && <span className="text-[#F59E0B] font-medium">⚠ Review needed</span>}
                          {fieldStatus[key] === 'missing' && <span className="text-[#EF4444] font-medium">✗ Missing</span>}
                        </span>
                      )}
                    </div>
                    <Input
                      id={key}
                      type={type}
                      placeholder={placeholder}
                      value={form[key] || ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className={getHighlightClass(fieldStatus[key])}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="gender" className="text-xs text-[#A1A1AA]">Gender</Label>
                    {fieldStatus.gender && (
                      <span className="text-[10px]">
                        {fieldStatus.gender === 'success' && <span className="text-[#22C55E] font-medium">✓ Auto-filled</span>}
                        {fieldStatus.gender === 'review' && <span className="text-[#F59E0B] font-medium">⚠ Review needed</span>}
                        {fieldStatus.gender === 'missing' && <span className="text-[#EF4444] font-medium">✗ Missing</span>}
                      </span>
                    )}
                  </div>
                  <Select
                    id="gender"
                    value={form.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    className={getHighlightClass(fieldStatus.gender)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Select>
                </div>

                <div className="sm:col-span-2 pt-4 flex justify-end">
                  <Button type="submit">Submit Form</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-[#111111] border-[#262626] shadow-none rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base text-white">Autofill Highlights Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <div className="rounded-xl bg-[#22C55E]/10 p-2.5 text-[#22C55E] border border-[#22C55E]/20 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs">Green: High Confidence</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                    Automatically matched exact fields like Name, Email, and Phone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="rounded-xl bg-[#F59E0B]/10 p-2.5 text-[#F59E0B] border border-[#F59E0B]/20 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs">Yellow: Needs Review</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                    Requires manual confirmation (e.g. Address, Date of Birth, Gender).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="rounded-xl bg-[#EF4444]/10 p-2.5 text-[#EF4444] border border-[#EF4444]/20 shrink-0">
                  <Info size={16} />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs">Red: Missing Information</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                    No matching information found in your profile documents.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
