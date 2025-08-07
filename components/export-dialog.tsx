"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, FileCode, Package, Github, Code2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { ExportManager, ExportOptions } from '@/lib/utils/exportManager'

interface ExportDialogProps {
  code: string
  componentName: string
  toolTitle: string
  trigger?: React.ReactNode
}

export function ExportDialog({ code, componentName, toolTitle, trigger }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)

  const exportOptions: Array<{
    id: string
    title: string
    description: string
    icon: React.ReactNode
    format: ExportOptions['format']
    action: () => Promise<void>
  }> = [
    {
      id: 'react-component',
      title: 'React Component',
      description: 'Export as a standalone React component file',
      icon: <FileCode className="h-5 w-5" />,
      format: 'react-component',
      action: async () => {
        const result = ExportManager.exportAsReactComponent(code, componentName, {
          format: 'react-component',
          includeDependencies: false,
          includeStyles: false,
          includeTests: false,
          filename: `${componentName}.jsx`
        })
        
        if (result.success && result.data) {
          ExportManager.downloadFile(result.data, `${componentName}.jsx`, 'text/javascript')
          setExportResult({ success: true, message: 'React component exported successfully!' })
        } else {
          setExportResult({ success: false, message: result.error || 'Export failed' })
        }
      }
    },
    {
      id: 'nextjs-project',
      title: 'Next.js Project',
      description: 'Export as a complete Next.js project with all files',
      icon: <Package className="h-5 w-5" />,
      format: 'nextjs-page',
      action: async () => {
        const result = await ExportManager.exportAsNextJSProject(code, componentName, {
          format: 'nextjs-page',
          includeDependencies: true,
          includeStyles: true,
          includeTests: false,
          filename: `${componentName}-nextjs-project.zip`
        })
        
        if (result.success && result.data) {
          ExportManager.downloadFile(result.data, `${componentName}-nextjs-project.zip`, 'application/zip')
          setExportResult({ success: true, message: 'Next.js project exported successfully!' })
        } else {
          setExportResult({ success: false, message: result.error || 'Export failed' })
        }
      }
    },
    {
      id: 'codesandbox',
      title: 'CodeSandbox',
      description: 'Create a CodeSandbox and open in browser',
      icon: <Code2 className="h-5 w-5" />,
      format: 'react-component',
      action: async () => {
        const result = await ExportManager.exportToCodeSandbox(code, componentName, {
          format: 'react-component',
          includeDependencies: true,
          includeStyles: false,
          includeTests: false
        })
        
        if (result.success && result.url) {
          window.open(result.url, '_blank')
          setExportResult({ success: true, message: 'CodeSandbox created successfully!', url: result.url })
        } else {
          setExportResult({ success: false, message: result.error || 'Failed to create CodeSandbox' })
        }
      }
    },
    {
      id: 'github-gist',
      title: 'GitHub Gist',
      description: 'Create a GitHub Gist for sharing',
      icon: <Github className="h-5 w-5" />,
      format: 'react-component',
      action: async () => {
        const result = await ExportManager.exportToGitHubGist(code, componentName, {
          format: 'react-component',
          includeDependencies: true,
          includeStyles: false,
          includeTests: false
        })
        
        if (result.success && result.data) {
          // For now, we'll download the gist data as JSON
          // In a real implementation, you'd use GitHub API with authentication
          ExportManager.downloadFile(result.data, `${componentName}-gist.json`, 'application/json')
          setExportResult({ success: true, message: 'GitHub Gist data exported! (Manual upload required)' })
        } else {
          setExportResult({ success: false, message: result.error || 'Failed to create GitHub Gist' })
        }
      }
    }
  ]

  const handleExport = async (option: typeof exportOptions[0]) => {
    setIsExporting(true)
    setExportResult(null)
    
    try {
      await option.action()
    } catch (error) {
      setExportResult({ success: false, message: `Export failed: ${error}` })
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setExportResult(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {toolTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className="border border-[#2A2A2A] rounded-lg p-4 hover:border-[#7EE787] transition-colors cursor-pointer"
                onClick={() => !isExporting && handleExport(option)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-[#7EE787] mt-0.5">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{option.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {option.format}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Status */}
          {isExporting && (
            <div className="flex items-center gap-3 p-4 bg-[#2A2A2A] rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-[#7EE787]" />
              <span>Exporting...</span>
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              exportResult.success 
                ? 'bg-green-900/20 border border-green-500/30' 
                : 'bg-red-900/20 border border-red-500/30'
            }`}>
              {exportResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="flex-1">
                <p className="text-sm">{exportResult.message}</p>
                {exportResult.url && (
                  <a 
                    href={exportResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#7EE787] hover:text-[#6BD975] text-sm flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in new tab
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Export Info */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h4 className="font-semibold mb-2">Export Information</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Component Name:</span>
                <span className="text-[#7EE787]">{componentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Code Length:</span>
                <span className="text-[#7EE787]">{code.length} characters</span>
              </div>
              <div className="flex justify-between">
                <span>Tool:</span>
                <span className="text-[#7EE787]">{toolTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 