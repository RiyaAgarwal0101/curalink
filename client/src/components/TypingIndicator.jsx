import styles from './TypingIndicator.module.css'

export default function TypingIndicator() {
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>
        <span>CU</span>
      </div>

      <div className={styles.bubble}>
        <div className={styles.label}>
          Retrieving evidence & reasoning
        </div>

        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>

        <div className={styles.steps}>
          <span className={styles.step}>PubMed</span>
          <span className={styles.sep}>·</span>

          <span className={styles.step}>OpenAlex</span>
          <span className={styles.sep}>·</span>

          <span className={styles.step}>Clinical Trials</span>
          <span className={styles.sep}>·</span>

          <span className={styles.step}>Ranking</span>
          <span className={styles.sep}>·</span>

          <span className={styles.step}>AI reasoning</span>
        </div>
      </div>
    </div>
  )
}
