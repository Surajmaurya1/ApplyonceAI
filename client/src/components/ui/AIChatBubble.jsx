import { useState, useRef, useEffect } from 'react'
import { Sparkles, MessageSquareCode, Send, X, Bot, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import Button from './Button'
import Input from './Input'

export default function AIChatBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your ApplyOnce AI Assistant. How can I help you manage your profile or applications today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  async function handleSend(textToSend) {
    const msgText = textToSend || input
    if (!msgText.trim()) return

    const newMsgs = [...messages, { role: 'user', text: msgText }]
    setMessages(newMsgs)
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText }),
      })
      const data = await res.json()
      if (data.success) {
        setMessages([...newMsgs, { role: 'assistant', text: data.data.message }])
      } else {
        setMessages([...newMsgs, { role: 'assistant', text: 'Error contacting AI. Please verify API configuration.' }])
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', text: 'Network connection issue. Is server running on 3001?' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'Update my phone details',
    'Where is my PAN stored?',
    'What information is missing?'
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7C5CFF] text-white shadow-xl hover:bg-[#6B4FDE] transition-all hover:scale-105 active:scale-95 border border-[#7C5CFF]/30"
          title="Ask AI Assistant"
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <Card className="bg-[#171923] border-[#2A2D3A] w-[340px] h-[450px] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          <CardHeader className="bg-[#1E2030] p-4 flex flex-row items-center justify-between border-b border-[#2A2D3A]">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-[#7C5CFF]" />
              <CardTitle className="text-sm font-semibold text-white">ApplyOnce AI Companion</CardTitle>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white">
              <X size={16} />
            </button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs leading-relaxed" ref={listRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`rounded-lg p-2.5 ${m.role === 'user' ? 'bg-[#7C5CFF] text-white' : 'bg-[#1E2030] border border-[#2A2D3A] text-foreground'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="bg-[#1E2030] border border-[#2A2D3A] rounded-lg p-2.5 text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-[#7C5CFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-[#7C5CFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-[#7C5CFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[10px] text-left text-muted-foreground hover:text-white bg-secondary/30 hover:bg-secondary/50 rounded px-2.5 py-1.5 border border-border/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <div className="p-3 bg-[#1E2030] border-t border-[#2A2D3A] flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-card border-[#2A2D3A] h-9 text-xs focus:ring-[#7C5CFF]/30"
            />
            <Button
              onClick={() => handleSend()}
              className="bg-[#7C5CFF] hover:bg-[#6B4FDE] text-white p-2.5 h-9 shrink-0"
              disabled={loading}
            >
              <Send size={14} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
