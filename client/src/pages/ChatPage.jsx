import { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './ChatPage.module.css'
import MessageBubble from '../components/MessageBubble'
import ResearchPanel from '../components/ResearchPanel'
import TypingIndicator from '../components/TypingIndicator'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export default function ChatPage() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { initialQuery, disease, patientName } = location.state || {}

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeResult, setActiveResult] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const sentInitial = useRef(false)

  useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true
      sendQuery(initialQuery)
    } else if (!initialQuery && !sentInitial.current) {
      sentInitial.current = true
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendQuery = async (queryText) => {
    const q = queryText || input.trim()
    if (!q || loading) return

    setInput('')
    setError('')
    setLoading(true)

    const userMsg = { id: Date.now(), role: 'user', content: q }
    setMessages(prev => [...prev, userMsg])

    try {
      const url = `${API}/api/query/${sessionId}`

      const res = await axios.post(url, {
        query: q,
        disease
      })

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.personalizedRecommendation || 'Research complete.',
        data: res.data
      }

      setMessages(prev => [...prev, assistantMsg])
      setActiveResult(res.data)
      setPanelOpen(true)

    } catch (err) {
      setError(err.response?.data?.error || 'Research failed.')
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: err.response?.data?.error || 'Error occurred.'
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuery()
    }
  }

  const FOLLOW_UP = [
    'What are the side effects?',
    'Are there clinical trials I can join?',
    'What do top researchers say?',
    'Explain this simply',
  ]

  return (
    <div className={styles.root}>
      
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← New session
        </button>

        <div className={styles.sessionInfo}>
          <div className={styles.sessionLabel}>Session</div>
          <div className={styles.sessionDisease}>{disease || 'General Research'}</div>
          {patientName && <div className={styles.sessionPatient}>{patientName}</div>}
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sidebarLabel}>Quick prompts</div>
          {FOLLOW_UP.map((q, i) => (
            <button
              key={i}
              className={styles.quickBtn}
              onClick={() => {
                setInput(q)
                inputRef.current?.focus()
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.disclaimer}>
            Research use only
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoGlow}>C</span>uralink
          </div>

          {activeResult && (
            <button className={styles.panelToggle} onClick={() => setPanelOpen(p => !p)}>
              Sources ({(activeResult.publications?.length || 0)})
            </button>
          )}
        </header>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <h2>Start your research</h2>
              <p>Ask anything about <b>{disease}</b></p>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              index={i}
              onViewSources={() => {
                setActiveResult(msg.data)
                setPanelOpen(true)
              }}
            />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && <div className={styles.errorBar}>{error}</div>}

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrap}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              rows={1}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendQuery()}
              disabled={!input.trim()}
            >
              ↑
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          Made by <span>R aga</span>
        </footer>
      </main>

      {/* Panel */}
      {panelOpen && activeResult && (
        <ResearchPanel
          data={activeResult}
          disease={disease}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  )
}
