import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, Trash2, GraduationCap, Briefcase, KeyRound, UserRound, MapPin } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { useProfile } from '../features/profile/profileStore'

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      ...profile,
      skillsInput: profile.skills ? profile.skills.join(', ') : ''
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

  useEffect(() => {
    reset({
      ...profile,
      skillsInput: profile.skills ? profile.skills.join(', ') : ''
    })
  }, [profile, reset])

  function save(data) {
    const parsedSkills = data.skillsInput
      ? data.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    updateProfile({
      ...data,
      skills: parsedSkills,
      address: {
        full: data.address?.full || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
      },
    })
    toast.success('Profile saved successfully')
  }

  return (
    <div className="space-y-6 max-w-4xl select-none animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Review and correct extracted information before using it.
        </p>
      </div>

      <form onSubmit={handleSubmit(save)} className="space-y-6">
        {/* Personal Information */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
            <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
              <UserRound size={18} />
            </div>
            <CardTitle className="text-base text-white">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-[#A1A1AA]">Full name</Label>
              <Input id="name" {...register('name', { minLength: 2 })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-[#A1A1AA]">Email</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs text-[#A1A1AA]">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-xs text-[#A1A1AA]">Date of birth</Label>
              <Input id="dob" placeholder="DD/MM/YYYY" {...register('dob')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-xs text-[#A1A1AA]">Gender</Label>
              <Select id="gender" {...register('gender')}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Identity Details */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
            <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
              <KeyRound size={18} />
            </div>
            <CardTitle className="text-base text-white">Identity Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber" className="text-xs text-[#A1A1AA]">Aadhaar Number</Label>
              <Input id="aadhaarNumber" placeholder="12-digit UIDAI number" {...register('aadhaarNumber')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-xs text-[#A1A1AA]">PAN Card Number</Label>
              <Input id="panNumber" placeholder="10-digit alphanumeric PAN" {...register('panNumber')} />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader className="flex flex-row items-center gap-2.5 pb-4">
            <div className="rounded-xl bg-white/10 p-2 text-white shrink-0">
              <MapPin size={18} />
            </div>
            <CardTitle className="text-base text-white">Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="address-full" className="text-xs text-[#A1A1AA]">Full address</Label>
              <Input id="address-full" {...register('address.full')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-xs text-[#A1A1AA]">City</Label>
              <Input id="city" {...register('address.city')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-xs text-[#A1A1AA]">State</Label>
              <Input id="state" {...register('address.state')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-xs text-[#A1A1AA]">PIN code</Label>
              <Input id="pincode" {...register('address.pincode')} />
            </div>
          </CardContent>
        </Card>

        {/* Education Details */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
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
              className="flex items-center gap-1.5"
              onClick={() => appendEducation({ level: '', school: '', year: '', percentage: '' })}
            >
              <Plus size={14} /> Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="relative border border-[#262626] rounded-xl p-4 bg-[#171717]/40 space-y-4">
                <div className="absolute top-4 right-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 max-w-[calc(100%-2.5rem)]">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#A1A1AA]">Degree / Course Level</Label>
                    <Input placeholder="e.g. Bachelor of Technology" {...register(`education.${index}.level`)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#A1A1AA]">School / University</Label>
                    <Input placeholder="e.g. ABC University" {...register(`education.${index}.school`)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#A1A1AA]">Passing Year</Label>
                    <Input placeholder="e.g. 2024" {...register(`education.${index}.year`)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[#A1A1AA]">Percentage / CGPA</Label>
                    <Input placeholder="e.g. 85% or 8.5" {...register(`education.${index}.percentage`)} />
                  </div>
                </div>
              </div>
            ))}
            {educationFields.length === 0 && (
              <p className="text-xs text-[#A1A1AA] text-center py-4 bg-[#171717]/10 rounded-xl border border-dashed border-[#262626]">
                No education details added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Experience Details */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
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
              className="flex items-center gap-1.5"
              onClick={() => appendExperience({ company: '', title: '', duration: '' })}
            >
              <Plus size={14} /> Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="relative border border-[#262626] rounded-xl p-4 bg-[#171717]/40 space-y-4">
                <div className="absolute top-4 right-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
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
                    <Input placeholder="e.g. Software Engineer" {...register(`experience.${index}.title`)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-xs text-[#A1A1AA]">Duration</Label>
                    <Input placeholder="e.g. June 2022 - Present or 2 Years" {...register(`experience.${index}.duration`)} />
                  </div>
                </div>
              </div>
            ))}
            {experienceFields.length === 0 && (
              <p className="text-xs text-[#A1A1AA] text-center py-4 bg-[#171717]/10 rounded-xl border border-dashed border-[#262626]">
                No work experience added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Skills Details */}
        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader>
            <CardTitle className="text-base text-white">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillsInput" className="text-xs text-[#A1A1AA]">Skills (Comma-separated)</Label>
              <Input id="skillsInput" placeholder="e.g. React, Node.js, JavaScript, Python" {...register('skillsInput')} />
              <p className="text-[11px] text-[#A1A1AA]">Separate each skill with a comma.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8">
            Save profile
          </Button>
        </div>
      </form>
    </div>
  )
}
