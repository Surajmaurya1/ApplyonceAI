import { Link } from 'react-router-dom'
import { ArrowRight, Play, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { Progress } from '../ui/Progress'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-5 pb-20 pt-20 select-none">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111111] px-3.5 py-1.5 text-xs font-medium text-[#FAFAFA] shadow-none">
            <ShieldCheck size={14} className="text-white" /> Powered by Google Gemini AI
          </span>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            Upload Once.
            <br />
            <span className="text-[#A1A1AA]">
              Apply Anywhere.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A1A1AA]">
            ApplyOnce AI extracts information from your documents and helps you complete applications faster with fewer mistakes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to="/signup" className="flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works" className="flex items-center gap-2">
                <Play size={15} className="fill-current" /> Watch Demo
              </a>
            </Button>
          </div>
          <p className="mt-8 text-xs text-[#A1A1AA]">Trusted by 1,200+ job seekers</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <Card className="p-0 border-[#262626] bg-[#111111] shadow-none rounded-2xl">
            <div className="bg-[#171717] px-4 py-3 flex gap-1.5 border-b border-[#262626]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-800" />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-800" />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-800" />
            </div>
            <CardContent className="grid gap-6 p-6">
              <div className="rounded-xl border border-[#262626] bg-[#171717]/60 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-[#A1A1AA]">Profile completion</p>
                  <span className="text-xs font-bold text-white">85%</span>
                </div>
                <Progress value={85} className="h-1.5 bg-[#262626]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#262626] bg-[#171717]/40 p-4">
                  <p className="text-xs text-[#A1A1AA]">Documents uploaded</p>
                  <p className="text-xl font-bold text-white mt-1">4</p>
                </div>
                <div className="rounded-xl border border-[#262626] bg-[#171717]/40 p-4">
                  <p className="text-xs text-[#A1A1AA]">Applications filled</p>
                  <p className="text-xl font-bold text-white mt-1">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
