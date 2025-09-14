import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'

export interface ExtractedContent {
  text: string
  metadata: {
    pages?: number
    wordCount: number
    charCount: number
    language?: string
  }
}

export class DocumentProcessor {
  async extractText(buffer: Buffer, mimeType: string, filename: string): Promise<ExtractedContent> {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return this.extractFromPDF(buffer)
        
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return this.extractFromWord(buffer)
        
        case 'text/plain':
          return this.extractFromText(buffer)
        
        default:
          throw new AppError(`Unsupported file type: ${mimeType}`, 400, 'UNSUPPORTED_FILE_TYPE')
      }
    } catch (error) {
      logger.error(`Error extracting text from ${filename}:`, error)
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError('Failed to extract text from document', 500, 'TEXT_EXTRACTION_ERROR')
    }
  }

  private async extractFromPDF(buffer: Buffer): Promise<ExtractedContent> {
    try {
      const data = await pdfParse(buffer)
      
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          wordCount: this.countWords(data.text),
          charCount: data.text.length,
        },
      }
    } catch (error) {
      logger.error('PDF parsing error:', error)
      throw new AppError('Failed to parse PDF document', 500, 'PDF_PARSE_ERROR')
    }
  }

  private async extractFromWord(buffer: Buffer): Promise<ExtractedContent> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      const text = result.value
      
      if (result.messages.length > 0) {
        logger.warn('Word document parsing warnings:', result.messages)
      }
      
      return {
        text,
        metadata: {
          wordCount: this.countWords(text),
          charCount: text.length,
        },
      }
    } catch (error) {
      logger.error('Word document parsing error:', error)
      throw new AppError('Failed to parse Word document', 500, 'WORD_PARSE_ERROR')
    }
  }

  private async extractFromText(buffer: Buffer): Promise<ExtractedContent> {
    const text = buffer.toString('utf-8')
    
    return {
      text,
      metadata: {
        wordCount: this.countWords(text),
        charCount: text.length,
      },
    }
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  chunkDocument(text: string, chunkSize: number = 1000, overlapSize: number = 200): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ''
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      
      if (currentChunk.length + trimmedSentence.length <= chunkSize) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + '.')
        }
        
        // Handle overlap
        if (chunks.length > 0 && overlapSize > 0) {
          const lastChunk = chunks[chunks.length - 1]
          const overlapWords = lastChunk.split(' ').slice(-Math.floor(overlapSize / 10))
          currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence
        } else {
          currentChunk = trimmedSentence
        }
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk + '.')
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0)
  }

  extractKeywords(text: string, limit: number = 20): string[] {
    // Simple keyword extraction - in production, you'd use more sophisticated NLP
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const wordFreq: Record<string, number> = {}
    
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
    
    // Filter out common stop words
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above',
      'this', 'that', 'these', 'those', 'will', 'shall', 'may', 'can', 'must',
      'have', 'has', 'had', 'been', 'being', 'are', 'was', 'were', 'is', 'am',
    ])
    
    return Object.entries(wordFreq)
      .filter(([word]) => !stopWords.has(word))
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word)
  }

  detectLanguage(text: string): string {
    // Simple language detection - in production, you'd use a proper language detection library
    const sampleText = text.slice(0, 1000).toLowerCase()
    
    // Check for common English words
    const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'is', 'it', 'you', 'that']
    const englishCount = englishWords.reduce((count, word) => {
      return count + (sampleText.split(word).length - 1)
    }, 0)
    
    // Basic heuristic - in production, use proper language detection
    if (englishCount > 10) {
      return 'en'
    }
    
    return 'unknown'
  }
}

export default DocumentProcessor