import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Plus, Trash2, GraduationCap, Briefcase, KeyRound,
  UserRound, MapPin, Sparkles, Languages, Award, HeartHandshake,
  Settings2, HelpCircle, Globe
} from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card'
import { useProfile } from '../features/profile/profileStore'
import { storageService } from '../services/storageService'

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  const [activeTab, setActiveTab] = useState('personal')
  const completion = storageService.getProfileCompletion()

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      ...profile,
      skillsInput: profile.skills ? profile.skills.join(', ') : '',
      languagesInput: profile.languages ? profile.languages.join(', ') : '',
    },
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  })

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  })

  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate } = useFieldArray({
    control,
    name: 'certificates'
  })

  useEffect(() => {
    reset({
      ...profile,
      skillsInput: profile.skills ? profile.skills.join(', ') : '',
      languagesInput: profile.languages ? profile.languages.join(', ') : '',
    })
  }, [profile, reset])

  function save(data) {
    const parsedSkills = data.skillsInput
      ? data.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const parsedLanguages = data.languagesInput
      ? data.languagesInput.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    updateProfile({
      ...data,
      skills: parsedSkills,
      languages: parsedLanguages,
      address: {
        full: data.address?.full || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
        country: data.address?.country || '',
      },
      emergencyContact: {
        name: data.emergencyContact?.name || '',
        relation: data.emergencyContact?.relation || '',
        phone: data.emergencyContact?.phone || '',
      },
      socialLinks: {
        linkedin: data.socialLinks?.linkedin || '',
        github: data.socialLinks?.github || '',
        portfolio: data.socialLinks?.portfolio || '',
        twitter: data.socialLinks?.twitter || '',
      },
      preferences: {
        jobType: data.preferences?.jobType || '',
        location: data.preferences?.location || '',
        salary: data.preferences?.salary || '',
        noticePeriod: data.preferences?.noticePeriod || '',
      }
    })
    toast.success('Universal Profile updated successfully!')
  }

  // Visual helper for field metadata (source & confidence)
  function FieldMeta({ name }) {
    const meta = profile.metadata?.[name]
    if (!meta) return null
    const color = meta.confidence >= 80 ? 'text-[#00D26A]' : meta.confidence >= 50 ? 'text-[#FFC857]' : 'text-[#FF5D73]'
    return (
      <span className={`text-[10px] font-medium ml-2 ${color}`} title={`Source: ${meta.source || 'System'}`}>
        ({meta.confidence}% • {meta.source || 'AI'})
      </span>
    )
  }

  const tabs = [
    { id: 'personal', label: 'Personal & ID', icon: UserRound },
    { id: 'contacts', label: 'Contacts & Socials', icon: HeartHandshake },
    { id: 'career', label: 'Education & Career', icon: GraduationCap },
    { id: 'preferences', label: 'Preferences', icon: Settings2 },
  ]

  return (
    <div className="space-y-6 max-w-4xl select-none animate-fade-in pb-12">
      {/* Header with completion meter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles size={24} className="text-[#4F8CFF] fill-current" />
            Universal AI Profile
          </h1>
          <p className="mt-1.5 text-sm text-[#A1A1AA]">
            Manage all your identity documents and application credentials in one place.
          </p>
        </div>
        <Card className="bg-[#171923] border-[#2A2D3A] px-4 py-3 shadow-none w-full sm:w-64">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#A1A1AA]">Profile Strength</span>
            <span className="text-[#4F8CFF]">{completion}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#1E2030] overflow-hidden">
            <div className="h-full bg-[#4F8CFF] transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </Card>
      </div>

      {/* Profile Tab Switcher */}
      <div className="flex gap-1 p-1 bg-[#171923] border border-[#2A2D3A] rounded-xl w-fit overflow-x-auto max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-[#1E2030] text-[#4F8CFF] border border-[#2A2D3A] shadow-sm'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(save)} className="space-y-6">
        
        {/* Tab 1: Personal & ID */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
                <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                  <UserRound size={18} />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Identity Details</CardTitle>
                  <CardDescription className="text-xs text-[#A1A1AA]">Personal details verified by your documents.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-[#A1A1AA]">Full Name <FieldMeta name="name" /></Label>
                  <Input id="name" {...register('name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-[#A1A1AA]">Email <FieldMeta name="email" /></Label>
                  <Input id="email" type="email" {...register('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs text-[#A1A1AA]">Phone <FieldMeta name="phone" /></Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-xs text-[#A1A1AA]">Date of Birth <FieldMeta name="dob" /></Label>
                  <Input id="dob" placeholder="DD/MM/YYYY" {...register('dob')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-xs text-[#A1A1AA]">Gender <FieldMeta name="gender" /></Label>
                  <Select id="gender" {...register('gender')}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languagesInput" className="text-xs text-[#A1A1AA]">Languages (Comma-separated)</Label>
                  <Input id="languagesInput" placeholder="e.g. English, Spanish, Hindi" {...register('languagesInput')} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
                <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                  <KeyRound size={18} />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Government ID Credentials</CardTitle>
                  <CardDescription className="text-xs text-[#A1A1AA]">Used for banking, tax, security, and official forms.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber" className="text-xs text-[#A1A1AA]">Aadhaar Number <FieldMeta name="aadhaarNumber" /></Label>
                  <Input id="aadhaarNumber" placeholder="12-digit UID" {...register('aadhaarNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber" className="text-xs text-[#A1A1AA]">PAN Card Number <FieldMeta name="panNumber" /></Label>
                  <Input id="panNumber" placeholder="10-digit alphanumeric PAN" {...register('panNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber" className="text-xs text-[#A1A1AA]">Passport Number <FieldMeta name="passportNumber" /></Label>
                  <Input id="passportNumber" placeholder="Passport Number" {...register('passportNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drivingLicense" className="text-xs text-[#A1A1AA]">Driving License <FieldMeta name="drivingLicense" /></Label>
                  <Input id="drivingLicense" placeholder="DL Number" {...register('drivingLicense')} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Contacts & Socials */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
                <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                  <MapPin size={18} />
                </div>
                <CardTitle className="text-base text-white">Address Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="address-full" className="text-xs text-[#A1A1AA]">Full Address <FieldMeta name="address.full" /></Label>
                  <Input id="address-full" {...register('address.full')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs text-[#A1A1AA]">City <FieldMeta name="address.city" /></Label>
                  <Input id="city" {...register('address.city')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs text-[#A1A1AA]">State <FieldMeta name="address.state" /></Label>
                  <Input id="state" {...register('address.state')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-xs text-[#A1A1AA]">PIN / Postal Code <FieldMeta name="address.pincode" /></Label>
                  <Input id="pincode" {...register('address.pincode')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs text-[#A1A1AA]">Country <FieldMeta name="address.country" /></Label>
                  <Input id="country" {...register('address.country')} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
                <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                  <HeartHandshake size={18} />
                </div>
                <CardTitle className="text-base text-white">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ec-name" className="text-xs text-[#A1A1AA]">Contact Name</Label>
                  <Input id="ec-name" {...register('emergencyContact.name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec-relation" className="text-xs text-[#A1A1AA]">Relation</Label>
                  <Input id="ec-relation" placeholder="e.g. Spouse, Parent" {...register('emergencyContact.relation')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ec-phone" className="text-xs text-[#A1A1AA]">Contact Phone</Label>
                  <Input id="ec-phone" {...register('emergencyContact.phone')} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
                <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                  <Globe size={18} />
                </div>
                <CardTitle className="text-base text-white">Social & Profile Links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-xs text-[#A1A1AA]">LinkedIn Profile</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/..." {...register('socialLinks.linkedin')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-xs text-[#A1A1AA]">GitHub Profile</Label>
                  <Input id="github" placeholder="https://github.com/..." {...register('socialLinks.github')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-xs text-[#A1A1AA]">Portfolio Link</Label>
                  <Input id="portfolio" placeholder="https://..." {...register('socialLinks.portfolio')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-xs text-[#A1A1AA]">Twitter / X Link</Label>
                  <Input id="twitter" placeholder="https://x.com/..." {...register('socialLinks.twitter')} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Education & Career */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <CardTitle className="text-base text-white">Education</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 border-[#2A2D3A] text-white hover:bg-[#1E2030]"
                  onClick={() => appendEducation({ level: '', school: '', year: '', percentage: '' })}
                >
                  <Plus size={14} /> Add School
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="relative border border-[#2A2D3A] rounded-xl p-4 bg-[#1E2030]/20 space-y-4">
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-[#FF5D73] hover:bg-[#FF5D73]/10 hover:text-[#FF5D73]"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-[calc(100%-2.5rem)]">
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Degree / Course Level</Label>
                        <Input placeholder="e.g. B.Tech" {...register(`education.${index}.level`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">School / University</Label>
                        <Input placeholder="e.g. Stanford University" {...register(`education.${index}.school`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Passing Year</Label>
                        <Input placeholder="e.g. 2024" {...register(`education.${index}.year`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Percentage / CGPA</Label>
                        <Input placeholder="e.g. 9.1 or 91%" {...register(`education.${index}.percentage`)} />
                      </div>
                    </div>
                  </div>
                ))}
                {educationFields.length === 0 && (
                  <p className="text-xs text-[#A1A1AA] text-center py-4 bg-[#1E2030]/10 rounded-xl border border-dashed border-[#2A2D3A]">
                    No education listings found.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <CardTitle className="text-base text-white">Work Experience</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 border-[#2A2D3A] text-white hover:bg-[#1E2030]"
                  onClick={() => appendExperience({ company: '', title: '', duration: '' })}
                >
                  <Plus size={14} /> Add Job
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="relative border border-[#2A2D3A] rounded-xl p-4 bg-[#1E2030]/20 space-y-4">
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-[#FF5D73] hover:bg-[#FF5D73]/10 hover:text-[#FF5D73]"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-[calc(100%-2.5rem)]">
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Company Name</Label>
                        <Input placeholder="e.g. Acme Corp" {...register(`experience.${index}.company`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Job Title</Label>
                        <Input placeholder="e.g. Lead Engineer" {...register(`experience.${index}.title`)} />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Duration</Label>
                        <Input placeholder="e.g. June 2022 - Aug 2024" {...register(`experience.${index}.duration`)} />
                      </div>
                    </div>
                  </div>
                ))}
                {experienceFields.length === 0 && (
                  <p className="text-xs text-[#A1A1AA] text-center py-4 bg-[#1E2030]/10 rounded-xl border border-dashed border-[#2A2D3A]">
                    No work experience listings found.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                    <Award size={18} />
                  </div>
                  <CardTitle className="text-base text-white">Certificates</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 border-[#2A2D3A] text-white hover:bg-[#1E2030]"
                  onClick={() => appendCertificate({ name: '', issuer: '', year: '' })}
                >
                  <Plus size={14} /> Add Cert
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificateFields.map((field, index) => (
                  <div key={field.id} className="relative border border-[#2A2D3A] rounded-xl p-4 bg-[#1E2030]/20 space-y-4">
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-[#FF5D73] hover:bg-[#FF5D73]/10 hover:text-[#FF5D73]"
                        onClick={() => removeCertificate(index)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-[calc(100%-2.5rem)]">
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Certificate Name</Label>
                        <Input placeholder="e.g. AWS Cloud Practitioner" {...register(`certificates.${index}.name`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-[#A1A1AA]">Issuing Authority</Label>
                        <Input placeholder="e.g. Amazon Web Services" {...register(`certificates.${index}.issuer`)} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-xs text-[#A1A1AA]">Year</Label>
                        <Input placeholder="e.g. 2023" {...register(`certificates.${index}.year`)} />
                      </div>
                    </div>
                  </div>
                ))}
                {certificateFields.length === 0 && (
                  <p className="text-xs text-[#A1A1AA] text-center py-4 bg-[#1E2030]/10 rounded-xl border border-dashed border-[#2A2D3A]">
                    No certificates registered.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
              <CardHeader>
                <CardTitle className="text-base text-white">Skills Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="skillsInput" className="text-xs text-[#A1A1AA]">Skills (Comma-separated)</Label>
                  <Input id="skillsInput" placeholder="e.g. React, TypeScript, Python, Tailwind" {...register('skillsInput')} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'preferences' && (
          <Card className="bg-[#171923] border-[#2A2D3A] shadow-none">
            <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
              <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
                <Settings2 size={18} />
              </div>
              <CardTitle className="text-base text-white">Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pref-jobType" className="text-xs text-[#A1A1AA]">Job Type Preference</Label>
                <Select id="pref-jobType" {...register('preferences.jobType')}>
                  <option value="">No preference</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pref-location" className="text-xs text-[#A1A1AA]">Location Preference</Label>
                <Input id="pref-location" placeholder="e.g. Remote, New York, London" {...register('preferences.location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pref-salary" className="text-xs text-[#A1A1AA]">Desired Salary</Label>
                <Input id="pref-salary" placeholder="e.g. $100k/yr or ₹12 LPA" {...register('preferences.salary')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pref-noticePeriod" className="text-xs text-[#A1A1AA]">Notice Period</Label>
                <Input id="pref-noticePeriod" placeholder="e.g. Immediate, 30 days" {...register('preferences.noticePeriod')} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer save CTA */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2D3A]">
          <Button type="submit" size="lg" className="px-8 bg-[#4F8CFF] hover:bg-[#3D7AED] text-white">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
