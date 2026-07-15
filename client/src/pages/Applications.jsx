import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Briefcase, GraduationCap, Landmark, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Applications() {
  const types = [
    {
      Icon: Briefcase,
      title: 'Job applications',
      desc: 'Fill job portals with a reusable professional profile containing experiences, education, and skills.',
    },
    {
      Icon: GraduationCap,
      title: 'College admissions',
      desc: 'Reuse identity details, previous grades, and diplomas across university application portals.',
    },
    {
      Icon: Landmark,
      title: 'Government services',
      desc: 'Complete civic forms accurately, with automated verification steps prior to submission.',
    },
  ]

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Applications</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Try the mapping engine in a safe demo application form.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {types.map(({ Icon, title, desc }) => (
          <Card key={title} className="bg-[#111111] border-[#262626] hover:border-white/20 transition-all duration-200 shadow-none rounded-2xl">
            <CardHeader>
              <div className="rounded-xl bg-white/10 p-2.5 text-white w-fit mb-2 shrink-0">
                <Icon size={20} />
              </div>
              <CardTitle className="text-base text-white">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <Button asChild>
          <Link to="/applications/demo" className="flex items-center gap-2">
            Open demo application <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  )
}
