"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Code,
  Bug,
  PlayCircle,
  Target
} from "lucide-react"

interface HelpTip {
  id: string
  title: string
  content: React.ReactNode
  trigger: 'first-visit' | 'stuck' | 'error' | 'idle' | 'success'
  conditions?: {
    minTimeOnPage?: number
    errorCount?: number
    bugCount?: number
    userLevel?: 'beginner' | 'intermediate' | 'advanced'
  }
  priority: 'low' | 'medium' | 'high'
  dismissible: boolean
  showOnce?: boolean
}

interface ContextualHelpSystemProps {
  environment: 'learning' | 'sandbox'
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  currentTool?: string
  bugsFixed?: number
  totalBugs?: number
  timeOnPage?: number
  errorCount?: number
  isStuck?: boolean
  className?: string
}

export function ContextualHelpSystem({
  environment,
  userLevel,
  currentTool,
  bugsFixed = 0,
  totalBugs = 0,
  timeOnPage = 0,
  errorCount = 0,
  isStuck = false,
  className = ""
}: ContextualHelpSystemProps) {
  const [activeTip, setActiveTip] = useState<HelpTip | null>(null)
  const [dismissedTips, setDismissedTips] = useState<string[]>([])
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const helpPanelRef = useRef<HTMLDivElement>(null)

  const learningTips: HelpTip[] = [
    {
      id: 'first-visit-learning',
      title: 'Welcome to Guided Challenges!',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            This is your structured learning environment. Here you'll fix bugs with guided hints and real-time feedback.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4 text-blue-400" />
              <span>Edit code in the left panel</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PlayCircle className="h-4 w-4 text-green-400" />
              <span>See results in the right panel</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-yellow-400" />
              <span>Fix bugs to complete the challenge</span>
            </div>
          </div>
        </div>
      ),
      trigger: 'first-visit',
      priority: 'high',
      dismissible: true,
      showOnce: true,
      conditions: { userLevel: 'beginner' }
    },
    {
      id: 'stuck-help',
      title: 'Need a hint?',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            Looks like you might be stuck. Here are some ways to get help:
          </p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start border-[#2A2A2A] text-white hover:bg-[#252525]"
              onClick={() => {/* Open bug details */}}
            >
              <Bug className="h-4 w-4 mr-2" />
              View bug details and clues
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start border-[#2A2A2A] text-white hover:bg-[#252525]"
              onClick={() => {/* Copy AI prompt */}}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Get AI assistance prompt
            </Button>
          </div>
        </div>
      ),
      trigger: 'stuck',
      priority: 'medium',
      dismissible: true,
      conditions: { minTimeOnPage: 300000, errorCount: 3 } // 5 minutes, 3+ errors
    },
    {
      id: 'progress-encouragement',
      title: 'Great progress!',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            You've fixed {bugsFixed} out of {totalBugs} bugs. Keep going!
          </p>
          <p className="text-xs text-gray-400">
            💡 Try experimenting with your solution in Practice Mode when you're done.
          </p>
        </div>
      ),
      trigger: 'success',
      priority: 'low',
      dismissible: true,
      conditions: { bugCount: Math.floor(totalBugs / 2) }
    }
  ]

  const sandboxTips: HelpTip[] = [
    {
      id: 'first-visit-sandbox',
      title: 'Welcome to Practice Mode!',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            This is your free exploration environment. Experiment, prototype, and learn without constraints.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4 text-purple-400" />
              <span>Start with templates or create from scratch</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PlayCircle className="h-4 w-4 text-green-400" />
              <span>See live results as you type</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-blue-400" />
              <span>Ready for challenges? Switch to Guided mode</span>
            </div>
          </div>
        </div>
      ),
      trigger: 'first-visit',
      priority: 'high',
      dismissible: true,
      showOnce: true
    },
    {
      id: 'idle-suggestion',
      title: 'Try a structured challenge?',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Ready to test your skills with guided challenges?
          </p>
          <Button
            size="sm"
            className="w-full bg-[#7EE787] text-black hover:bg-[#6BD975]"
            onClick={() => {/* Navigate to challenges */}}
          >
            Browse Challenges
          </Button>
        </div>
      ),
      trigger: 'idle',
      priority: 'low',
      dismissible: true,
      conditions: { minTimeOnPage: 600000 } // 10 minutes
    }
  ]

  const tips = environment === 'learning' ? learningTips : sandboxTips

  // Smart tip triggering logic
  useEffect(() => {
    const checkForActiveTip = () => {
      const availableTips = tips.filter(tip => {
        if (dismissedTips.includes(tip.id)) return false
        if (tip.showOnce && localStorage.getItem(`tip-shown-${tip.id}`)) return false
        
        // Check conditions
        const conditions = tip.conditions || {}
        
        if (conditions.userLevel && conditions.userLevel !== userLevel) return false
        if (conditions.minTimeOnPage && timeOnPage < conditions.minTimeOnPage) return false
        if (conditions.errorCount && errorCount < conditions.errorCount) return false
        if (conditions.bugCount && bugsFixed < conditions.bugCount) return false
        
        // Check trigger conditions
        switch (tip.trigger) {
          case 'first-visit':
            return timeOnPage > 2000 && timeOnPage < 10000 // Show after 2s, hide after 10s
          case 'stuck':
            return isStuck && timeOnPage > 300000 // 5+ minutes and stuck
          case 'idle':
            return timeOnPage > 600000 && !activeTip // 10+ minutes idle
          case 'success':
            return bugsFixed > 0 && bugsFixed === Math.floor(totalBugs / 2)
          case 'error':
            return errorCount >= 3
          default:
            return false
        }
      })

      // Show highest priority tip
      const sortedTips = availableTips.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

      if (sortedTips.length > 0 && !activeTip) {
        setActiveTip(sortedTips[0])
      }
    }

    const interval = setInterval(checkForActiveTip, 5000) // Check every 5 seconds
    checkForActiveTip() // Check immediately

    return () => clearInterval(interval)
  }, [tips, timeOnPage, errorCount, isStuck, bugsFixed, totalBugs, userLevel, dismissedTips, activeTip])

  const dismissTip = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId])
    setActiveTip(null)
    
    if (activeTip?.showOnce) {
      localStorage.setItem(`tip-shown-${tipId}`, 'true')
    }
  }

  const getTipIcon = (trigger: string) => {
    switch (trigger) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'stuck': return <HelpCircle className="h-4 w-4 text-yellow-400" />
      case 'success': return <Target className="h-4 w-4 text-green-400" />
      default: return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getTipColor = (trigger: string) => {
    switch (trigger) {
      case 'error': return 'border-red-400/50 bg-red-950/20'
      case 'stuck': return 'border-yellow-400/50 bg-yellow-950/20'
      case 'success': return 'border-green-400/50 bg-green-950/20'
      default: return 'border-blue-400/50 bg-blue-950/20'
    }
  }

  return (
    <div className={className}>
      {/* Active Contextual Tip */}
      {activeTip && (
        <div className={`
          fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg text-white
          ${getTipColor(activeTip.trigger)}
          animate-in slide-in-from-right-5 duration-300
        `}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getTipIcon(activeTip.trigger)}
              <h4 className="font-medium text-white">{activeTip.title}</h4>
            </div>
            {activeTip.dismissible && (
              <button
                onClick={() => dismissTip(activeTip.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="text-gray-300">
            {activeTip.content}
          </div>
        </div>
      )}

      {/* Help Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHelpPanel(!showHelpPanel)}
        className="border-[#2A2A2A] text-white hover:bg-[#252525]"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Help
      </Button>

      {/* Help Panel */}
      {showHelpPanel && (
        <div 
          ref={helpPanelRef}
          className="absolute top-full right-0 mt-2 w-80 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-lg z-40"
        >
          <div className="p-4 border-b border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Quick Help</h3>
              <button
                onClick={() => setShowHelpPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <QuickHelpSection environment={environment} userLevel={userLevel} />
          </div>
        </div>
      )}
    </div>
  )
}

function QuickHelpSection({ 
  environment, 
  userLevel 
}: { 
  environment: 'learning' | 'sandbox'
  userLevel: 'beginner' | 'intermediate' | 'advanced' 
}) {
  if (environment === 'learning') {
    return (
      <div className="space-y-3">
        <div className="text-sm">
          <h4 className="font-medium text-white mb-2">Getting Started</h4>
          <ul className="space-y-1 text-gray-300">
            <li>• Edit code in the left panel</li>
            <li>• Click "Run & Check" to test your fixes</li>
            <li>• Watch bug indicators turn green</li>
            <li>• Use "Bug Details" for hints</li>
          </ul>
        </div>
        
        <div className="text-sm">
          <h4 className="font-medium text-white mb-2">Keyboard Shortcuts</h4>
          <ul className="space-y-1 text-gray-300 font-mono text-xs">
            <li>Ctrl+Enter: Run code</li>
            <li>Ctrl+R: Reset code</li>
            <li>Ctrl+1/2/3: Change layout</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <h4 className="font-medium text-white mb-2">Practice Mode</h4>
        <ul className="space-y-1 text-gray-300">
          <li>• Use templates or start blank</li>
          <li>• Live preview updates as you type</li>
          <li>• Save your experiments</li>
          <li>• Export when ready</li>
        </ul>
      </div>
      
      <div className="text-sm">
        <h4 className="font-medium text-white mb-2">Ready for Challenges?</h4>
        <p className="text-gray-300">
          Switch to Guided Challenges for structured learning with bug fixes and hints.
        </p>
      </div>
    </div>
  )
}