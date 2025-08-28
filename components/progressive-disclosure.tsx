"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, HelpCircle, Settings, Zap, Target } from "lucide-react"

interface ProgressiveDisclosureProps {
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  children: React.ReactNode
  title: string
  description?: string
  defaultExpanded?: boolean
  level?: 'beginner' | 'intermediate' | 'advanced'
  className?: string
}

export function ProgressiveDisclosure({
  userLevel,
  children,
  title,
  description,
  defaultExpanded = false,
  level = 'beginner',
  className = ""
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  // Auto-expand based on user level
  useEffect(() => {
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 }
    if (levelOrder[userLevel] >= levelOrder[level]) {
      setIsExpanded(defaultExpanded)
    } else {
      setIsExpanded(false)
    }
  }, [userLevel, level, defaultExpanded])

  const shouldShow = () => {
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 }
    return levelOrder[userLevel] >= levelOrder[level]
  }

  if (!shouldShow()) return null

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return <Target className="h-3 w-3" />
      case 'intermediate': return <Zap className="h-3 w-3" />
      case 'advanced': return <Settings className="h-3 w-3" />
      default: return <HelpCircle className="h-3 w-3" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-400/20'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20'
      case 'advanced': return 'bg-purple-500/10 text-purple-400 border-purple-400/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-400/20'
    }
  }

  return (
    <div className={`border border-[#2A2A2A] rounded-lg ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#252525] transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          <span className="font-medium text-white">{title}</span>
          <Badge 
            variant="outline" 
            className={`text-xs ${getLevelColor(level)}`}
          >
            <span className="flex items-center gap-1">
              {getLevelIcon(level)}
              {level}
            </span>
          </Badge>
        </div>
        {description && (
          <span className="text-xs text-gray-400 max-w-xs truncate">
            {description}
          </span>
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[#2A2A2A]">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface CompactHeaderProps {
  title: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  progress?: {
    completed: number
    total: number
    percentage: number
  }
  essentialActions: React.ReactNode
  advancedTools?: React.ReactNode
  className?: string
}

export function CompactHeader({
  title,
  userLevel,
  progress,
  essentialActions,
  advancedTools,
  className = ""
}: CompactHeaderProps) {
  return (
    <div className={`border-b border-[#1E1E1E] px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Title and Progress */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            {progress && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-[#2A2A2A] rounded-full h-2 min-w-[120px]">
                  <div 
                    className="bg-[#7EE787] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {progress.completed}/{progress.total}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Always visible essential actions */}
          <div className="flex items-center gap-2">
            {essentialActions}
          </div>
          
          {/* Progressive advanced tools */}
          {advancedTools && (userLevel === 'intermediate' || userLevel === 'advanced') && (
            <div className="flex items-center gap-2 border-l border-[#2A2A2A] pl-2 ml-2">
              {advancedTools}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ContextualHelpProps {
  trigger: 'first-visit' | 'stuck' | 'error' | 'manual'
  title: string
  content: React.ReactNode
  isVisible: boolean
  onDismiss: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function ContextualHelp({
  trigger,
  title,
  content,
  isVisible,
  onDismiss,
  position = 'bottom',
  className = ""
}: ContextualHelpProps) {
  if (!isVisible) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'bottom-full mb-2'
      case 'left': return 'right-full mr-2'
      case 'right': return 'left-full ml-2'
      default: return 'top-full mt-2'
    }
  }

  const getTriggerColor = () => {
    switch (trigger) {
      case 'error': return 'border-red-400/50 bg-red-950/20'
      case 'stuck': return 'border-yellow-400/50 bg-yellow-950/20'
      case 'first-visit': return 'border-blue-400/50 bg-blue-950/20'
      default: return 'border-[#2A2A2A] bg-[#1E1E1E]'
    }
  }

  return (
    <div className={`absolute z-50 ${getPositionClasses()} ${className}`}>
      <div className={`
        max-w-sm p-4 rounded-lg border text-sm text-white shadow-lg
        ${getTriggerColor()}
      `}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-white">{title}</h4>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="text-gray-300">
          {content}
        </div>
      </div>
    </div>
  )
}