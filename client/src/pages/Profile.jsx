import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import Select from '../components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { useProfile } from '../features/profile/profileStore'

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: profile,
  })

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  function save(data) {
    updateProfile({
      ...data,
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
    <div className="space-y-6 max-w-4xl select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Review and correct extracted information before using it.
        </p>
      </div>

      <form onSubmit={handleSubmit(save)} className="space-y-6">
        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader>
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

        <Card className="bg-[#111111] border-[#262626] shadow-none">
          <CardHeader>
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

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8">
            Save profile
          </Button>
        </div>
      </form>
    </div>
  )
}
