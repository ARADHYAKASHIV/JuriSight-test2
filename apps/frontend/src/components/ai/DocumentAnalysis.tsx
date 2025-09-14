import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useDocumentAnalysis from '@/hooks/useDocumentAnalysis'
import { Eye, Download, BarChart3, Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react'

// Simple LoadingSpinner component
const LoadingSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-legal-blue border-t-transparent ${sizeClasses[size]}`} />
  )
}

interface DocumentAnalysisProps {
  documentId: string
  className?: string
}

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ documentId, className = '' }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const {
    document,
    analysis,
    isLoading,
    isAnalyzing,
    analyzeDocument,
    downloadDocument,
    refreshDocument,
    isDownloading,
  } = useDocumentAnalysis({ documentId })

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'success'
    if (confidence >= 0.6) return 'warning'
    return 'destructive'
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <div className="text-muted-foreground">Loading document...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!document) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="text-muted-foreground">Document not found</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Document Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{document.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{document.originalName}</span>
                <span>•</span>
                <span>{document.mimeType}</span>
                <span>•</span>
                <span>Uploaded {new Date(document.createdAt).toLocaleDateString()}</span>
              </div>
              {document.category && (
                <Badge variant="outline" className="w-fit">
                  {document.category}
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadDocument}
                disabled={isDownloading}
              >
                {isDownloading ? <LoadingSpinner size="xs" /> : <Download className="w-4 h-4" />}
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDocument}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-legal-blue" />
              <span>AI Analysis</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {analysis && (
                <>
                  <Badge 
                    variant={getConfidenceBadge(analysis.confidence)}
                    className="text-xs"
                  >
                    {Math.round(analysis.confidence * 100)}% Confidence
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {analysis.processingTime}ms
                  </div>
                </>
              )}
              <Button
                variant={analysis ? "outline" : "default"}
                size="sm"
                onClick={analyzeDocument}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="xs" />
                    <span className="ml-2">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {analysis ? 'Re-analyze' : 'Analyze Document'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!analysis && !isAnalyzing ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-legal-blue/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-legal-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ready for AI Analysis</h3>
                <p className="text-muted-foreground">
                  Click "Analyze Document" to get AI-powered insights including summary, key points, and entity extraction.
                </p>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="text-center py-8 space-y-4">
              <LoadingSpinner size="lg" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Analyzing Document</h3>
                <p className="text-muted-foreground">
                  Our AI is reading and analyzing your document. This may take a few moments.
                </p>
              </div>
            </div>
          ) : analysis && (
            <div className="space-y-6">
              {/* Summary Section */}
              <div>
                <button
                  onClick={() => toggleSection('summary')}
                  className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Summary
                  </h3>
                  <span className="text-muted-foreground">
                    {expandedSection === 'summary' ? '−' : '+'}
                  </span>
                </button>
                {(expandedSection === 'summary' || !expandedSection) && (
                  <div className="pl-6 pr-3 pb-3">
                    <p className="text-sm leading-relaxed">{analysis.summary}</p>
                  </div>
                )}
              </div>

              {/* Key Points Section */}
              {analysis.keyPoints && analysis.keyPoints.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('keyPoints')}
                    className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Key Points ({analysis.keyPoints.length})
                    </h3>
                    <span className="text-muted-foreground">
                      {expandedSection === 'keyPoints' ? '−' : '+'}
                    </span>
                  </button>
                  {(expandedSection === 'keyPoints' || !expandedSection) && (
                    <div className="pl-6 pr-3 pb-3">
                      <ul className="space-y-2">
                        {analysis.keyPoints.map((point, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-legal-blue mr-2 mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Entities Section */}
              {analysis.entities && analysis.entities.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('entities')}
                    className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Named Entities ({analysis.entities.length})
                    </h3>
                    <span className="text-muted-foreground">
                      {expandedSection === 'entities' ? '−' : '+'}
                    </span>
                  </button>
                  {(expandedSection === 'entities' || !expandedSection) && (
                    <div className="pl-6 pr-3 pb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analysis.entities.map((entity, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 space-y-2"
                          >
                            <div className="font-medium text-sm">{entity.text}</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {entity.type}
                              </Badge>
                              <span className={`text-xs font-medium ${getConfidenceColor(entity.confidence)}`}>
                                {Math.round(entity.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">
                      {Math.round(analysis.confidence * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">
                      {analysis.keyPoints?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Key Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">
                      {analysis.entities?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Entities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">
                      {analysis.processingTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Processing</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentAnalysis