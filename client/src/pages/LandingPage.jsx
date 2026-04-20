import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './LandingPage.module.css'

const API = import.meta.env.VITE_API_URL || ''

const EXAMPLE_QUERIES = [
  { disease: "Parkinson's disease", query: 'Deep Brain Stimulation', icon: '⬡' },
  { disease: 'Lung Cancer', query: 'Latest immunotherapy treatments', icon: '⬡' },
  { disease: 'Type 2 Diabetes', query: 'Clinical trials recruiting', icon: '⬡' },
  { disease: "Alzheimer's disease", query: 'Amyloid beta inhibitors', icon: '⬡' },
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
      setError('Could not connect to server.')
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
        <div className={styles.grid} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.scanline} />
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoAccent}>Curalink</span>
        </div>
        <div className={styles.navTag}>AI Medical Research Assistant</div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        
        <div className={styles.centerWrap}>
          
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.badge}>Research-based · Source-linked · Context-aware</div>
            <h1 className={styles.headline}>
              Where research meets <br />
              <em>reasoning.</em>
            </h1>
            <p className={styles.sub}>
              Start with a condition. Explore real publications, clinical trials, and AI insights in one place.
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

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          Made by <span>Riya Agarwal</span>
        </div>

      </main>
    </div>
  )
}
