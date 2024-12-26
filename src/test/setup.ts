import { expect, beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Add custom matchers
expect.extend(matchers)

// Cleanup after each test
beforeEach(() => {
  cleanup()
})