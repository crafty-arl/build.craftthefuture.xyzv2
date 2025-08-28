"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sandpack } from "@codesandbox/sandpack-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, RotateCcw, Terminal, Github, LogOut, Download, Settings, CheckCircle, AlertCircle, Target, Bug, Copy, EyeOff, TestTube, Beaker } from 'lucide-react'
import ProfilePage from '../../../components/profile-page'
import { loadToolsFromJson, fallbackTools, type HomepageTool } from '@/lib/utils/toolLoader'
import { ExportDialog } from '@/components/export-dialog'
import { ReactCodeGenerator } from '@/lib/utils/reactCodeGenerator'
import { FunctionalBugDetection } from '@/lib/utils/functionalBugDetection'
import { BugDebugOverlay } from '@/components/BugDebugOverlay'
import { EnhancedCodeEditor } from '@/components/enhanced-code-editor'
import { SuccessCelebration } from '@/components/success-celebration'
import { ProgressiveDisclosure, CompactHeader } from '@/components/progressive-disclosure'
import { LearningBridge } from '@/components/learning-bridge'
import { ContextualHelpSystem } from '@/components/contextual-help'

type Tool = HomepageTool

export default function ToolPage() {
  const params = useParams()
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>(fallbackTools)
  const [isLoadingTools, setIsLoadingTools] = useState(true)
  const [currentTool, setCurrentTool] = useState<Tool | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [sandpackKey, setSandpackKey] = useState(0)
  const [user, setUser] = useState<{username: string, avatar: string, name: string} | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [currentCode, setCurrentCode] = useState('')
  const [editorCode, setEditorCode] = useState('')
  const [bugsFixed, setBugsFixed] = useState<number[]>([])

  // Enhanced UX state variables
  const [isRunningCode, setIsRunningCode] = useState(false)
  const [runProgress, setRunProgress] = useState(0)
  const [lastRunTime, setLastRunTime] = useState<number | null>(null)
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split')
  const [showSettings, setShowSettings] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([])
  
  // Learning experience enhancements
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [feedbackMode, setFeedbackMode] = useState<'immediate' | 'on-run' | 'on-request'>('on-run')
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [isStuck, setIsStuck] = useState(false)
  const [showLearningBridge, setShowLearningBridge] = useState(false)
  
  const [lastTestResults, setLastTestResults] = useState<Array<{
    bugId: number
    name?: string
    isFixed: boolean
    confidence: number
    details: string
    testName: string
    executionTime: number
  }>>([])

  // Developer debug logger (enable via window.__BUG_DEBUG__ = true in console)
  const devLog = (...args: unknown[]) => {
    if (typeof window === 'undefined') return
    const debugFlag = (window as unknown as { __BUG_DEBUG__?: boolean }).__BUG_DEBUG__
    if (process.env.NODE_ENV !== 'production' || debugFlag) {
      // eslint-disable-next-line no-console
      console.debug('[BugStudio]', ...args)
    }
  }

  // Inline bug tracking state
  const [bugProgress, setBugProgress] = useState<{[key: number]: {isFixed: boolean, confidence: number}}>({})
  const [recentlyFixed, setRecentlyFixed] = useState<number[]>([])
  const [showBugProgress, setShowBugProgress] = useState(true)
  const [showBugDetails, setShowBugDetails] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null)
  const [showDebugOverlay, setShowDebugOverlay] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'bug-fix' | 'all-complete' | 'milestone'>('bug-fix')
  const [celebrationMessage, setCelebrationMessage] = useState('')

  // Load tools from JSON on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        const loadedTools = await loadToolsFromJson()
        if (loadedTools.length > 0) {
          setTools(loadedTools)
          devLog('Tools loaded', loadedTools.map(t => ({ id: t.id, bugCount: t.bugs.length })))
        }
      } catch (error) {
        console.error('Failed to load tools from JSON:', error)
      } finally {
        setIsLoadingTools(false)
      }
    }

    loadTools()
  }, [])

  // Set current tool based on URL slug
  useEffect(() => {
    if (tools.length > 0 && params.slug) {
      devLog('URL params', { slug: params.slug, availableTools: tools.map(t => t.id) })
      const tool = tools.find(t => t.id === params.slug)
      if (tool) {
        setCurrentTool(tool)
        setCurrentCode(tool.brokenCode)
        setEditorCode(tool.brokenCode)
        setBugsFixed([])
        setRecentlyFixed([])
        setBugProgress({})
        devLog('Tool selected', { toolId: tool.id, uiBugCount: tool.bugs.length, title: tool.title })
        
        // Load saved code if auto-save is enabled
        if (autoSave) {
          const savedCode = localStorage.getItem(`tool-${tool.id}-code`)
          if (savedCode && savedCode !== tool.brokenCode) {
            setEditorCode(savedCode)
            devLog('Loaded saved code', { toolId: tool.id, codeLength: savedCode.length })
          }
        }
      } else {
        router.push('/')
      }
    }
  }, [tools, params.slug, router, autoSave])

  // Auto-save functionality
  useEffect(() => {
    if (currentTool && editorCode && autoSave) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`tool-${currentTool.id}-code`, editorCode)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [editorCode, currentTool, autoSave])

  // Intelligent bug detection based on feedback mode
  useEffect(() => {
    if (currentTool && editorCode && feedbackMode === 'immediate') {
      const timeoutId = setTimeout(() => {
        checkBugProgress(editorCode).catch(console.error)
      }, 1500) // Longer delay to encourage experimentation
      return () => clearTimeout(timeoutId)
    }
  }, [editorCode, currentTool, feedbackMode])

  // Time tracking for contextual help
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeOnPage(Date.now() - startTime)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Stuck detection (no progress for 5+ minutes)
  useEffect(() => {
    const lastActivity = lastRunTime || Date.now()
    const timeSinceActivity = Date.now() - lastActivity
    setIsStuck(timeSinceActivity > 300000 && bugsFixed.length < getTotalBugsCount())
  }, [lastRunTime, bugsFixed, currentTool])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault()
            runCode()
            break
          case 'r':
            e.preventDefault()
            resetCode()
            break
          case '1':
            e.preventDefault()
            setLayoutMode('split')
            break
          case '2':
            e.preventDefault()
            setLayoutMode('editor')
            break
          case '3':
            e.preventDefault()
            setLayoutMode('preview')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { id, message, type }])
    devLog('Toast', { type, message })
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Check bug progress in real-time
  const checkBugProgress = async (code: string) => {
    if (!currentTool) return

    const toolId = currentTool.id
    devLog('checkBugProgress:start', { toolId, codeLength: code.length })
    const testResults = await FunctionalBugDetection.getDetailedTestResults(toolId, code)
    setLastTestResults(testResults.testResults)
    devLog('checkBugProgress:results', {
      toolId,
      reportedTotalBugs: testResults.totalBugs,
      uiBugCount: currentTool?.bugs.length,
      results: testResults.testResults.map((r) => ({ bugId: r.bugId, isFixed: r.isFixed, confidence: r.confidence }))
    })
    const newBugProgress: {[key: number]: {isFixed: boolean, confidence: number}} = {}
    const newlyFixedBugs: number[] = []

    testResults.testResults.forEach((result) => {
      newBugProgress[result.bugId] = {
        isFixed: result.isFixed,
        confidence: result.confidence
      }
      
      // Check if this is a newly fixed bug with high confidence
      if (result.isFixed && result.confidence >= 80 && !bugsFixed.includes(result.bugId)) {
        newlyFixedBugs.push(result.bugId)
      }
    })

    setBugProgress(newBugProgress)
    
    // Update bugsFixed state for newly fixed bugs with high confidence
    if (newlyFixedBugs.length > 0) {
      setBugsFixed(prev => [...prev, ...newlyFixedBugs])
      setRecentlyFixed(newlyFixedBugs)
      addToast(`🎉 Fixed ${newlyFixedBugs.length} bug${newlyFixedBugs.length > 1 ? 's' : ''}!`, 'success')
      
      // Clear recently fixed after animation
      setTimeout(() => setRecentlyFixed([]), 3000)
    }

    // If ALL bugs are fixed (considering current progress + previous state), surface a clear success toast
    const totalBugs = currentTool.bugs.length
    if (totalBugs > 0) {
      const fixedNow = Object.entries(newBugProgress)
        .filter(([, p]) => p.isFixed && p.confidence >= 80)
        .map(([bugId]) => Number(bugId))
      const fixedSet = new Set<number>([...bugsFixed, ...fixedNow])
      devLog('checkBugProgress:evaluate-complete', { toolId, totalBugs, fixedNow, previouslyFixed: bugsFixed, fixedSetSize: fixedSet.size })
      if (fixedSet.size === totalBugs) {
        addToast('🎉 All bugs fixed! Challenge complete.', 'success')
      }
    }
  }

  const resetCode = () => {
    if (currentTool) {
      setCurrentCode(currentTool.brokenCode)
      setEditorCode(currentTool.brokenCode)
      setBugsFixed([])
      setRecentlyFixed([])
      setBugProgress({})
      setSandpackKey(prev => prev + 1)
      addToast('Code reset to original state', 'info')
    }
  }

  const runCode = async () => {
    setIsRunningCode(true)
    setRunProgress(0)
    setErrorCount(prev => prev + 1) // Track error attempts for contextual help
    devLog('runCode:start', { toolId: currentTool?.id, codeLength: (editorCode || currentCode).length })
    
    const progressInterval = setInterval(() => {
      setRunProgress(prev => Math.min(prev + 15, 90))
    }, 150)
    
    try {
      const codeToCheck = editorCode || currentCode
      
      if (!currentTool) {
        addToast('No tool selected', 'error')
        return
      }

      // Only run bug detection on 'on-run' and 'on-request' modes
      if (feedbackMode === 'on-run' || feedbackMode === 'on-request') {
        const toolId = currentTool.id
        const newBugsFixed: number[] = []
        const testResults = await FunctionalBugDetection.getDetailedTestResults(toolId, codeToCheck)
        setLastTestResults(testResults.testResults)
        devLog('runCode:results', {
          toolId,
          reportedTotalBugs: testResults.totalBugs,
          uiBugCount: currentTool?.bugs.length,
          results: testResults.testResults.map((r) => ({ bugId: r.bugId, isFixed: r.isFixed, confidence: r.confidence }))
        })

        for (const testResult of testResults.testResults) {
          if (
            testResult.isFixed &&
            testResult.confidence >= 80 &&
            !bugsFixed.includes(testResult.bugId)
          ) {
            newBugsFixed.push(testResult.bugId)
          }
        }

        if (newBugsFixed.length > 0) {
          devLog('runCode:newlyFixed', { toolId, newBugsFixed, previouslyFixed: bugsFixed })
          setBugsFixed(prev => [...prev, ...newBugsFixed])
          setRecentlyFixed(newBugsFixed)
          
          // Show success celebration
          setCelebrationType('bug-fix')
          setCelebrationMessage(`Fixed ${newBugsFixed.length} bug${newBugsFixed.length > 1 ? 's' : ''}!`)
          setShowCelebration(true)
          
          addToast(`🎉 Fixed ${newBugsFixed.length} new bug${newBugsFixed.length > 1 ? 's' : ''}!`, 'success')
          
          // Clear recently fixed after animation
          setTimeout(() => setRecentlyFixed([]), 3000)
        }
        
        // Always surface explicit success when ALL bugs are fixed, even if none were newly fixed this run
        if (currentTool) {
          const totalBugs = currentTool.bugs.length
          const fixedCount = new Set([...
            bugsFixed,
            ...newBugsFixed
          ]).size
          devLog('runCode:evaluate-complete', { toolId, totalBugs, fixedCount })
          if (totalBugs > 0 && fixedCount === totalBugs) {
            // Show completion celebration
            setCelebrationType('all-complete')
            setCelebrationMessage('All bugs fixed! Challenge complete!')
            setShowCelebration(true)
            
            addToast('🎉 All bugs fixed! Challenge complete.', 'success')
          }
        }
      } else {
        // For 'immediate' mode or no feedback mode, just refresh the preview
        setSandpackKey(prev => prev + 1)
      }
      
      setLastRunTime(Date.now())
    } finally {
      setRunProgress(100)
      setTimeout(() => {
        setIsRunningCode(false)
        setRunProgress(0)
        devLog('runCode:end')
      }, 500)
      clearInterval(progressInterval)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoggingIn(true)
    setTimeout(() => {
      setUser({
        username: 'codecrafter',
        avatar: '/github-avatar.png',
        name: 'Code Crafter'
      })
      setIsLoggingIn(false)
      addToast('Successfully logged in!', 'success')
    }, 1500)
  }

  const handleLogout = () => {
    setUser(null)
    addToast('Logged out successfully', 'info')
  }

  const getComponentName = (toolId: string) => {
    const componentMap: { [key: string]: string } = {
      'poll-maker': 'PollMaker',
      'date-calculator': 'DateCalculator',
      'product-name-generator': 'ProductNameGenerator',
      'receipt-builder': 'ReceiptBuilder',
      'bio-generator': 'BioGenerator'
    }
    return componentMap[toolId] || 'Component'
  }

  const getTotalBugsCount = () => {
    return currentTool ? currentTool.bugs.length : 0
  }

  const getCompletionPercentage = () => {
    if (!currentTool) return 0
    return Math.round((bugsFixed.length / currentTool.bugs.length) * 100)
  }

  const copyAIPrompt = async (bug: {id: number, title: string, description: string, clue: string, bonus: string, solution?: string}, bugId: number) => {
    const prompt = `Please help me fix this bug in my React code:

**Bug Title:** ${bug.title}
**Description:** ${bug.description}
**Clue:** ${bug.clue}
**Bonus Challenge:** ${bug.bonus}

**Current Code:**
\`\`\`javascript
${editorCode || currentCode}
\`\`\`

Please provide the corrected code with clear explanations of what was wrong and how you fixed it. Focus specifically on the bug described above.`

    try {
      await navigator.clipboard.writeText(prompt)
      setCopiedPrompt(bugId)
      addToast('AI prompt copied to clipboard!', 'success')
      setTimeout(() => setCopiedPrompt(null), 2000)
    } catch {
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />
  }

  if (isLoadingTools) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7EE787]"></div>
          <p className="mt-4 text-gray-400">Loading tools...</p>
        </div>
      </div>
    )
  }

  if (!currentTool) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-gray-400 mb-6">The tool you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/')} className="bg-[#7EE787] text-black hover:bg-[#6BD975]">
            ← Back to Studio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white animate-slide-up">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 animate-slide-right ${
              toast.type === 'success' ? 'bg-[#7EE787] text-black animate-glow' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Simplified Compact Header */}
      <CompactHeader
        title={currentTool.title}
        userLevel={userLevel}
        progress={{
          completed: bugsFixed.length,
          total: getTotalBugsCount(),
          percentage: getCompletionPercentage()
        }}
        essentialActions={
          <>
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white hover:bg-[#1E1E1E] text-sm"
              size="sm"
            >
              ← Back
            </Button>
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs">
              Guided Challenge
            </Badge>
            <Badge className="bg-[#7EE787] text-black text-xs">
              {currentTool.difficulty}
            </Badge>
            <ContextualHelpSystem
              environment="learning"
              userLevel={userLevel}
              currentTool={currentTool.id}
              bugsFixed={bugsFixed.length}
              totalBugs={getTotalBugsCount()}
              timeOnPage={timeOnPage}
              errorCount={errorCount}
              isStuck={isStuck}
            />
          </>
        }
        advancedTools={
          <>
            {/* Layout Controls - Only show for intermediate+ */}
            <div className="flex items-center gap-1 bg-[#1E1E1E] rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayoutMode('split')}
                className={`text-xs px-2 ${layoutMode === 'split' ? 'bg-[#7EE787] text-black' : 'text-gray-400'}`}
              >
                Split
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayoutMode('editor')}
                className={`text-xs px-2 ${layoutMode === 'editor' ? 'bg-[#7EE787] text-black' : 'text-gray-400'}`}
              >
                Editor
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayoutMode('preview')}
                className={`text-xs px-2 ${layoutMode === 'preview' ? 'bg-[#7EE787] text-black' : 'text-gray-400'}`}
              >
                Preview
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {user && (
              <div 
                className="flex items-center gap-2 px-2 py-1 bg-[#1E1E1E] rounded-full cursor-pointer hover:bg-[#2A2A2A]"
                onClick={() => setShowProfile(true)}
              >
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-gray-300 hidden sm:inline">{user.username}</span>
              </div>
            )}
          </>
        }
      />

      {/* Dynamic Layout */}
      <div className="h-[calc(100vh-140px)] flex">
        {/* Enhanced Code Editor */}
        {(layoutMode === 'split' || layoutMode === 'editor') && (
          <div className={`${layoutMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-[#2A2A2A]`}>
            <EnhancedCodeEditor
              value={editorCode || currentCode}
              onChange={setEditorCode}
              onReset={resetCode}
              bugs={currentTool?.bugs || []}
              bugsFixed={bugsFixed}
              bugProgress={bugProgress}
              recentlyFixed={recentlyFixed}
              placeholder="Enter your React code here..."
              className="h-full"
            />
          </div>
        )}

        {/* Live Preview */}
        {(layoutMode === 'split' || layoutMode === 'preview') && (
          <div className={`${layoutMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="h-full flex flex-col">
              <div className="bg-[#1E1E1E] px-4 py-2 border-b border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">Live Preview</h3>
                  <p className="text-xs text-gray-500">Real-time code execution</p>
                </div>
                {lastRunTime && (
                  <span className="text-xs text-gray-500">
                    Last run: {new Date(lastRunTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <Sandpack
                  key={`${currentTool.id}-${sandpackKey}`}
                  template="react"
                  files={{
                    "/App.js": {
                      code: ReactCodeGenerator.generateToolCode(currentTool.id, editorCode || currentCode),
                      active: true
                    }
                  }}
                  theme={{
                    colors: {
                      surface1: "#1E1E1E",
                      surface2: "#1E1E1E",
                      surface3: "#1E1E1E"
                    }
                  }}
                  options={{
                    showNavigator: false,
                    showTabs: false,
                    showLineNumbers: false,
                    showInlineErrors: false,
                    wrapContent: true,
                    layout: "preview",
                    editorHeight: "400px",
                  }}
                  customSetup={{
                    dependencies: {
                      "react": "^18.0.0",
                      "react-dom": "^18.0.0"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Test Console */}
      {showConsole && (
        <div className="border-t border-[#1E1E1E] bg-[#0F0F0F] px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span className="text-sm text-gray-300 font-medium">Live Tests</span>
            </div>
            <div className="text-xs text-gray-500">
              {currentTool && (
                <>
                  Fixed {lastTestResults.filter(r => r.isFixed && r.confidence >= 80).length}/{currentTool.bugs.length}
                </>
              )}
              {lastRunTime && (
                <span className="ml-3">Last check: {new Date(lastRunTime).toLocaleTimeString()}</span>
              )}
            </div>
          </div>
          <div className="max-h-52 overflow-auto rounded border border-[#2A2A2A]">
            {lastTestResults.length === 0 ? (
              <div className="p-3 text-xs text-gray-500">Type or press Run to see test results...</div>
            ) : (
              <ul className="divide-y divide-[#1E1E1E]">
                {lastTestResults.map((r, idx) => (
                  <li key={`${r.bugId}-${idx}`} className="px-3 py-2 flex items-start gap-3">
                    <div className="mt-0.5">
                      {r.isFixed && r.confidence >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : r.isFixed ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Bug className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white font-medium">{r.testName || `Bug ${r.bugId}`}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.isFixed ? (r.confidence >= 80 ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black') : 'bg-red-600 text-white'}`}>{r.isFixed ? 'FIXED' : 'NOT FIXED'}</span>
                        <span className="text-[10px] text-gray-400">{r.executionTime}ms</span>
                        <span className="text-[10px] text-gray-400">{r.confidence}%</span>
                      </div>
                      <div className="text-xs text-gray-400 truncate">{r.details}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Compact Bottom Dock */}
      <div className="border-t border-[#1E1E1E] bg-[#1E1E1E] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Enhanced Run Button */}
            <Button
              onClick={runCode}
              disabled={isRunningCode}
              className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium px-4 py-2"
            >
              {isRunningCode ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Running...</span>
                </div>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run & Check
                </>
              )}
            </Button>
            
            {/* Progress indicator */}
            {isRunningCode && (
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#7EE787] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${runProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{runProgress}%</span>
              </div>
            )}

            {/* Completion Status */}
            {bugsFixed.length === getTotalBugsCount() && getTotalBugsCount() > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-black rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All Bugs Fixed!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDebugOverlay(!showDebugOverlay)}
              className="border-[#2A2A2A] text-white hover:bg-[#252525] text-sm"
              size="sm"
            >
              <TestTube className="h-4 w-4 mr-1" />
              Debug Tests
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowBugDetails(!showBugDetails)}
              className="border-[#2A2A2A] text-white hover:bg-[#252525] text-sm"
              size="sm"
            >
              <Bug className="h-4 w-4 mr-1" />
              Bug Details
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowConsole(!showConsole)}
              className="border-[#2A2A2A] text-white hover:bg-[#252525] text-sm"
              size="sm"
            >
              <Terminal className="h-4 w-4 mr-1" />
              Console
            </Button>
            
            <ExportDialog
              code={currentCode}
              componentName={getComponentName(currentTool.id)}
              toolTitle={currentTool.title}
              trigger={
                <Button
                  variant="outline"
                  className="border-[#2A2A2A] text-white hover:bg-[#252525] text-sm"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              }
            />

            <Button
              variant="outline"
              onClick={() => setShowLearningBridge(!showLearningBridge)}
              className="border-purple-400/20 text-purple-400 hover:bg-purple-500/10 text-sm"
              size="sm"
            >
              <Beaker className="h-4 w-4 mr-1" />
              Practice Mode
            </Button>
            
            {!user ? (
              <Button
                onClick={handleGitHubLogin}
                disabled={isLoggingIn}
                className="bg-[#7EE787] text-black hover:bg-[#6BD975] text-sm"
                size="sm"
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-1" />
                    Login
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#2A2A2A] text-white hover:bg-[#252525] text-sm"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bug Details Panel */}
      {showBugDetails && currentTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Bug Details & AI Prompts
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowBugDetails(false)}
                className="text-gray-400 hover:text-white"
                size="sm"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {currentTool.bugs.map((bug, index) => (
                <div
                  key={`bug-card-${bug.id}-${index}`}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    bugsFixed.includes(bug.id) 
                      ? 'border-green-500 bg-green-950/20' 
                      : 'border-[#2A2A2A] bg-[#252525]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-white">Bug #{bug.id}: {bug.title}</h3>
                      {bugsFixed.includes(bug.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-gray-300">
                    <div>
                      <h4 className="font-medium text-white mb-1">Description:</h4>
                      <p className="text-sm">{bug.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-1">💡 Clue:</h4>
                      <p className="text-sm text-blue-300">{bug.clue}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-1">⭐ Bonus Challenge:</h4>
                      <p className="text-sm text-yellow-300">{bug.bonus}</p>
                    </div>

                    {bug.solution && (
                      <div>
                        <h4 className="font-medium text-white mb-1">🔧 Solution:</h4>
                        <p className="text-sm text-green-300">{bug.solution}</p>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-[#2A2A2A]">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">🤖 AI Helper Prompt:</h4>
                        <Button
                          onClick={() => copyAIPrompt(bug, bug.id)}
                          disabled={copiedPrompt === bug.id}
                          className={`text-xs ${
                            copiedPrompt === bug.id 
                              ? 'bg-green-600 text-white' 
                              : 'bg-[#7EE787] text-black hover:bg-[#6BD975]'
                          }`}
                          size="sm"
                        >
                          {copiedPrompt === bug.id ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy AI Prompt
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="mt-2 p-3 bg-[#2A2A2A] rounded text-xs text-gray-400 font-mono">
                        <div className="text-gray-300 mb-2">Click &quot;Copy AI Prompt&quot; to get a ready-to-use prompt that includes:</div>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Bug title and description</li>
                          <li>Helpful clues and bonus challenges</li>
                          <li>Your current code</li>
                          <li>Request for corrected code with explanations</li>
                        </ul>
                        <div className="mt-2 text-yellow-400">
                          💡 Paste this prompt into ChatGPT, Claude, or any AI assistant for help!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center text-gray-400 text-sm">
                <p>🎯 Progress: {bugsFixed.length}/{currentTool.bugs.length} bugs fixed ({getCompletionPercentage()}%)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-save</h3>
                <p className="text-sm text-gray-400">Automatically save your code</p>
              </div>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 text-[#7EE787] bg-[#2A2A2A] border-[#2A2A2A] rounded focus:ring-[#7EE787]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show Bug Progress</h3>
                <p className="text-sm text-gray-400">Display inline bug completion progress</p>
              </div>
              <input
                type="checkbox"
                checked={showBugProgress}
                onChange={(e) => setShowBugProgress(e.target.checked)}
                className="w-4 h-4 text-[#7EE787] bg-[#2A2A2A] border-[#2A2A2A] rounded focus:ring-[#7EE787]"
              />
            </div>
            
            <div className="pt-4 border-t border-[#2A2A2A]">
              <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Run Code</span>
                  <span className="font-mono">Ctrl+Enter</span>
                </div>
                <div className="flex justify-between">
                  <span>Reset Code</span>
                  <span className="font-mono">Ctrl+R</span>
                </div>
                <div className="flex justify-between">
                  <span>Split Layout</span>
                  <span className="font-mono">Ctrl+1</span>
                </div>
                <div className="flex justify-between">
                  <span>Editor Only</span>
                  <span className="font-mono">Ctrl+2</span>
                </div>
                <div className="flex justify-between">
                  <span>Preview Only</span>
                  <span className="font-mono">Ctrl+3</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Celebration */}
      <SuccessCelebration
        isVisible={showCelebration}
        message={celebrationMessage}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Debug Overlay */}
      {showDebugOverlay && currentTool && (
        <BugDebugOverlay
          toolId={currentTool.id}
          currentCode={editorCode || currentCode}
          bugs={currentTool.bugs}
          isVisible={showDebugOverlay}
          onClose={() => setShowDebugOverlay(false)}
        />
      )}

      {/* Learning Bridge Panel */}
      {showLearningBridge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Switch Learning Environment
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowLearningBridge(false)}
                className="text-gray-400 hover:text-white"
                size="sm"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <LearningBridge
                currentEnvironment="learning"
                currentCode={editorCode || currentCode}
                onTransition={(targetEnvironment, data) => {
                  if (targetEnvironment === 'sandbox') {
                    // Navigate to sandbox with current code
                    router.push(`/sandbox?code=${encodeURIComponent(data?.code || '')}`)
                  }
                  setShowLearningBridge(false)
                }}
                suggestedChallenges={tools.filter(t => t.id !== currentTool?.id).map(t => ({
                  id: t.id,
                  title: t.title,
                  description: t.description || '',
                  difficulty: t.difficulty as 'beginner' | 'intermediate' | 'advanced',
                  skills: t.tags || [],
                  estimatedTime: t.estimatedTime || 15,
                  bugCount: t.bugs.length
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Celebration */}
      <SuccessCelebration
        isVisible={showCelebration}
        type={celebrationType}
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  )
} 