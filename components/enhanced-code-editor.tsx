"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Copy, CheckCircle } from 'lucide-react'

interface EnhancedCodeEditorProps {
  value: string
  onChange: (value: string) => void
  onReset: () => void
  bugs?: Array<{id: number, title: string}>
  bugsFixed?: number[]
  bugProgress?: {[key: number]: {isFixed: boolean, confidence: number}}
  recentlyFixed?: number[]
  placeholder?: string
  className?: string
}

export function EnhancedCodeEditor({
  value,
  onChange,
  onReset,
  bugs = [],
  bugsFixed = [],
  bugProgress = {},
  recentlyFixed = [],
  placeholder = "Enter your code here...",
  className = ""
}: EnhancedCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copied, setCopied] = useState(false)
  const [lineNumbers, setLineNumbers] = useState<string[]>([])

  // Generate line numbers when value changes
  useEffect(() => {
    const lines = value.split('\n')
    const numbers = lines.map((_, index) => (index + 1).toString())
    setLineNumbers(numbers)
  }, [value])

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  // Syntax highlighting for JavaScript/React
  const highlightSyntax = (code: string): string => {
    let highlighted = code
      // Keywords
      .replace(/(const|let|var|function|return|if|else|for|while|class|import|export|from|default|useState|useEffect|React)\b/g, '<span class="text-blue-400">$1</span>')
      // Strings
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      // Comments
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="text-gray-500">$1</span>')
      // JSX tags
      .replace(/(&lt;\/?[\w-]+(?:\s[^&gt;]*)?&gt;)/g, '<span class="text-yellow-400">$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-purple-400">$1</span>')

    return highlighted
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Editor Header */}
      <div className="bg-[#1E1E1E] px-4 py-2 border-b border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-medium text-gray-300">Your Code</h3>
            <p className="text-xs text-gray-500">Ctrl+Enter to run, Ctrl+R to reset</p>
          </div>
          
          {/* Inline Bug Status Indicators */}
          {bugs.length > 0 && (
            <div className="flex items-center gap-1" role="status" aria-label="Bug status indicators">
              {bugs.map((bug) => (
                <div
                  key={`bug-indicator-${bug.id}`}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    bugsFixed.includes(bug.id) 
                      ? 'bg-green-500 border-green-400' 
                      : bugProgress[bug.id]?.isFixed 
                        ? 'bg-yellow-500 border-yellow-400' 
                        : 'bg-red-500 border-red-400'
                  } ${
                    recentlyFixed.includes(bug.id) ? 'animate-pulse scale-125' : ''
                  }`}
                  title={`Bug ${bug.id}: ${bug.title} - ${
                    bugsFixed.includes(bug.id) ? 'Fixed' : 
                    bugProgress[bug.id]?.isFixed ? 'Detected' : 'Not Fixed'
                  }`}
                  role="img"
                  aria-label={`Bug ${bug.id} status: ${
                    bugsFixed.includes(bug.id) ? 'Fixed' : 
                    bugProgress[bug.id]?.isFixed ? 'Detected' : 'Not Fixed'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {value.length} chars • {lineNumbers.length} lines
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-white"
            title="Copy code"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-400 hover:text-white"
            title="Reset to original code"
            aria-label="Reset code to original state"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Editor Area with Line Numbers */}
      <div className="flex-1 relative bg-[#1E1E1E] overflow-hidden">
        <div className="flex h-full">
          {/* Line Numbers */}
          <div className="bg-[#252525] border-r border-[#2A2A2A] px-3 py-4 min-w-[50px] text-right select-none" aria-hidden="true">
            <div className="font-mono text-sm text-gray-500 leading-6">
              {lineNumbers.map((num, index) => (
                <div key={index} className="h-6">
                  {num}
                </div>
              ))}
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-transparent text-white p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7EE787] focus:ring-opacity-50 leading-6"
              placeholder={placeholder}
              spellCheck={false}
              aria-label="Code editor"
              style={{
                lineHeight: '1.5',
                tabSize: 2,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }}
            />
            
            {/* Syntax Highlighting Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 font-mono text-sm leading-6 whitespace-pre-wrap">
              <div 
                className="h-full"
                dangerouslySetInnerHTML={{
                  __html: highlightSyntax(value.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Real-time Bug Hints */}
        {bugs.some(bug => !bugsFixed.includes(bug.id)) && (
          <div className="absolute bottom-4 right-4 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg p-3 text-xs text-gray-400 max-w-xs shadow-lg" role="status" aria-live="polite">
            <div className="flex items-center gap-2 mb-2 font-medium text-gray-300">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" aria-hidden="true"></div>
              Active Bugs:
            </div>
            {bugs
              .filter(bug => !bugsFixed.includes(bug.id))
              .slice(0, 2)
              .map((bug) => (
                <div key={`bug-hint-${bug.id}`} className="text-xs text-gray-400 py-0.5">
                  • {bug.title}
                </div>
              ))
            }
            {bugs.filter(bug => !bugsFixed.includes(bug.id)).length > 2 && (
              <div className="text-xs text-gray-500 pt-1">
                +{bugs.filter(bug => !bugsFixed.includes(bug.id)).length - 2} more...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}