import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { FileUpload, FileItem } from '@/components/ui/file-upload'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Filter, Download, Eye, MessageSquare, BarChart3, Trash2 } from 'lucide-react'

const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])

  const mockDocuments = [
    {
      id: 1,
      name: "Employment Agreement 2024",
      type: "Contract",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "processed",
      riskLevel: "low",
      pages: 12,
      confidence: 98
    },
    {
      id: 2,
      name: "Software License Terms",
      type: "License", 
      size: "1.8 MB",
      uploadDate: "2024-01-14",
      status: "processing",
      riskLevel: "medium",
      pages: 8,
      confidence: 85
    },
    {
      id: 3,
      name: "Property Lease Agreement",
      type: "Lease",
      size: "3.1 MB",
      uploadDate: "2024-01-13",
      status: "processed",
      riskLevel: "high",
      pages: 15,
      confidence: 92
    },
    {
      id: 4,
      name: "NDA Template 2024",
      type: "NDA",
      size: "1.2 MB",
      uploadDate: "2024-01-12",
      status: "processed",
      riskLevel: "low",
      pages: 5,
      confidence: 96
    }
  ]

  const handleFilesChange = (files: FileItem[]) => {
    setUploadedFiles(files)
  }

  const handleUpload = async (files: FileItem[]) => {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Files uploaded:', files)
    setUploadDialogOpen(false)
    setUploadedFiles([])
  }

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
                         doc.status === selectedFilter ||
                         doc.riskLevel === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage and analyze your legal documents with AI</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="legal" className="sm:w-auto">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Legal Documents</DialogTitle>
              <DialogDescription>
                Upload PDF, DOC, DOCX, or TXT files for AI-powered legal analysis
              </DialogDescription>
            </DialogHeader>
            <FileUpload
              onFilesChange={handleFilesChange}
              onUpload={handleUpload}
              maxFiles={5}
              className="mt-4"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'processed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('processed')}
              >
                Processed
              </Button>
              <Button
                variant={selectedFilter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('processing')}
              >
                Processing
              </Button>
              <Button
                variant={selectedFilter === 'high' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('high')}
              >
                High Risk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg group-hover:text-legal-blue transition-colors">
                    {doc.name}
                  </CardTitle>
                  <CardDescription>{doc.type} • {doc.pages} pages • {doc.size}</CardDescription>
                </div>
                <Badge 
                  variant={doc.riskLevel === 'low' ? 'success' : doc.riskLevel === 'medium' ? 'warning' : 'destructive'}
                >
                  {doc.riskLevel} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-2">
                      {doc.status === 'processing' && <LoadingSpinner size="sm" />}
                      <Badge variant={doc.status === 'processed' ? 'success' : 'info'}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium">{doc.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Upload Card */}
        <Card className="border-dashed border-2 hover:border-legal-blue transition-colors group cursor-pointer"
              onClick={() => setUploadDialogOpen(true)}>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-legal-blue/20 transition-colors">
              <svg className="w-6 h-6 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Upload New Document</h3>
            <p className="text-sm text-muted-foreground mb-4">Click to upload legal documents for AI analysis</p>
            <Button variant="legal" size="sm">
              Choose Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {filteredDocuments.length === 0 && searchQuery && (
        <Alert>
          <AlertDescription>
            No documents found matching "{searchQuery}". Try adjusting your search terms or filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

const DocumentViewerPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Documents
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employment Agreement 2024.pdf</CardTitle>
                  <CardDescription>Contract • 2.4 MB • Uploaded Jan 15, 2024</CardDescription>
                </div>
                <Badge variant="success">Processed</Badge>
              </div>
            </CardHeader>
            <CardContent className="h-[500px] bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Document Viewer</h3>
                  <p className="text-muted-foreground">PDF viewer will be integrated here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Level</span>
                  <Badge variant="success">Low</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance</span>
                  <Badge variant="success">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Key Clauses</span>
                  <span className="text-sm">12 identified</span>
                </div>
              </div>
              <Button variant="legal" className="w-full">
                View Full Analysis
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Chat Session
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Compare Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const ChatPage: React.FC = () => {
  const mockMessages = [
    {
      id: 1,
      type: 'assistant' as const,
      content: 'Hello! I\'m here to help you analyze your legal documents. What would you like to know?',
      timestamp: '10:30 AM'
    },
    {
      id: 2, 
      type: 'user' as const,
      content: 'Can you summarize the key terms in my employment agreement?',
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      type: 'assistant' as const,
      content: 'Based on your employment agreement, here are the key terms:\n\n1. **Position**: Software Engineer\n2. **Salary**: $95,000 annually\n3. **Benefits**: Health insurance, 401k, 15 days PTO\n4. **Termination**: 2 weeks notice required\n5. **Non-compete**: 6 months in same industry\n\nWould you like me to elaborate on any of these points?',
      timestamp: '10:33 AM'
    }
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Chat Assistant</h1>
          <p className="text-muted-foreground">Ask questions about your legal documents</p>
        </div>
        <Button variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat History Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Recent Chats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Employment Agreement Analysis',
                'Lease Contract Questions', 
                'Software License Review',
                'Property Purchase Terms'
              ].map((chat, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start text-left h-auto p-3">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{chat}</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 space-y-2 ${
                      message.type === 'user' 
                        ? 'bg-legal-blue text-white' 
                        : 'bg-muted'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs opacity-70`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Ask a question about your documents..."
                    className="flex-1"
                  />
                  <Button variant="legal">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>3 documents available</span>
                  </div>
                  <span>•</span>
                  <span>AI assistant ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const ComparisonPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Comparison</h1>
          <p className="text-muted-foreground">Compare two documents to identify differences and similarities</p>
        </div>
        <Button variant="legal">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Comparison
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Documents to Compare</CardTitle>
            <CardDescription>Choose two documents for side-by-side comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">First Document</label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-legal-blue transition-colors">
                <div className="w-10 h-10 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Employment Agreement 2024.pdf</p>
                <p className="text-xs text-muted-foreground">Selected</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Second Document</label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-legal-blue transition-colors">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Click to select second document</p>
              </div>
            </div>

            <Button variant="legal" className="w-full" disabled>
              Start Comparison
            </Button>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>Key differences and similarities will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">No Comparison Yet</h3>
                <p className="text-muted-foreground">Select two documents to start comparing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Comparisons</CardTitle>
          <CardDescription>Your previous document comparisons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                doc1: 'Employment Agreement v1.pdf',
                doc2: 'Employment Agreement v2.pdf', 
                changes: 12,
                date: '2024-01-15',
                status: 'completed'
              },
              {
                id: 2,
                doc1: 'Lease Contract.pdf',
                doc2: 'Updated Lease.pdf',
                changes: 8,
                date: '2024-01-14', 
                status: 'completed'
              }
            ].map((comparison) => (
              <div key={comparison.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="font-medium">
                    {comparison.doc1} vs {comparison.doc2}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {comparison.changes} changes found • {comparison.date}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">{comparison.status}</Badge>
                  <Button variant="ghost" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const AnalyticsPage: React.FC = () => {
  const analyticsData = [
    { label: 'Documents Processed', value: 247, change: '+12%', trend: 'up' },
    { label: 'Average Processing Time', value: '2.3min', change: '-15%', trend: 'down' },
    { label: 'Risk Issues Found', value: 34, change: '+8%', trend: 'up' },
    { label: 'Compliance Score', value: '94%', change: '+3%', trend: 'up' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your document analysis performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1">
                    <svg className={`w-4 h-4 ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={metric.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                    </svg>
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>{metric.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Document Processing Trend</CardTitle>
            <CardDescription>Monthly document analysis volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Analytics Chart</p>
                <p className="text-xs text-muted-foreground">Chart visualization will be integrated here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Document Types */}
        <Card>
          <CardHeader>
            <CardTitle>Document Type Distribution</CardTitle>
            <CardDescription>Most frequently analyzed document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Employment Contracts', count: 89, percentage: 36 },
                { type: 'Lease Agreements', count: 67, percentage: 27 },
                { type: 'Software Licenses', count: 45, percentage: 18 },
                { type: 'Purchase Orders', count: 34, percentage: 14 },
                { type: 'Other', count: 12, percentage: 5 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-muted-foreground">{item.count} docs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-legal-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analysis Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Reports</CardTitle>
          <CardDescription>Latest AI-generated document insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                document: 'Employment Agreement 2024.pdf',
                type: 'Risk Analysis',
                score: 85,
                issues: 2,
                date: '2 hours ago'
              },
              {
                id: 2,
                document: 'Software License Terms.pdf', 
                type: 'Compliance Check',
                score: 92,
                issues: 1,
                date: '5 hours ago'
              },
              {
                id: 3,
                document: 'Property Lease.pdf',
                type: 'Risk Analysis', 
                score: 76,
                issues: 4,
                date: '1 day ago'
              }
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="font-medium">{report.document}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.type} • Score: {report.score}/100 • {report.issues} issues found
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={report.score >= 90 ? 'success' : report.score >= 80 ? 'warning' : 'destructive'}>
                    {report.score >= 90 ? 'Excellent' : report.score >= 80 ? 'Good' : 'Needs Review'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{report.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {[
                  { name: 'Profile', icon: '👤', active: true },
                  { name: 'Preferences', icon: '⚙️', active: false },
                  { name: 'Security', icon: '🔒', active: false },
                  { name: 'Billing', icon: '💳', active: false },
                  { name: 'API Keys', icon: '🔑', active: false },
                  { name: 'Notifications', icon: '🔔', active: false }
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant={item.active ? 'secondary' : 'ghost'}
                    className="w-full justify-start p-4 h-auto"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-legal-gold to-legal-gold-foreground rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-legal-gold-foreground">U</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">user@example.com</h3>
                  <p className="text-sm text-muted-foreground">Legal Professional</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Input placeholder="Enter organization" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input placeholder="Enter role" />
                </div>
              </div>
              
              <Button variant="legal">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Preferences</CardTitle>
              <CardDescription>Customize how AI analyzes your documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Detailed Risk Analysis</div>
                    <div className="text-sm text-muted-foreground">Include comprehensive risk assessment in all analyses</div>
                  </div>
                  <div className="w-11 h-6 bg-legal-blue rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-all"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Auto-summarization</div>
                    <div className="text-sm text-muted-foreground">Automatically generate document summaries</div>
                  </div>
                  <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-all"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Compliance Checking</div>
                    <div className="text-sm text-muted-foreground">Check documents against compliance requirements</div>
                  </div>
                  <div className="w-11 h-6 bg-legal-blue rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-all"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your current plan and usage metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-legal-gold/10 rounded-lg">
                <div>
                  <div className="font-semibold">Professional Plan</div>
                  <div className="text-sm text-muted-foreground">1000 documents per month</div>
                </div>
                <Badge variant="gold">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-legal-blue">247</div>
                  <div className="text-sm text-muted-foreground">Documents this month</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-legal-blue">753</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const WorkspacesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workspaces</h1>
          <p className="text-muted-foreground">Organize your documents and collaborate with your team</p>
        </div>
        <Button variant="legal">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'Personal Legal Documents',
            description: 'My personal contracts and agreements',
            documentsCount: 15,
            membersCount: 1,
            lastActivity: '2 hours ago',
            color: 'legal-blue'
          },
          {
            id: 2,
            name: 'Corporate Contracts',
            description: 'Company-wide legal documentation',
            documentsCount: 89,
            membersCount: 5,
            lastActivity: '1 day ago',
            color: 'legal-navy'
          },
          {
            id: 3,
            name: 'Real Estate Deals',
            description: 'Property purchase and lease agreements',
            documentsCount: 23,
            membersCount: 3,
            lastActivity: '3 days ago',
            color: 'legal-gold'
          }
        ].map((workspace) => (
          <Card key={workspace.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="group-hover:text-legal-blue transition-colors">
                    {workspace.name}
                  </CardTitle>
                  <CardDescription>{workspace.description}</CardDescription>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  workspace.color === 'legal-blue' ? 'bg-legal-blue' :
                  workspace.color === 'legal-navy' ? 'bg-legal-navy' :
                  workspace.color === 'legal-gold' ? 'bg-legal-gold' :
                  'bg-muted'
                }`}></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Documents</div>
                    <div className="font-medium">{workspace.documentsCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Members</div>
                    <div className="font-medium">{workspace.membersCount}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last activity: {workspace.lastActivity}</span>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Open
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Create new workspace card */}
        <Card className="border-dashed border-2 hover:border-legal-blue transition-colors group">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-legal-blue/20 transition-colors">
              <svg className="w-6 h-6 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Create New Workspace</h3>
            <p className="text-sm text-muted-foreground mb-4">Organize documents by project or team</p>
            <Button variant="legal" size="sm">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Collaboration */}
      <Card>
        <CardHeader>
          <CardTitle>Team Collaboration</CardTitle>
          <CardDescription>Recent activity across all workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                user: 'John Smith',
                action: 'uploaded',
                document: 'Service Agreement.pdf',
                workspace: 'Corporate Contracts',
                time: '2 hours ago'
              },
              {
                id: 2,
                user: 'Sarah Johnson',
                action: 'analyzed',
                document: 'Property Deed.pdf',
                workspace: 'Real Estate Deals',
                time: '5 hours ago'
              },
              {
                id: 3,
                user: 'Mike Wilson',
                action: 'shared',
                document: 'Employment Contract.pdf',
                workspace: 'Corporate Contracts',
                time: '1 day ago'
              }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-legal-blue to-legal-navy rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{activity.user[0]}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium">{activity.document}</span>
                    <span className="text-muted-foreground"> in </span>
                    <span className="font-medium">{activity.workspace}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-legal-blue/5 to-legal-navy/10">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-legal-blue/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-legal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-6xl font-bold text-legal-blue mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">The legal document you're looking for seems to have gone missing. Let's get you back on track.</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button variant="legal" className="w-full" asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/documents">Browse Documents</a>
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  )
}

export { 
  DocumentsPage,
  DocumentViewerPage,
  ChatPage,
  ComparisonPage,
  AnalyticsPage,
  SettingsPage,
  WorkspacesPage,
  NotFoundPage
}