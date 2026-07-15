import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export default function Extension() {
  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Chrome extension</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">
          Install the browser extension to use your saved profile on any job or application portal.
        </p>
      </div>

      <Card className="max-w-2xl bg-[#111111] border-[#262626] shadow-none rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base text-white">Install locally in Chrome</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-4 pl-5 text-sm text-[#A1A1AA] leading-relaxed">
            <li>
              Open <code className="bg-[#171717] border border-[#262626] px-1.5 py-0.5 rounded-lg font-mono text-[11px] text-white">chrome://extensions</code> in your Chrome browser.
            </li>
            <li>
              Toggle and enable <strong>Developer mode</strong> in the top-right corner.
            </li>
            <li>
              Click the <strong>Load unpacked</strong> button on the top-left.
            </li>
            <li>
              Select the project's <code className="bg-[#171717] border border-[#262626] px-1.5 py-0.5 rounded-lg font-mono text-[11px] text-white">extension</code> folder from your local directory.
            </li>
            <li>
              Open any application form online and click the <strong>ApplyOnce AI</strong> extension icon to auto-fill!
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
