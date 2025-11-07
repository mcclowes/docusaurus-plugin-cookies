import React, { useState, useEffect } from 'react'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { useCookieConsent } from './CookieContext'
import type { CookieConsentOptions, CookieCategory } from '../types'

type CookieConsentModalProps = {
  options: CookieConsentOptions
}

export function CookieConsentModal({ options }: CookieConsentModalProps) {
  const { preferences, acceptAll, rejectOptional, rejectAll } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Only show if consent hasn't been given
    if (!preferences?.consentGiven) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [preferences])

  if (!ExecutionEnvironment.canUseDOM || !isVisible) {
    return null
  }

  const handleAcceptAll = () => {
    acceptAll()
    setIsVisible(false)
  }

  const handleRejectOptional = () => {
    rejectOptional()
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    rejectAll()
    setIsVisible(false)
  }

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
          <a key={i} href={linkUrl} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        )
        i += 2 // Skip the next two parts we already processed
      }
    }

    return elements.length > 0 ? <>{elements}</> : text
  }

  const defaultCategories: Record<CookieCategory, { label: string; description: string; enabled?: boolean }> = {
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

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: options.toastMode ? 'auto' : '50%',
        bottom: options.toastMode ? '20px' : 'auto',
        left: options.toastMode ? '20px' : '50%',
        right: options.toastMode ? '20px' : 'auto',
        transform: options.toastMode ? 'none' : 'translate(-50%, -50%)',
        maxWidth: options.toastMode ? '100%' : '600px',
        width: options.toastMode ? 'calc(100% - 40px)' : '90%',
        maxHeight: options.toastMode ? '400px' : '90vh',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 10000,
        padding: '24px',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h2
        style={{
          margin: '0 0 16px 0',
          fontSize: '24px',
          fontWeight: '600',
          color: '#1a1a1a',
        }}
      >
        {options.title || 'Cookie Consent'}
      </h2>

      <div
        style={{
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#4a4a4a',
        }}
      >
        {renderDescription(options.description || '')}
      </div>

      {options.links && options.links.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {options.links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0066cc',
                textDecoration: 'none',
                marginRight: '16px',
                fontSize: '14px',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {showDetails && (
        <div
          style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
            Cookie Categories
          </h3>
          {categoryList.map((category) => {
            const categoryConfig = categories[category] || defaultCategories[category]
            if (categoryConfig.enabled === false) return null

            return (
              <div key={category} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {categoryConfig.label}
                  {category === 'necessary' && (
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                      (Required)
                    </span>
                  )}
                </div>
                {categoryConfig.description && (
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {categoryConfig.description}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: options.toastMode ? 'row' : 'column',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={handleAcceptAll}
          style={{
            flex: options.toastMode ? '1' : 'none',
            padding: '12px 24px',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            minWidth: options.toastMode ? '120px' : 'auto',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0052a3'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0066cc'
          }}
        >
          {options.acceptAllText || 'Accept All'}
        </button>

        {options.rejectOptionalText && (
          <button
            onClick={handleRejectOptional}
            style={{
              flex: options.toastMode ? '1' : 'none',
              padding: '12px 24px',
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: options.toastMode ? '120px' : 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
            }}
          >
            {options.rejectOptionalText}
          </button>
        )}

        <button
          onClick={handleRejectAll}
          style={{
            flex: options.toastMode ? '1' : 'none',
            padding: '12px 24px',
            backgroundColor: '#f5f5f5',
            color: '#1a1a1a',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            minWidth: options.toastMode ? '120px' : 'auto',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e8e8e8'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
        >
          {options.rejectAllText || 'Reject All'}
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            flex: options.toastMode ? '1' : 'none',
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#0066cc',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'underline',
            minWidth: options.toastMode ? '120px' : 'auto',
          }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {modalContent}
      {/* Backdrop overlay */}
      {!options.toastMode && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
          onClick={() => {
            // Don't close on backdrop click - user must make a choice
          }}
        />
      )}
    </>
  )
}
