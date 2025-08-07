"use client"

import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolManager } from '@/lib/utils/toolManager'
import { Tool } from '@/lib/types/tool'

interface ToolImportProps {
  onToolsImported: (tools: Tool[]) => void;
}

export function ToolImport({ onToolsImported }: ToolImportProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewTools, setPreviewTools] = useState<Tool[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const jsonFile = files.find(file => file.name.endsWith('.json'))
    
    if (jsonFile) {
      handleFileUpload(jsonFile)
    } else {
      setError('Please upload a JSON file')
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setPreviewTools([])

    try {
      const tools = await ToolManager.validateJsonFile(file)
      setPreviewTools(tools)
      setSuccess(`Successfully loaded ${tools.length} tools`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleImport = () => {
    if (previewTools.length > 0) {
      onToolsImported(previewTools)
      setSuccess(`Imported ${previewTools.length} tools successfully!`)
      setPreviewTools([])
    }
  }

  const handleExportSample = () => {
    const sampleTool = ToolManager.generateSampleTool()
    const exportData = ToolManager.exportTools([sampleTool], {
      id: 0,
      name: 'Season 0',
      description: 'Sample season',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      isActive: true,
      tools: [sampleTool]
    })

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-tools.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Tools
          </CardTitle>
          <CardDescription>
            Upload a JSON file containing your tools. Drag and drop or click to select a file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragging ? 'Drop your JSON file here' : 'Drag and drop your JSON file here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading and validating tools...
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}
        </CardContent>
      </Card>

      {previewTools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview ({previewTools.length} tools)</span>
              <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Import All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {previewTools.map((tool) => (
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sample Template
          </CardTitle>
          <CardDescription>
            Download a sample JSON template to understand the required format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportSample} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Sample Template
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 