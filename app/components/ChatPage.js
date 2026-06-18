'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './ChatPage.module.css'

const SUGGESTIONS = [
  'What can you do?',
  'Explain AI in simple terms',
  'Write me a short poem',
  'Help me with coding',
]

// WebLLM model — small but capable, ~2GB
const WEBLLM_MODEL = 'Llama-3.2-1B-Instruct-q4f32_1-MLC'

const SYSTEM_PROMPT = `You are JhayemAI, a personal AI assistant created by Jhayem Cuysona, a BSIT student at Trinidad Municipal College (TMC) in Trinidad, Bohol, Philippines. You are helpful, smart, and have a slightly cool and casual personality. You can respond in English or Filipino/Bisaya depending on how the user talks to you. Keep responses concise and mobile-friendly.`

// Mode constants
const MODE_ONLINE  = 'online'   // Groq API
const MODE_OFFLINE = 'offline'  // WebLLM in-browser
const MODE_LOADING = 'loading'  // WebLLM downloading

export default function ChatPage({ user, onAbout, onLogout }) {
  const [messages, setMessages]     = useState([{ role: 'assistant', content: `Hey ${user}! 👋 I'm JhayemAI. Ask me anything!` }])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [isOnline, setIsOnline]     = useState(true)
  const [mode, setMode]             = useState(MODE_ONLINE)
  const [webllmReady, setWebllmReady] = useState(false)
  const [dlProgress, setDlProgress] = useState(0)
  const [dlText, setDlText]         = useState('Initializing...')
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)

  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const engineRef  = useRef(null)

  // ── Network detection ──────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (!online && mode === MODE_ONLINE) {
        setShowOfflineBanner(true)
        setTimeout(() => setShowOfflineBanner(false), 4000)
      }
    }
    window.addEventListener('online',  update)
    window.addEventListener('offline', update)
    update()
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [mode])

  // ── Scroll to bottom ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Load WebLLM ────────────────────────────────────────────────
  const loadWebLLM = useCallback(async () => {
    if (engineRef.current) { setMode(MODE_OFFLINE); return }
    setMode(MODE_LOADING)
    setDlProgress(0)
    setDlText('Loading WebLLM engine...')
    try {
      const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm')
      const engine = await CreateMLCEngine(WEBLLM_MODEL, {
        initProgressCallback: (p) => {
          setDlProgress(Math.round((p.progress || 0) * 100))
          setDlText(p.text || 'Downloading model...')
        },
      })
      engineRef.current = engine
      setWebllmReady(true)
      setMode(MODE_OFFLINE)
      setMessages(prev => [...prev, { role: 'assistant', content: '✅ Offline mode ready! I can now answer without internet.' }])
    } catch (err) {
      setMode(MODE_ONLINE)
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Could not load offline model: ${err.message}` }])
    }
  }, [])

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    setMenuOpen(false)

    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      if (mode === MODE_OFFLINE && engineRef.current) {
        // ── WebLLM path ──
        const reply = await engineRef.current.chat.completions.create({
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...apiMessages],
          max_tokens: 512,
          stream: false,
        })
        const text = reply.choices[0]?.message?.content || 'No response.'
        setMessages(prev => [...prev, { role: 'assistant', content: text }])
      } else {
        // ── Groq API path ──
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'API error')
        setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'No response.' }])
      }
    } catch (err) {
      if (!navigator.onLine) {
        setMessages(prev => [...prev, { role: 'assistant', content: '📵 You\'re offline. Switch to Offline Mode to chat without internet!' }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: `Chat cleared! What's on your mind, ${user}?` }])
    setMenuOpen(false)
  }

  const toggleMode = () => {
    if (mode === MODE_ONLINE || mode === MODE_LOADING) {
      loadWebLLM()
    } else {
      setMode(MODE_ONLINE)
      setMessages(prev => [...prev, { role: 'assistant', content: '🌐 Switched to Online mode (Groq API).' }])
    }
  }

  const modeLabel  = mode === MODE_OFFLINE ? '📴 Offline' : mode === MODE_LOADING ? '⏳ Loading...' : '🌐 Online'
  const modePill   = mode === MODE_OFFLINE ? styles.pillOffline : mode === MODE_LOADING ? styles.pillLoading : styles.pillOnline

  return (
    <div className={styles.page}>

      {/* Offline banner */}
      {showOfflineBanner && (
        <div className={styles.offlineBanner}>
          📵 No internet — switch to Offline Mode below
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar}>
            <img src="/jhayem.jpg" alt="JhayemAI" className={styles.headerImg} />
            <span className={`${styles.headerDot} ${!isOnline ? styles.headerDotOffline : ''}`} />
          </div>
          <div>
            <div className={styles.headerTitle}>JhayemAI</div>
            <div className={styles.headerSub}>
              {loading
                ? <><span className={styles.typingDot}/><span className={styles.typingDot}/><span className={styles.typingDot}/> thinking...</>
                : isOnline ? 'Online' : 'No internet'}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          {/* Mode toggle pill */}
          <button className={`${styles.modePill} ${modePill}`} onClick={toggleMode} disabled={mode === MODE_LOADING} title="Toggle online/offline AI">
            {modeLabel}
          </button>
          <button className={styles.iconBtn} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <MenuIcon />
          </button>
        </div>
        {menuOpen && (
          <div className={styles.dropdown}>
            <button className={styles.dropItem} onClick={onAbout}><InfoIcon /> About</button>
            <button className={styles.dropItem} onClick={clearChat}><TrashIcon /> Clear chat</button>
            <div className={styles.dropDivider} />
            <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={onLogout}><LogoutIcon /> Sign out</button>
          </div>
        )}
      </header>

      {/* WebLLM download progress */}
      {mode === MODE_LOADING && (
        <div className={styles.progressBar}>
          <div className={styles.progressInner} style={{ width: `${dlProgress}%` }} />
          <span className={styles.progressText}>{dlText} {dlProgress}%</span>
        </div>
      )}

      {/* Offline info banner */}
      {mode === MODE_LOADING && (
        <div className={styles.infoBanner}>
          ⏬ Downloading AI model (~2GB). This happens <strong>once only</strong> — cached forever after!
        </div>
      )}

      {/* Messages */}
      <div className={styles.messages} onClick={() => setMenuOpen(false)}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
            {m.role === 'assistant' && <div className={styles.aiIcon}>✦</div>}
            <div className={`${styles.bubbleContent} ${m.role === 'user' ? styles.userContent : styles.aiContent}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.bubble} ${styles.bubbleAI}`}>
            <div className={styles.aiIcon}>✦</div>
            <div className={`${styles.bubbleContent} ${styles.aiContent}`}>
              <div className={styles.dots}><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className={styles.suggestion} onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputRow}>
        <div className={styles.inputWrap}>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            placeholder={mode === MODE_LOADING ? 'Wait for model to load...' : 'Message JhayemAI...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            maxLength={2000}
            disabled={mode === MODE_LOADING}
          />
          <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={!input.trim() || loading || mode === MODE_LOADING} aria-label="Send">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuIcon()   { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg> }
function SendIcon()   { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9l14-7-5 7 5 7-14-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> }
function InfoIcon()   { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v5M8 5.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> }
function TrashIcon()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function LogoutIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3H3a1 1 0 00-1 1v8a1 1 0 001 1h7M11 5l3 3-3 3M6 8h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> }
