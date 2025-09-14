import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Icons
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: "Documents Processed",
      value: "247",
      change: "+12%",
      changeType: "positive" as const,
      icon: DocumentIcon,
      description: "Total documents analyzed"
    },
    {
      title: "Chat Sessions", 
      value: "89",
      change: "+23%",
      changeType: "positive" as const,
      icon: ChatIcon,
      description: "Active AI conversations"
    },
    {
      title: "Analysis Reports",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: AnalyticsIcon,
      description: "Generated insights"
    },
    {
      title: "Comparisons",
      value: "34",
      change: "+15%",
      changeType: "positive" as const,
      icon: CompareIcon,
      description: "Document comparisons"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "document",
      title: "Contract Analysis Complete",
      description: "Employment_Agreement_2024.pdf",
      time: "2 minutes ago",
      status: "completed"
    },
    {
      id: 2,
      type: "chat",
      title: "New Chat Session Started",
      description: "Discussion about liability clauses",
      time: "15 minutes ago",
      status: "active"
    },
    {
      id: 3,
      type: "comparison",
      title: "Document Comparison",
      description: "Comparing 2 lease agreements", 
      time: "1 hour ago",
      status: "completed"
    },
    {
      id: 4,
      type: "analysis",
      title: "Risk Assessment Generated",
      description: "High-risk clauses identified in contract",
      time: "2 hours ago",
      status: "completed"
    }
  ]

  const quickActions = [
    {
      title: "Upload Document",
      description: "Analyze a new legal document",
      href: "/documents",
      icon: DocumentIcon,
      color: "legal" as const
    },
    {
      title: "Start Chat",
      description: "Ask questions about your documents",
      href: "/chat",
      icon: ChatIcon,
      color: "default" as const
    },
    {
      title: "Compare Documents",
      description: "Find differences between documents",
      href: "/comparison",
      icon: CompareIcon,
      color: "secondary" as const
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          Welcome to JuriSight
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered legal document analysis and insights platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center space-x-1">
                    <TrendUpIcon />
                    <Badge variant="success" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant={action.color}
                    className="w-full justify-start h-auto p-4 text-left"
                    asChild
                  >
                    <a href={action.href}>
                      <div className="flex items-start space-x-3">
                        <Icon />
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs opacity-90">{action.description}</div>
                        </div>
                        <PlusIcon />
                      </div>
                    </a>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest document analysis and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {activity.type === 'document' && <DocumentIcon />}
                      {activity.type === 'chat' && <ChatIcon />}
                      {activity.type === 'comparison' && <CompareIcon />}
                      {activity.type === 'analysis' && <AnalyticsIcon />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        <Badge 
                          variant={activity.status === 'completed' ? 'success' : 'info'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <ClockIcon />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Highlights */}
      <Card className="bg-gradient-to-r from-legal-blue/5 to-legal-navy/5 border-legal-blue/20">
        <CardHeader>
          <CardTitle className="text-legal-blue">AI-Powered Legal Analysis</CardTitle>
          <CardDescription>
            Leverage advanced AI to streamline your legal document workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto">
                <DocumentIcon />
              </div>
              <h3 className="font-semibold">Smart Document Processing</h3>
              <p className="text-sm text-muted-foreground">
                Extract key information and insights from legal documents automatically
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto">
                <ChatIcon />
              </div>
              <h3 className="font-semibold">Interactive Q&A</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your documents and get instant AI-powered answers
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-legal-blue/10 rounded-lg flex items-center justify-center mx-auto">
                <AnalyticsIcon />
              </div>
              <h3 className="font-semibold">Risk Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Identify potential risks and compliance issues in your legal documents
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage