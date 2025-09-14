import { describe, it, expect } from '@jest/globals'
import { DocumentProcessor } from '../services/DocumentProcessor'

// Mock the dependencies that require database connection
jest.mock('@/middleware/errorHandler', () => ({
  AppError: class AppError extends Error {
    constructor(message: string, statusCode: number, code: string) {
      super(message)
      this.name = 'AppError'
    }
  }
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}))

describe('DocumentProcessor', () => {
  let processor: DocumentProcessor

  beforeEach(() => {
    processor = new DocumentProcessor()
  })

  describe('chunkDocument', () => {
    it('should chunk text into smaller pieces', () => {
      const text = 'This is a test document. It has multiple sentences. Each sentence should be processed correctly.'
      const chunks = processor.chunkDocument(text, 50, 10)

      expect(chunks).toBeInstanceOf(Array)
      expect(chunks.length).toBeGreaterThan(1)
      // The chunking algorithm adds periods, so we need to account for that
      expect(chunks[0].length).toBeLessThanOrEqual(52) // 50 + 2 for the added period
    })

    it('should handle empty text', () => {
      const chunks = processor.chunkDocument('', 100, 20)
      expect(chunks).toEqual([])
    })
  })

  describe('extractKeywords', () => {
    it('should extract keywords from text', () => {
      const text = 'legal document contract agreement party obligations terms conditions'
      const keywords = processor.extractKeywords(text, 5)

      expect(keywords).toBeInstanceOf(Array)
      expect(keywords.length).toBeLessThanOrEqual(5)
      expect(keywords).toContain('legal')
      expect(keywords).toContain('contract')
    })
  })

  describe('detectLanguage', () => {
    it('should detect English language', () => {
      const text = 'This is an English document with common English words. The and of to a in is it you that are very common.'
      const language = processor.detectLanguage(text)

      expect(language).toBe('en')
    })

    it('should return unknown for unrecognized text', () => {
      const text = 'xyz abc def ghi jkl'
      const language = processor.detectLanguage(text)

      expect(language).toBe('unknown')
    })
  })
})