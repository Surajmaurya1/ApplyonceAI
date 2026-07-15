import { FileText, Bot, RefreshCw, Zap, FolderOpen, Lock, Upload, ScanLine, UserCheck, MousePointerClick, Check, Star, Chrome } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'

const features = [
  [FileText, 'OCR Extraction', 'Extract text from Aadhaar, PAN, resumes, and marksheets automatically.'],
  [Bot, 'AI-Powered Parsing', 'Gemini turns raw document text into usable profile data.'],
  [RefreshCw, 'Reusable Profile', 'Fill it once, reuse it across hundreds of applications.'],
  [Zap, 'Auto-Fill Extension', 'Fill supported forms automatically in one click.'],
  [FolderOpen, 'Document Manager', 'Keep your important documents organized in one place.'],
  [Lock, 'Privacy First', 'Your data stays in your browser until you choose otherwise.'],
]

const docs = [
  'Aadhaar Card',
  'PAN Card',
  '10th Marksheet',
  '12th Marksheet',
  'Graduation Certificate',
  'Caste Certificate',
  'Disability Certificate',
  'Passport',
  'Driving Licence',
  'Resume / CV',
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 select-none">
      <h2 className="text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
        Everything you need to apply faster
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[#A1A1AA] text-sm">
        A secure profile that follows you through every application process.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, text]) => (
          <Card key={title} className="hover:border-white/20 transition-all duration-200 bg-[#111111] border-[#262626] shadow-none">
            <CardHeader className="pb-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white shrink-0">
                <Icon size={20} />
              </span>
              <CardTitle className="mt-4 text-base text-[#FAFAFA]">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[#A1A1AA]">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    [Upload, 'Upload documents', 'Upload standard identity and education files.'],
    [ScanLine, 'AI extracts info', 'Tesseract and Gemini extract info to structured JSON.'],
    [UserCheck, 'Review profile', 'Verify and refine your details in the dashboard.'],
    [MousePointerClick, 'Auto-fill forms', 'Autofill with one click using the extension.']
  ]

  return (
    <section id="how-it-works" className="bg-[#171717]/40 border-y border-[#262626] px-5 py-20 select-none">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[#A1A1AA] text-sm">
          Simple, automated, and always under your complete control.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {steps.map(([Icon, title, desc], i) => (
            <div className="relative text-center space-y-4" key={title}>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white font-extrabold text-black text-sm shadow-sm">
                {i + 1}
              </span>
              <Icon className="mx-auto text-white" size={22} />
              <h3 className="font-semibold text-[#FAFAFA] text-sm">{title}</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed px-4">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SupportedDocs() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 select-none">
      <h2 className="text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
        Documents we support
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[#A1A1AA] text-sm">
        We handle formatting from common Indian identity and academic documents.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {docs.map((doc) => (
          <Card key={doc} className="p-4 hover:border-white/20 transition-all bg-[#111111] border-[#262626] shadow-none rounded-2xl">
            <FileText className="mb-3 text-[#A1A1AA]" size={20} />
            <h3 className="font-semibold text-sm text-[#FAFAFA] mb-3">{doc}</h3>
            <Badge variant="success" className="gap-1 px-2.5 py-0.5 rounded-full text-[10px]">
              <Check size={10} /> Supported
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function ExtensionPreview() {
  return (
    <section className="bg-[#171717]/20 border-y border-[#262626] px-5 py-20 select-none">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Card className="shadow-none border-[#262626] bg-[#111111] rounded-2xl p-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-2 border-b border-[#262626] pb-4 bg-[#171717]/40 px-6 py-4">
            <Chrome size={18} className="text-white" />
            <span className="font-semibold text-[#FAFAFA] text-sm">ApplyOnce AI</span>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6 space-y-4">
            <p className="text-sm font-medium text-[#FAFAFA]">
              Form detected — 12 autofillable fields found
            </p>
            <div className="space-y-2">
              <div className="h-8 rounded-xl bg-[#171717] animate-pulse" />
              <div className="h-8 rounded-xl bg-[#171717] animate-pulse w-3/4" />
            </div>
            <Button className="w-full">
              Auto-fill this form
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
            A smarter browser extension
          </h2>
          <ul className="space-y-4 text-[#A1A1AA]">
            {['Auto-detect application forms', 'Smart field mapping & heuristics', 'Review everything before submitting'].map((x) => (
              <li className="flex items-start gap-3" key={x}>
                <span className="rounded-full bg-[#22C55E]/10 p-1 text-[#22C55E] mt-0.5 shrink-0">
                  <Check size={14} />
                </span>
                <span className="text-sm font-medium text-[#FAFAFA]">{x}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Button asChild>
              <Link to="/extension">
                Add to Chrome
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsFaq() {
  const qs = [
    'Is my data safe?',
    'Which documents are supported?',
    'How accurate is the OCR?',
    'Does it work with all websites?',
    'Is it free?',
    'Can I edit extracted information?',
    'Does it auto-submit forms?',
    'How do I install the extension?',
  ]

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-20 border-b border-[#262626] select-none">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
          Loved by candidates
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[#A1A1AA] text-sm">
          See how job seekers and students streamline their applications.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {['Priya S., Graduate', 'Rohan M., Job Seeker', 'Meera K., Student'].map((name) => (
            <Card key={name} className="flex flex-col justify-between bg-[#111111] border-[#262626] shadow-none rounded-2xl">
              <CardContent className="pt-6 space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star fill="currentColor" size={13} key={i} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#A1A1AA] italic">
                  "It saved me hours of repetitive form filling. The instant highlights feature makes reviewing so easy before finalizing the submission."
                </p>
                <p className="font-semibold text-[#FAFAFA] text-xs pt-2">{name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#171717]/10 px-5 py-20 select-none">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-3">
            {qs.map((q) => (
              <details className="group rounded-2xl border border-[#262626] bg-[#111111] p-4 transition-all" key={q}>
                <summary className="cursor-pointer font-semibold text-sm text-[#FAFAFA] select-none list-none flex justify-between items-center">
                  {q}
                  <span className="transition-transform group-open:rotate-180 text-[#A1A1AA] text-xs">▼</span>
                </summary>
                <p className="mt-3 text-xs text-[#A1A1AA] leading-relaxed">
                  ApplyOnce keeps you in control. The application extracts profile elements locally and maps them dynamically. You can review and edit every single value in your dashboard or popup before autofilling.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
