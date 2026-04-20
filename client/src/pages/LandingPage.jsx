import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './LandingPage.module.css'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const EXAMPLE_QUERIES = [
  { disease: "Parkinson's disease", query: 'Deep Brain Stimulation' },
  { disease: 'Lung Cancer', query: 'Latest immunotherapy treatments' },
  { disease: 'Type 2 Diabetes', query: 'Clinical trials recruiting' },
  { disease: "Alzheimer's disease", query: 'Amyloid beta inhibitors' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ patientName: '', disease: '', query: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.disease.trim()) {
      setError('Please enter a disease or condition.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API}/api/session`, form)

      navigate(`/chat/${res.data.sessionId}`, {
        state: {
          initialQuery: form.query,
          disease: form.disease,
          patientName: form.patientName
        }
      })
    } catch {
      setError('Server connection failed.')
    } finally {
      setLoading(false)
    }
  }

  const useExample = ex =>
    setForm(f => ({ ...f, disease: ex.disease, query: ex.query }))

  return (
    <div className={styles.root}>
      
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoWhite}>Cura</span>
          <span className={styles.logoAccent}>link</span>
        </div>
        <div className={styles.navTag}>AI Research Assistant</div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.badge}>AI-powered · Evidence-based</div>

          <h1 className={styles.headline}>
            Medical research,<br />
            <span>reimagined.</span>
          </h1>

          <p className={styles.sub}>
            Explore real publications, clinical trials, and expert insights —
            all synthesized into clear, structured answers.
          </p>
        </div>

        {/* Form */}
        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.formGrid}>
              <input
                className={styles.input}
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Patient name (optional)"
              />

              <input
                className={styles.input}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location (optional)"
              />
            </div>

            <input
              className={`${styles.input} ${styles.inputLg}`}
              name="disease"
              value={form.disease}
              onChange={handleChange}
              placeholder="Disease or condition..."
              required
            />

            <input
              className={`${styles.input} ${styles.inputLg}`}
              name="query"
              value={form.query}
              onChange={handleChange}
              placeholder="Research query..."
            />

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.btn} disabled={loading}>
              {loading ? 'Starting...' : 'Start Research →'}
            </button>
          </form>

          {/* Examples */}
          <div className={styles.examples}>
            {EXAMPLE_QUERIES.map((ex, i) => (
              <button
                key={i}
                className={styles.exampleChip}
                onClick={() => useExample(ex)}
              >
                {ex.disease} — {ex.query}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          Made by <span>Riya Agarwal</span>
        </footer>

      </main>
    </div>
  )
}
