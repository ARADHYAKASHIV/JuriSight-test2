import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'

export interface AIAnalysisResult {
  summary: string
  keyPoints: string[]
  entities: Array<{
    text: string
    type: string
    confidence: number
  }>
  confidence: number
  processingTime: number
}

export interface EmbeddingResult {
  embedding: number[]
  model: string
  usage: {
    promptTokens: number
    totalTokens: number
  }
}

export class AIService {
  private gemini: GoogleGenerativeAI | null = null
  private openai: OpenAI | null = null

  constructor() {
    // Initialize Gemini
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }

    // Initialize OpenAI as fallback
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }

    if (!this.gemini && !this.openai) {
      logger.warn('No AI service API keys configured')
    }
  }

  async analyzeDocument(content: string, filename: string): Promise<AIAnalysisResult> {
    const startTime = Date.now()
    
    try {
      // Try Gemini first, fallback to OpenAI
      if (this.gemini) {
        return await this.analyzeWithGemini(content, filename, startTime)
      } else if (this.openai) {
        return await this.analyzeWithOpenAI(content, filename, startTime)
      } else {
        throw new AppError('No AI service available', 503, 'AI_SERVICE_UNAVAILABLE')
      }
    } catch (error) {
      logger.error('AI analysis failed:', error)
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError('Failed to analyze document', 500, 'AI_ANALYSIS_ERROR')
    }
  }

  private async analyzeWithGemini(content: string, filename: string, startTime: number): Promise<AIAnalysisResult> {
    try {
      const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Analyze the following legal document and provide:
        1. A concise summary (2-3 sentences)
        2. Key points (5-7 main points)
        3. Named entities (people, organizations, dates, amounts)
        
        Document: ${filename}
        Content: ${content.substring(0, 8000)} ${content.length > 8000 ? '...' : ''}
        
        Respond in JSON format:
        {
          "summary": "...",
          "keyPoints": ["...", "..."],
          "entities": [{"text": "...", "type": "...", "confidence": 0.95}]
        }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        const analysis = JSON.parse(text)
        
        return {
          summary: analysis.summary || 'Summary not available',
          keyPoints: analysis.keyPoints || [],
          entities: analysis.entities || [],
          confidence: 0.85,
          processingTime: Date.now() - startTime,
        }
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          summary: text.substring(0, 500),
          keyPoints: [],
          entities: [],
          confidence: 0.6,
          processingTime: Date.now() - startTime,
        }
      }
    } catch (error) {
      logger.error('Gemini analysis error:', error)
      throw new AppError('Gemini analysis failed', 500, 'GEMINI_ERROR')
    }
  }

  private async analyzeWithOpenAI(content: string, filename: string, startTime: number): Promise<AIAnalysisResult> {
    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document analysis assistant. Analyze documents and provide structured summaries.',
          },
          {
            role: 'user',
            content: `
              Analyze this legal document and provide:
              1. A concise summary (2-3 sentences)
              2. Key points (5-7 main points)
              3. Named entities (people, organizations, dates, amounts)
              
              Document: ${filename}
              Content: ${content.substring(0, 6000)} ${content.length > 6000 ? '...' : ''}
              
              Respond in JSON format:
              {
                "summary": "...",
                "keyPoints": ["...", "..."],
                "entities": [{"text": "...", "type": "...", "confidence": 0.95}]
              }
            `,
          },
        ],
        max_tokens: 1500,
        temperature: 0.3,
      })

      const text = response.choices[0]?.message?.content || ''
      
      try {
        const analysis = JSON.parse(text)
        
        return {
          summary: analysis.summary || 'Summary not available',
          keyPoints: analysis.keyPoints || [],
          entities: analysis.entities || [],
          confidence: 0.8,
          processingTime: Date.now() - startTime,
        }
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          summary: text.substring(0, 500),
          keyPoints: [],
          entities: [],
          confidence: 0.6,
          processingTime: Date.now() - startTime,
        }
      }
    } catch (error) {
      logger.error('OpenAI analysis error:', error)
      throw new AppError('OpenAI analysis failed', 500, 'OPENAI_ERROR')
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (this.openai) {
        return await this.generateOpenAIEmbedding(text)
      } else {
        throw new AppError('No embedding service available', 503, 'EMBEDDING_SERVICE_UNAVAILABLE')
      }
    } catch (error) {
      logger.error('Embedding generation failed:', error)
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError('Failed to generate embedding', 500, 'EMBEDDING_ERROR')
    }
  }

  private async generateOpenAIEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const response = await this.openai!.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text.substring(0, 8000), // Limit input size
      })

      const embedding = response.data[0]?.embedding
      
      if (!embedding) {
        throw new Error('No embedding returned')
      }

      return {
        embedding,
        model: 'text-embedding-ada-002',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      }
    } catch (error) {
      logger.error('OpenAI embedding error:', error)
      throw new AppError('OpenAI embedding failed', 500, 'OPENAI_EMBEDDING_ERROR')
    }
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    try {
      if (this.gemini) {
        return await this.answerWithGemini(question, context)
      } else if (this.openai) {
        return await this.answerWithOpenAI(question, context)
      } else {
        throw new AppError('No AI service available', 503, 'AI_SERVICE_UNAVAILABLE')
      }
    } catch (error) {
      logger.error('Question answering failed:', error)
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError('Failed to answer question', 500, 'QUESTION_ANSWERING_ERROR')
    }
  }

  private async answerWithGemini(question: string, context: string): Promise<string> {
    try {
      const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Based on the following document context, answer the user's question. 
        If the answer cannot be found in the context, say so clearly.
        
        Context: ${context}
        
        Question: ${question}
        
        Answer:
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      logger.error('Gemini question answering error:', error)
      throw new AppError('Gemini question answering failed', 500, 'GEMINI_QA_ERROR')
    }
  }

  private async answerWithOpenAI(question: string, context: string): Promise<string> {
    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on provided document context. If the answer cannot be found in the context, clearly state that.',
          },
          {
            role: 'user',
            content: `
              Context: ${context}
              
              Question: ${question}
            `,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      })

      return response.choices[0]?.message?.content || 'I could not generate an answer to your question.'
    } catch (error) {
      logger.error('OpenAI question answering error:', error)
      throw new AppError('OpenAI question answering failed', 500, 'OPENAI_QA_ERROR')
    }
  }

  async compareDocuments(doc1Content: string, doc2Content: string): Promise<any> {
    try {
      if (this.gemini) {
        return await this.compareWithGemini(doc1Content, doc2Content)
      } else if (this.openai) {
        return await this.compareWithOpenAI(doc1Content, doc2Content)
      } else {
        throw new AppError('No AI service available', 503, 'AI_SERVICE_UNAVAILABLE')
      }
    } catch (error) {
      logger.error('Document comparison failed:', error)
      
      if (error instanceof AppError) {
        throw error
      }
      
      throw new AppError('Failed to compare documents', 500, 'DOCUMENT_COMPARISON_ERROR')
    }
  }

  private async compareWithGemini(doc1Content: string, doc2Content: string): Promise<any> {
    try {
      const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Compare these two legal documents and provide:
        1. Overall similarity score (0-1)
        2. Key differences
        3. Common clauses
        4. Notable changes
        
        Document 1: ${doc1Content.substring(0, 4000)}
        Document 2: ${doc2Content.substring(0, 4000)}
        
        Respond in JSON format:
        {
          "similarityScore": 0.85,
          "differences": ["...", "..."],
          "commonClauses": ["...", "..."],
          "changes": ["...", "..."]
        }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        return JSON.parse(text)
      } catch (parseError) {
        return {
          similarityScore: 0.5,
          differences: ['Analysis could not be completed'],
          commonClauses: [],
          changes: [],
        }
      }
    } catch (error) {
      logger.error('Gemini comparison error:', error)
      throw new AppError('Gemini comparison failed', 500, 'GEMINI_COMPARISON_ERROR')
    }
  }

  private async compareWithOpenAI(doc1Content: string, doc2Content: string): Promise<any> {
    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document comparison assistant. Compare documents and provide structured analysis.',
          },
          {
            role: 'user',
            content: `
              Compare these two legal documents and provide:
              1. Overall similarity score (0-1)
              2. Key differences
              3. Common clauses
              4. Notable changes
              
              Document 1: ${doc1Content.substring(0, 3000)}
              Document 2: ${doc2Content.substring(0, 3000)}
              
              Respond in JSON format:
              {
                "similarityScore": 0.85,
                "differences": ["...", "..."],
                "commonClauses": ["...", "..."],
                "changes": ["...", "..."]
              }
            `,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      })

      const text = response.choices[0]?.message?.content || ''
      
      try {
        return JSON.parse(text)
      } catch (parseError) {
        return {
          similarityScore: 0.5,
          differences: ['Analysis could not be completed'],
          commonClauses: [],
          changes: [],
        }
      }
    } catch (error) {
      logger.error('OpenAI comparison error:', error)
      throw new AppError('OpenAI comparison failed', 500, 'OPENAI_COMPARISON_ERROR')
    }
  }
}

export default AIService