import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'

export interface StorageResult {
  filename: string
  path: string
  hash: string
  size: number
}

export interface DownloadResult {
  buffer: Buffer
  mimeType: string
  filename: string
}

export class StorageService {
  private uploadPath: string

  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || './uploads'
    this.ensureUploadDirectory()
  }

  private async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadPath)
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true })
      logger.info(`Created upload directory: ${this.uploadPath}`)
    }
  }

  private generateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  private generateFilename(originalName: string, hash: string): string {
    const ext = path.extname(originalName)
    const timestamp = Date.now()
    return `${hash.substring(0, 16)}_${timestamp}${ext}`
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StorageResult> {
    try {
      const hash = this.generateHash(buffer)
      const filename = this.generateFilename(originalName, hash)
      const filePath = path.join(this.uploadPath, filename)

      // Check if file with same hash already exists
      const existingFiles = await fs.readdir(this.uploadPath)
      const existingFile = existingFiles.find(file => file.startsWith(hash.substring(0, 16)))
      
      if (existingFile) {
        logger.info(`File already exists with hash: ${hash}`)
        return {
          filename: existingFile,
          path: path.join(this.uploadPath, existingFile),
          hash,
          size: buffer.length,
        }
      }

      await fs.writeFile(filePath, buffer)
      
      logger.info(`File saved: ${filename}`)
      
      return {
        filename,
        path: filePath,
        hash,
        size: buffer.length,
      }
    } catch (error) {
      logger.error('Error saving file:', error)
      throw new AppError('Failed to save file', 500, 'FILE_SAVE_ERROR')
    }
  }

  async getFile(filename: string): Promise<DownloadResult> {
    try {
      const filePath = path.join(this.uploadPath, filename)
      
      // Check if file exists
      await fs.access(filePath)
      
      const buffer = await fs.readFile(filePath)
      const ext = path.extname(filename).toLowerCase()
      
      // Determine MIME type based on extension
      const mimeTypes: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.rtf': 'application/rtf',
      }
      
      const mimeType = mimeTypes[ext] || 'application/octet-stream'
      
      return {
        buffer,
        mimeType,
        filename,
      }
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new AppError('File not found', 404, 'FILE_NOT_FOUND')
      }
      
      logger.error('Error retrieving file:', error)
      throw new AppError('Failed to retrieve file', 500, 'FILE_RETRIEVAL_ERROR')
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadPath, filename)
      await fs.unlink(filePath)
      logger.info(`File deleted: ${filename}`)
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        logger.warn(`File not found for deletion: ${filename}`)
        return
      }
      
      logger.error('Error deleting file:', error)
      throw new AppError('Failed to delete file', 500, 'FILE_DELETE_ERROR')
    }
  }

  async getFileStats(filename: string): Promise<{ size: number; createdAt: Date }> {
    try {
      const filePath = path.join(this.uploadPath, filename)
      const stats = await fs.stat(filePath)
      
      return {
        size: stats.size,
        createdAt: stats.birthtime,
      }
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new AppError('File not found', 404, 'FILE_NOT_FOUND')
      }
      
      logger.error('Error getting file stats:', error)
      throw new AppError('Failed to get file stats', 500, 'FILE_STATS_ERROR')
    }
  }

  async cleanup(): Promise<void> {
    try {
      // Clean up files older than 30 days that are not referenced in database
      const files = await fs.readdir(this.uploadPath)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      for (const filename of files) {
        try {
          const stats = await this.getFileStats(filename)
          if (stats.createdAt < thirtyDaysAgo) {
            // Here you would check if file is still referenced in database
            // For now, we'll skip cleanup to avoid data loss
            logger.info(`File eligible for cleanup: ${filename}`)
          }
        } catch (error) {
          // Skip files that can't be processed
          continue
        }
      }
    } catch (error) {
      logger.error('Error during cleanup:', error)
    }
  }
}

export default StorageService