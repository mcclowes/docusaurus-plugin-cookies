import React from 'react'
import styles from './CookiePreferenceDemo.module.css'
import { useCookieConsent } from 'docusaurus-plugin-cookie-consent/client'

const CookiePreferenceDemo: React.FC = () => {
  const { preferences, hasConsent, hasCategoryConsent, acceptAll, rejectOptional, resetConsent } =
    useCookieConsent()

  return (
    <section className={styles.wrapper}>
      <h2>Cookie Preference Demo</h2>
      <p>
        This widget reads the current consent state from the plugin context. Use it to explore how
        you might react to consent changes inside your own components.
      </p>

      <dl className={styles.summary}>
        <div>
          <dt>Has consent?</dt>
          <dd>{hasConsent() ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Analytics allowed?</dt>
          <dd>{hasCategoryConsent('analytics') ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Marketing allowed?</dt>
          <dd>{hasCategoryConsent('marketing') ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Functional allowed?</dt>
          <dd>{hasCategoryConsent('functional') ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      {preferences ? (
        <pre className={styles.preferences}>{JSON.stringify(preferences, null, 2)}</pre>
      ) : (
        <p>No preferences are stored yet.</p>
      )}

      <div className={styles.actions}>
        <button className={styles.buttonPrimary} type="button" onClick={acceptAll}>
          Accept all cookies
        </button>
        <button className={styles.buttonSecondary} type="button" onClick={rejectOptional}>
          Only necessary
        </button>
        <button className={styles.buttonGhost} type="button" onClick={resetConsent}>
          Reset consent
        </button>
      </div>
    </section>
  )
}

export default CookiePreferenceDemo
