import styles from './MessageBubble.module.css'

export default function MessageBubble({ message, index, onViewSources }) {
  const { role, content, data } = message

  /* USER MESSAGE */
  if (role === 'user') {
    return (
      <div className={styles.userWrap} style={{ animationDelay: `${index * 0.05}s` }}>
        <div className={styles.userBubble}>{content}</div>
      </div>
    )
  }

  /* ERROR MESSAGE */
  if (role === 'error') {
    return (
      <div className={styles.errorWrap}>
        <div className={styles.errorBubble}>
          <span className={styles.errorIcon}>⚠</span>
          {content}
        </div>
      </div>
    )
  }

  /* ASSISTANT MESSAGE */
  return (
    <div className={styles.assistantWrap} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className={styles.avatar}>
        <span>CU</span>
      </div>

      <div className={styles.assistantContent}>

        {/* CONDITION OVERVIEW */}
        {data?.conditionOverview && (
          <div className={styles.overview}>
            <div className={styles.overviewLabel}>Condition overview</div>
            <p>{data.conditionOverview}</p>
          </div>
        )}

        {/* MAIN RESPONSE */}
        <div className={styles.mainText}>{content}</div>

        {/* KEY TAKEAWAYS */}
        {data?.keyTakeaways?.length > 0 && (
          <div className={styles.takeaways}>
            <div className={styles.takeawaysLabel}>Key takeaways</div>
            <ul className={styles.takeawayList}>
              {data.keyTakeaways.map((t, i) => (
                <li key={i} className={styles.takeawayItem}>
                  <span className={styles.bullet} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* META INFO */}
        {data?.meta && (
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} style={{ background: 'var(--accent)' }} />
              {data.publications?.length || 0} publications
            </span>

            <span className={styles.metaSep}>·</span>

            <span className={styles.metaItem}>
              <span className={styles.metaDot} style={{ background: '#00d4ff' }} />
              {data.clinicalTrialsData?.length || 0} trials
            </span>

            <span className={styles.metaSep}>·</span>

            <span className={styles.metaItem}>
              {(data.meta.totalFetched?.publications || 0) +
                (data.meta.totalFetched?.trials || 0)} total retrieved
            </span>

            {data.meta.processingTime && (
              <>
                <span className={styles.metaSep}>·</span>
                <span className={styles.metaItem}>
                  {(data.meta.processingTime / 1000).toFixed(1)}s
                </span>
              </>
            )}
          </div>
        )}

        {/* VIEW SOURCES BUTTON */}
        {data && onViewSources && (
          <button className={styles.sourcesBtn} onClick={onViewSources}>
            View publications & trials →
          </button>
        )}

        {/* DISCLAIMER */}
        {data?.disclaimer && (
          <div className={styles.disclaimer}>{data.disclaimer}</div>
        )}
      </div>
    </div>
  )
}
