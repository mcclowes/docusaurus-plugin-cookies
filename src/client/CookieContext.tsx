import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CookieCategory } from '../types'

export type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  consentGiven: boolean
  timestamp?: number
}

type CookieContextType = {
  preferences: CookiePreferences | null
  hasConsent: () => boolean
  hasCategoryConsent: (category: CookieCategory) => boolean
  acceptAll: () => void
  rejectOptional: () => void
  rejectAll: () => void
  updatePreferences: (prefs: Partial<CookiePreferences>) => void
  resetConsent: () => void
}

const CookieContext = createContext<CookieContextType | null>(null)

export function useCookieConsent() {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider')
  }
  return context
}

type CookieProviderProps = {
  children: React.ReactNode
  storageKey: string
}

export function CookieProvider({ children, storageKey }: CookieProviderProps) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as CookiePreferences
        setPreferences(parsed)
      }
    } catch (error) {
      console.warn('[docusaurus-plugin-cookies] Failed to load preferences from localStorage:', error)
    }
  }, [storageKey])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || !preferences) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences))
    } catch (error) {
      console.warn('[docusaurus-plugin-cookies] Failed to save preferences to localStorage:', error)
    }
  }, [preferences, storageKey])

  const hasConsent = useCallback(() => {
    return preferences?.consentGiven ?? false
  }, [preferences])

  const hasCategoryConsent = useCallback(
    (category: CookieCategory) => {
      if (!preferences) return false
      // Necessary cookies are always allowed
      if (category === 'necessary') return true
      return preferences[category] ?? false
    },
    [preferences]
  )

  const acceptAll = useCallback(() => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      consentGiven: true,
      timestamp: Date.now(),
    })
  }, [])

  const rejectOptional = useCallback(() => {
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      consentGiven: true,
      timestamp: Date.now(),
    })
  }, [])

  const rejectAll = useCallback(() => {
    setPreferences({
      necessary: true, // Necessary cookies cannot be rejected
      analytics: false,
      marketing: false,
      functional: false,
      consentGiven: true,
      timestamp: Date.now(),
    })
  }, [])

  const updatePreferences = useCallback((prefs: Partial<CookiePreferences>) => {
    setPreferences((prev) => ({
      necessary: true, // Always true
      analytics: false,
      marketing: false,
      functional: false,
      consentGiven: false,
      ...prev,
      ...prefs,
      consentGiven: true,
      timestamp: Date.now(),
    }))
  }, [])

  const resetConsent = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(storageKey)
      setPreferences(null)
    } catch (error) {
      console.warn('[docusaurus-plugin-cookies] Failed to reset consent:', error)
    }
  }, [storageKey])

  const value: CookieContextType = {
    preferences,
    hasConsent,
    hasCategoryConsent,
    acceptAll,
    rejectOptional,
    rejectAll,
    updatePreferences,
    resetConsent,
  }

  return <CookieContext.Provider value={value}>{children}</CookieContext.Provider>
}

