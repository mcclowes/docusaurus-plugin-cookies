import React, { useState, useEffect, useRef } from 'react'
import { useCookieConsent } from './Provider'
import type { CookieConsentOptions, CookieCategory } from '../types'
import styles from './Modal.module.css'

type CookieConsentModalProps = {
  options: CookieConsentOptions
}

export function CookieConsentModal({ options }: CookieConsentModalProps) {
  const { preferences, loading, acceptAll, rejectOptional, rejectAll } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Don't show modal if loading or consent already given
  if (loading || preferences?.consentGiven) {
    return null
  }

  // Keyboard and focus management
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // ESC key - treat as reject all
        rejectAll()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Prevent body scrolling when modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the first button
    setTimeout(() => {
      const firstButton = modalRef.current?.querySelector('button')
      firstButton?.focus()
    }, 100)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [rejectAll])

  // Render markdown-like links in description
  const renderDescription = (text: string) => {
    if (!text) return null

    // Simple markdown link parsing: [text](url)
    const parts = text.split(/(\[([^\]]+)\]\(([^)]+)\))/g)
    const elements: React.ReactNode[] = []

    for (let i = 0; i < parts.length; i++) {
      if (i % 4 === 0 && parts[i]) {
        // Regular text
        elements.push(parts[i])
      } else if (i % 4 === 1 && parts[i + 1] && parts[i + 2]) {
        // Link match
        const linkText = parts[i + 1]
        const linkUrl = parts[i + 2]
        elements.push(
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${linkText} (opens in new tab)`}
          >
            {linkText}
            <span className={styles.srOnly}> (opens in new tab)</span>
          </a>
        )
        i += 2
      }
    }

    return elements.length > 0 ? <>{elements}</> : text
  }

  const defaultCategories: Record<CookieCategory, { label: string; description: string }> = {
    necessary: {
      label: 'Necessary',
      description: 'Essential cookies required for the website to function properly.',
    },
    analytics: {
      label: 'Analytics',
      description: 'Cookies that help us understand how visitors interact with our website.',
    },
    marketing: {
      label: 'Marketing',
      description: 'Cookies used to deliver personalized advertisements.',
    },
    functional: {
      label: 'Functional',
      description: 'Cookies that enable enhanced functionality and personalization.',
    },
  }

  const categories = options.categories || {}
  const categoryList: CookieCategory[] = ['necessary', 'analytics', 'marketing', 'functional']

  const overlayClass = options.toastMode
    ? `${styles.overlay} ${styles.toastOverlay}`
    : styles.overlay

  const modalClass = options.toastMode
    ? `${styles.modal} ${styles.toast}`
    : styles.modal

  const buttonsClass = options.toastMode
    ? `${styles.buttons} ${styles.buttonsToast}`
    : styles.buttons

  return (
    <>
      {/* Backdrop overlay */}
      {!options.toastMode && (
        <div
          className={overlayClass}
          aria-hidden="true"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        tabIndex={-1}
      >
        <h2 id="cookie-consent-title" className={styles.title}>
          {options.title || 'Cookie Consent'}
        </h2>

        <div id="cookie-consent-description" className={styles.description}>
          {renderDescription(
            options.description ||
              'We use cookies to enhance your browsing experience and analyze our traffic.'
          )}
        </div>

        {options.links && options.links.length > 0 && (
          <div className={styles.links}>
            {options.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (opens in new tab)`}
              >
                {link.label}
                <span className={styles.srOnly}> (opens in new tab)</span>
              </a>
            ))}
          </div>
        )}

        {showDetails && (
          <div className={styles.details}>
            <h3 className={styles.detailsTitle}>Cookie Categories</h3>
            {categoryList.map((category) => {
              const categoryConfig = categories[category] || defaultCategories[category]
              if ('enabled' in categoryConfig && categoryConfig.enabled === false) return null

              return (
                <div key={category} className={styles.category}>
                  <div className={styles.categoryLabel}>
                    {categoryConfig.label}
                    {category === 'necessary' && (
                      <span className={styles.categoryRequired}>(Required)</span>
                    )}
                  </div>
                  {categoryConfig.description && (
                    <div className={styles.categoryDescription}>
                      {categoryConfig.description}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className={buttonsClass}>
          <button
            onClick={acceptAll}
            className={`${styles.button} ${styles.buttonPrimary}`}
            type="button"
          >
            {options.acceptAllText || 'Accept All'}
          </button>

          {options.rejectOptionalText && (
            <button
              onClick={rejectOptional}
              className={`${styles.button} ${styles.buttonSecondary}`}
              type="button"
            >
              {options.rejectOptionalText}
            </button>
          )}

          <button
            onClick={rejectAll}
            className={`${styles.button} ${styles.buttonSecondary}`}
            type="button"
          >
            {options.rejectAllText || 'Reject All'}
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`${styles.button} ${styles.buttonText}`}
            type="button"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
    </>
  )
}

export default CookieConsentModal
