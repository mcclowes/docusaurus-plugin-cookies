// Setup file for vitest tests
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup()
})
