export interface ApiError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

export const createApiError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): ApiError => {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  error.code = code
  error.details = details
  return error
}

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.statusCode === 'number'
}

export const handleApiError = (error: ApiError | Error): string => {
  if (isApiError(error)) {
    return error.message || 'An API error occurred'
  }
  return error.message || 'An unexpected error occurred'
}