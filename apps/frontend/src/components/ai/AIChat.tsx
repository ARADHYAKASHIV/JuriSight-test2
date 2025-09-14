import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useChat from '@/hooks/useChat'
import { ChatMessage as ChatMessageType, ChatMessageType as MessageType } from '@/shared'
import { Send, Plus, Trash2, Bot, User } from 'lucide-react'

// Simple ScrollArea component
const ScrollArea: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`overflow-y-auto ${className}`}>
    {children}
  </div>
)

// Simple Separator component
const Separator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <hr className={`border-t border-border ${className}`} />
)

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

interface AIchatProps {
  documentId: string
  documentTitle?: string
  sessionId?: string
  className?: string
}

interface ChatMessageProps {
  message: ChatMessageType
  isLast?: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast = false }) => {
  const isUser = message.type === MessageType.USER
  const isAssistant = message.type === MessageType.ASSISTANT

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${isLast ? 'mb-4' : 'mb-6'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-legal-blue/10 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-legal-blue" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-legal-blue text-white ml-auto' 
            : 'bg-muted border'
        }`}>
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
          
          {message.metadata?.timestamp && (
            <div className={`text-xs mt-2 ${
              isUser ? 'text-legal-blue-100' : 'text-muted-foreground'
            }`}>
              {new Date(message.metadata.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {/* Citations for AI responses */}
        {isAssistant && message.citations && message.citations.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-muted-foreground">Sources:</div>
            <div className="flex flex-wrap gap-1">
              {message.citations.map((citation, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-muted"
                  title={citation.text}
                >
                  Chunk {index + 1}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-legal-navy/10 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-legal-navy" />
        </div>
      )}
    </div>
  )
}

const AIChat: React.FC<AIchatProps> = ({ 
  documentId, 
  documentTitle, 
  sessionId: initialSessionId,
  className = "" 
}) => {
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    sessions,
    currentSession,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    isSendingMessage,
    createSession,
    sendMessage,
    switchSession,
    deleteSession,
    setCurrentSessionId,
    isCreatingSession,
    isDeletingSession,
  } = useChat({ 
    sessionId: initialSessionId, 
    documentId 
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Set initial session if provided
  useEffect(() => {
    if (initialSessionId && !currentSession) {
      setCurrentSessionId(initialSessionId)
    }
  }, [initialSessionId, currentSession, setCurrentSessionId])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSendingMessage) return

    const content = messageInput.trim()
    setMessageInput('')

    try {
      // Create session if none exists
      if (!currentSession) {
        await createSession(
          documentTitle ? `Chat about ${documentTitle}` : 'New Chat Session',
          documentId
        )
      }
      
      await sendMessage(content)
      inputRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore message input on error
      setMessageInput(content)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCreateNewSession = async () => {
    try {
      await createSession(
        documentTitle ? `Chat about ${documentTitle}` : 'New Chat Session',
        documentId
      )
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await deleteSession(sessionId)
      } catch (error) {
        console.error('Failed to delete session:', error)
      }
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex h-full">
        {/* Sessions Sidebar */}
        <Card className="w-80 mr-4 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Chat Sessions</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateNewSession}
                disabled={isCreatingSession}
              >
                {isCreatingSession ? (
                  <LoadingSpinner size="xs" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full px-6 pb-6">
              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No chat sessions yet. Start by asking a question!
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                        currentSession?.id === session.id
                          ? 'bg-legal-blue/10 border border-legal-blue/20'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => switchSession(session.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {session.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSession(session.id)
                          }}
                          disabled={isDeletingSession}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {currentSession?.title || 'AI Assistant'}
                </CardTitle>
                {documentTitle && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Analyzing: {documentTitle}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {messages.length} messages
                </Badge>
                {currentSession && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Connected" />
                )}
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-legal-blue/10 rounded-full flex items-center justify-center mx-auto">
                      <Bot className="w-8 h-8 text-legal-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Start a conversation</h3>
                      <p className="text-muted-foreground text-sm">
                        Ask questions about your document and I'll help you analyze it.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "What are the key terms?",
                        "Summarize this document",
                        "Find potential risks",
                        "Explain the main clauses"
                      ].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setMessageInput(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isLast={index === messages.length - 1}
                    />
                  ))}
                  {isSendingMessage && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-legal-blue/10 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-legal-blue" />
                      </div>
                      <div className="bg-muted border rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="xs" />
                          <span className="text-sm text-muted-foreground">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    currentSession 
                      ? "Ask a question about the document..." 
                      : "Start a new chat session..."
                  }
                  disabled={isSendingMessage}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSendingMessage}
                  size="icon"
                >
                  {isSendingMessage ? (
                    <LoadingSpinner size="xs" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>AI assistant ready</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AIChat