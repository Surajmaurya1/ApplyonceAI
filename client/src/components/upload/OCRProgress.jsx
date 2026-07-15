import Progress from '../ui/Progress'

export default function OCRProgress({ progress }) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#171717]/40 p-4 space-y-3 shadow-none">
      <div className="flex justify-between text-xs font-medium text-white">
        <span>Reading document…</span>
        <span className="text-white font-bold">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5 bg-[#262626]" />
    </div>
  )
}
