import { useState } from 'react'
import styles from './ResearchPanel.module.css'

const STATUS_COLOR = {
  RECRUITING: '#9D4EDD',
  COMPLETED: '#7B2CBF',
  ACTIVE_NOT_RECRUITING: '#E0AAFF',
  TERMINATED: '#ff6b6b',
  WITHDRAWN: '#a06cd5',
  UNKNOWN: '#a06cd5'
}

export default function ResearchPanel({ data, disease, onClose }) {
  const [tab, setTab] = useState('publications')
  const { publications = [], clinicalTrialsData = [], meta, researchInsights = [] } = data

  const totalResults = publications.length + clinicalTrialsData.length

  return (
    <aside className={styles.panel}>
      
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          Research sources
          <span className={styles.panelSub}> for {disease || 'query'}</span>
        </div>

        {meta?.totalFetched && (
          <span className={styles.fetchedBadge}>
            {totalResults} results
          </span>
        )}

        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>

      {/* Query */}
      {meta?.expandedQuery && (
        <div className={styles.queryExpanded}>
          <span className={styles.queryLabel}>Expanded</span>
          <span className={styles.queryText}>"{meta.expandedQuery}"</span>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <Tab label="Publications" count={publications.length} active={tab === 'publications'} onClick={() => setTab('publications')} />
        <Tab label="Trials" count={clinicalTrialsData.length} active={tab === 'trials'} onClick={() => setTab('trials')} />
        {researchInsights.length > 0 && (
          <Tab label="Insights" count={researchInsights.length} active={tab === 'insights'} onClick={() => setTab('insights')} />
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {tab === 'publications' && (
          <List empty="No publications found." items={publications} render={(item, i) => <PublicationCard key={i} pub={item} index={i} />} />
        )}

        {tab === 'trials' && (
          <List empty="No clinical trials found." items={clinicalTrialsData} render={(item, i) => <TrialCard key={i} trial={item} index={i} />} />
        )}

        {tab === 'insights' && (
          <List empty="No insights available." items={researchInsights} render={(item, i) => <InsightCard key={i} insight={item} index={i} />} />
        )}
      </div>
    </aside>
  )
}

/* ---------- SMALL UI COMPONENTS ---------- */

function Tab({ label, count, active, onClick }) {
  return (
    <button
      className={`${styles.tab} ${active ? styles.tabActive : ''}`}
      onClick={onClick}
    >
      {label}
      <span className={styles.tabCount}>{count}</span>
    </button>
  )
}

function List({ items, render, empty }) {
  if (!items.length) return <div className={styles.empty}>{empty}</div>

  return (
    <div className={styles.list}>
      {items.map(render)}
    </div>
  )
}

/* ---------- CARDS ---------- */

function PublicationCard({ pub, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.04}s` }}>
      
      <div className={styles.cardHeader}>
        <span className={styles.sourcePill}>{pub.source}</span>
        <span className={styles.year}>{pub.year || 'N/A'}</span>
      </div>

      <div className={styles.cardTitle}>
        {pub.url ? (
          <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
            {pub.title}
          </a>
        ) : pub.title}
      </div>

      {pub.authors?.length > 0 && (
        <div className={styles.authors}>
          {pub.authors.slice(0, 3).join(', ')}
          {pub.authors.length > 3 ? ' et al.' : ''}
        </div>
      )}

      {pub.abstract && pub.abstract !== 'No abstract available' && (
        <div className={styles.abstractWrap}>
          <div className={`${styles.abstract} ${expanded ? styles.abstractExpanded : ''}`}>
            {pub.abstract}
          </div>
          <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Show less' : 'Show abstract'}
          </button>
        </div>
      )}

      {pub.citationCount > 0 && (
        <div className={styles.citCount}>Cited {pub.citationCount} times</div>
      )}
    </div>
  )
}

function TrialCard({ trial, index }) {
  const [expanded, setExpanded] = useState(false)
  const color = STATUS_COLOR[trial.status] || STATUS_COLOR.UNKNOWN

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.04}s` }}>
      
      <div className={styles.cardHeader}>
        <span
          className={styles.statusPill}
          style={{ color, borderColor: `${color}40`, background: `${color}15` }}
        >
          {trial.status?.replace(/_/g, ' ')}
        </span>

        {trial.phase && trial.phase !== 'N/A' && (
          <span className={styles.phase}>Phase {trial.phase}</span>
        )}

        {trial.nctId && <span className={styles.nctId}>{trial.nctId}</span>}
      </div>

      <div className={styles.cardTitle}>
        {trial.url ? (
          <a href={trial.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
            {trial.title}
          </a>
        ) : trial.title}
      </div>

      {trial.briefSummary && (
        <div className={styles.abstractWrap}>
          <div className={`${styles.abstract} ${expanded ? styles.abstractExpanded : ''}`}>
            {trial.briefSummary}
          </div>
          <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Show less' : 'Show summary'}
          </button>
        </div>
      )}

      <div className={styles.trialMeta}>
        {trial.minAge !== 'N/A' && (
          <span className={styles.trialMetaItem}>
            Ages: {trial.minAge} – {trial.maxAge}
          </span>
        )}
      </div>
    </div>
  )
}

function InsightCard({ insight, index }) {
  return (
    <div className={styles.insightCard} style={{ animationDelay: `${index * 0.04}s` }}>
      <div className={styles.insightFinding}>{insight.finding}</div>
      <div className={styles.insightMeta}>
        <span className={styles.insightSource}>{insight.source}</span>
        {insight.year && <span className={styles.insightYear}>{insight.year}</span>}
      </div>
      {insight.significance && (
        <div className={styles.insightSig}>{insight.significance}</div>
      )}
    </div>
  )
}
