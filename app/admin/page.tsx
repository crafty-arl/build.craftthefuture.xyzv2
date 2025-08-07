"use client"

import { useState } from 'react'
import { Settings, Upload, Users, BarChart3, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolImport } from '@/components/admin/tool-import'
import { Tool } from '@/lib/types/tool'
import { ToolManager } from '@/lib/utils/toolManager'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('import')
  const [importedTools, setImportedTools] = useState<Tool[]>([])
  const [stats, setStats] = useState({
    totalTools: 0,
    activeTools: 0,
    totalBugs: 0,
    averageDifficulty: 'S-0'
  })

  const handleToolsImported = (tools: Tool[]) => {
    setImportedTools(prev => [...prev, ...tools])
    
    // Update stats
    const totalBugs = tools.reduce((sum, tool) => sum + tool.bugs.length, 0)
    const activeTools = tools.filter(tool => tool.isActive).length
    
    setStats({
      totalTools: importedTools.length + tools.length,
      activeTools: activeTools,
      totalBugs: totalBugs,
      averageDifficulty: 'S-0' // You can calculate this based on your logic
    })
  }

  const handleExportCurrentTools = () => {
    if (importedTools.length === 0) return
    
    const exportData = ToolManager.exportTools(importedTools, {
      id: 0,
      name: 'Season 0',
      description: 'Current season tools',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      isActive: true,
      tools: importedTools
    })

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `season-0-tools-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'import', label: 'Import Tools', icon: Upload },
    { id: 'manage', label: 'Manage Tools', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your Season 0 platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Admin</Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTools}</div>
              <p className="text-xs text-muted-foreground">
                +{importedTools.length} this session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTools}</div>
              <p className="text-xs text-muted-foreground">
                Currently available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBugs}</div>
              <p className="text-xs text-muted-foreground">
                Across all tools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Difficulty</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageDifficulty}</div>
              <p className="text-xs text-muted-foreground">
                Season 0 level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'import' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Import Tools</h2>
                {importedTools.length > 0 && (
                  <Button onClick={handleExportCurrentTools} variant="outline">
                    Export Current Tools
                  </Button>
                )}
              </div>
              <ToolImport onToolsImported={handleToolsImported} />
            </div>
          )}

          {activeTab === 'manage' && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Tools</CardTitle>
                <CardDescription>
                  View and manage all imported tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                {importedTools.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tools imported yet. Use the Import tab to add tools.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {importedTools.map((tool) => (
                      <div key={tool.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{tool.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{tool.difficulty}</Badge>
                              <Badge variant="outline">{tool.category}</Badge>
                              <Badge variant="outline">{tool.bugs.length} bugs</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Platform usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage platform users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  User management coming soon...
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Security settings coming soon...
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 