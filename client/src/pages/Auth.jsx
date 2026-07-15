import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, UserRound, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Label from '../components/ui/Label'
import { Card, CardContent } from '../components/ui/Card'

export default function Auth({ signup = false }) {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(signup ? 'Welcome to ApplyOnce!' : 'Welcome back!')
      nav('/dashboard')
    }, 350)
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#090909] p-5 select-none animate-fade-in">
      <Card className="w-full max-w-md shadow-none border-[#262626] bg-[#111111] rounded-2xl">
        <CardContent className="p-7">
          <form onSubmit={submit}>
            <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
              <span className="rounded-lg bg-white p-2 text-black shrink-0">
                <Sparkles size={16} className="fill-current" />
              </span>
              <span className="tracking-tight text-white">ApplyOnce AI</span>
            </Link>
            
            <h1 className="mt-8 text-xl font-bold text-white">
              {signup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1.5 text-xs text-[#A1A1AA]">
              {signup ? 'Start applying with less repetition.' : 'Sign in to your personal workspace.'}
            </p>

            <div className="mt-6 space-y-4">
              {signup && (
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-xs text-[#A1A1AA]">Full name</Label>
                  <Input
                    id="fullname"
                    required
                    leftIcon={UserRound}
                    placeholder="Your name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-[#A1A1AA]">Email</Label>
                <Input
                  id="email"
                  required
                  type="email"
                  leftIcon={Mail}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-[#A1A1AA]">Password</Label>
                <Input
                  id="password"
                  required
                  type="password"
                  leftIcon={Lock}
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth className="mt-6">
              {signup ? 'Create account' : 'Sign in'}
            </Button>

            <p className="mt-5 text-center text-xs text-[#A1A1AA]">
              {signup ? 'Already have an account? ' : 'New to ApplyOnce? '}
              <Link className="font-semibold text-white hover:underline" to={signup ? '/login' : '/signup'}>
                {signup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
