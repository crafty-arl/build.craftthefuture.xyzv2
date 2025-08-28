"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sandpack } from "@codesandbox/sandpack-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Target, 
  Beaker, 
  Code2,
  Bug,
  Lightbulb,
  ChevronDown,
  Zap,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react'

// Core types for the unified IDE
interface IDEMode {
  id: 'guided' | 'practice' | 'explore'
  name: string
  description: string
  icon: React.ReactNode
  color: string
  features: {
    bugDetection: boolean
    progressTracking: boolean
    templates: boolean
    hints: boolean
    realTimeFeedback: boolean
    exportFeatures: boolean
    saveLoad: boolean
  }
  ui: {
    showBugPanel: boolean
    showProgressBar: boolean
    showHints: boolean
    layoutOptions: boolean
    advancedTools: boolean
  }
}

interface UserContext {
  experience: 'beginner' | 'intermediate' | 'advanced'
  currentChallenge?: string
  codeSource: 'challenge' | 'template' | 'scratch' | 'import'
  sessionTime: number
  hasActiveChallenges: boolean
  previousSessions: number
}

// Challenge data interface
interface ChallengeBug {
  id: number
  title: string
  description: string
  clue: string
  bonus: string
  difficulty: string
  category: string
  points: number
  hints: string[]
  solution: string
}

interface ChallengeTool {
  id: string
  title: string
  description: string
  longDescription: string
  difficulty: string
  estimatedTime: number
  bugs: ChallengeBug[]
  requirements: string[]
  learningObjectives: string[]
}

interface UnifiedIDEProps {
  initialMode?: 'guided' | 'practice' | 'explore'
  challengeId?: string
  initialCode?: string
  challengeTool?: ChallengeTool
  className?: string
  availableTools?: ChallengeTool[]
  onToolChange?: (toolId: string) => void
}

// Mode configurations
const IDE_MODES: Record<string, IDEMode> = {
  guided: {
    id: 'guided',
    name: 'Guided Learning',
    description: 'Structured challenges with real-time feedback and hints',
    icon: <Target className="h-4 w-4" />,
    color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    features: {
      bugDetection: true,
      progressTracking: true,
      templates: false,
      hints: true,
      realTimeFeedback: true,
      exportFeatures: true,
      saveLoad: true
    },
    ui: {
      showBugPanel: true,
      showProgressBar: true,
      showHints: true,
      layoutOptions: false,
      advancedTools: false
    }
  },
  practice: {
    id: 'practice',
    name: 'Practice Mode',
    description: 'Template-based learning with optional guidance',
    icon: <Code2 className="h-4 w-4" />,
    color: 'bg-green-500/10 text-green-400 border-green-400/20',
    features: {
      bugDetection: false,
      progressTracking: false,
      templates: true,
      hints: false,
      realTimeFeedback: false,
      exportFeatures: true,
      saveLoad: true
    },
    ui: {
      showBugPanel: false,
      showProgressBar: false,
      showHints: false,
      layoutOptions: true,
      advancedTools: true
    }
  },
  explore: {
    id: 'explore',
    name: 'Free Exploration',
    description: 'Complete freedom for experimentation and prototyping',
    icon: <Beaker className="h-4 w-4" />,
    color: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    features: {
      bugDetection: false,
      progressTracking: false,
      templates: true,
      hints: false,
      realTimeFeedback: false,
      exportFeatures: true,
      saveLoad: true
    },
    ui: {
      showBugPanel: false,
      showProgressBar: false,
      showHints: false,
      layoutOptions: true,
      advancedTools: true
    }
  }
}

export function UnifiedIDE({
  initialMode,
  challengeId,
  initialCode = '',
  challengeTool,
  className = '',
  availableTools,
  onToolChange
}: UnifiedIDEProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // DEBUG: Log all incoming props
  console.log('🔍 UnifiedIDE Debug - Props:', {
    initialMode,
    challengeId,
    initialCode: initialCode ? `${initialCode.substring(0, 100)}...` : 'empty',
    challengeTool: challengeTool ? {
      id: challengeTool.id,
      title: challengeTool.title,
      bugsCount: challengeTool.bugs.length
    } : 'none',
    className
  })
  
  // Core IDE state
  const [currentMode, setCurrentMode] = useState<IDEMode>(
    IDE_MODES[initialMode || 'guided']
  )
  const [code, setCode] = useState(initialCode)
  const [sandpackKey, setSandpackKey] = useState(0)
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [showToolSelector, setShowToolSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  
  // Save state and bug checking
  const [savedCode, setSavedCode] = useState<string>('')
  const [isCodeSaved, setIsCodeSaved] = useState(false)
  const [bugCheckResults, setBugCheckResults] = useState<Array<{
    bugId: number
    title: string
    passed: boolean
    message: string
  }>>([])
  const [showBugResults, setShowBugResults] = useState(false)
  
  // User context for smart recommendations
  const [userContext, setUserContext] = useState<UserContext>({
    experience: 'beginner',
    codeSource: challengeId ? 'challenge' : 'scratch',
    sessionTime: 0,
    hasActiveChallenges: !!challengeId,
    previousSessions: 0
  })
  
  // DEBUG: Log initial state
  console.log('🔍 UnifiedIDE Debug - Initial State:', {
    currentMode: currentMode.id,
    codeLength: code.length,
    challengeId,
    hasActiveChallenges: !!challengeId,
    userContext
  })

  // Smart mode detection
  const detectOptimalMode = useCallback((context: UserContext): IDEMode => {
    console.log('🔍 UnifiedIDE Debug - detectOptimalMode called with context:', context)
    
    // If user has an active challenge, always suggest guided mode
    if (context.hasActiveChallenges && context.codeSource === 'challenge') {
      console.log('🔍 UnifiedIDE Debug - Detected challenge context, suggesting guided mode')
      return IDE_MODES.guided
    }
    
    // For beginners with no specific task, suggest practice mode
    if (context.experience === 'beginner' && context.codeSource === 'scratch') {
      console.log('🔍 UnifiedIDE Debug - Detected beginner scratch context, suggesting practice mode')
      return IDE_MODES.practice
    }
    
    // For experienced users or template-based work, suggest explore mode
    if (context.experience === 'advanced' || context.codeSource === 'template') {
      console.log('🔍 UnifiedIDE Debug - Detected advanced/template context, suggesting explore mode')
      return IDE_MODES.explore
    }
    
    // Default to practice mode as safe middle ground
    console.log('🔍 UnifiedIDE Debug - No specific context detected, defaulting to practice mode')
    return IDE_MODES.practice
  }, [])

  // Initialize mode based on context
  useEffect(() => {
    console.log('🔍 UnifiedIDE Debug - Mode initialization useEffect triggered:', {
      initialMode,
      userContext,
      currentMode: currentMode.id
    })
    
    if (!initialMode) {
      console.log('🔍 UnifiedIDE Debug - No initialMode provided, detecting optimal mode')
      const optimalMode = detectOptimalMode(userContext)
      console.log('🔍 UnifiedIDE Debug - Optimal mode detected:', optimalMode.id)
      setCurrentMode(optimalMode)
    } else {
      console.log('🔍 UnifiedIDE Debug - Using provided initialMode:', initialMode)
    }
  }, [userContext, initialMode, detectOptimalMode])

  // Track session time for context
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setUserContext(prev => ({
        ...prev,
        sessionTime: Date.now() - startTime
      }))
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const handleModeChange = (modeId: string) => {
    const newMode = IDE_MODES[modeId]
    if (newMode) {
      setCurrentMode(newMode)
      setShowModeSelector(false)
      
      // Update URL to reflect mode change
      const newUrl = new URLSearchParams(searchParams)
      newUrl.set('mode', modeId)
      router.replace(`?${newUrl.toString()}`, { scroll: false })
    }
  }

  const handleToolChange = (toolId: string) => {
    if (onToolChange) {
      onToolChange(toolId)
    }
    setShowToolSelector(false)
    
    // Clear current state when switching tools
    setSavedCode('')
    setIsCodeSaved(false)
    setBugCheckResults([])
    setShowBugResults(false)
    setError(null)
  }

  const runCode = () => {
    setIsLoading(true)
    setError(null)
    
    // Simulate code execution
    setTimeout(() => {
      setIsLoading(false)
    setSandpackKey(prev => prev + 1)
    }, 500)
  }

  // Check if bugs have been fixed
  const checkBugs = () => {
    if (!challengeTool || !challengeTool.bugs || !savedCode) {
      setError('Please save your code first before checking bugs')
      return
    }

    setIsLoading(true)
    setError(null)
    
    // Simulate bug checking process
    setTimeout(() => {
      const results = challengeTool.bugs.map(bug => {
        // Basic bug detection logic - this would be enhanced with actual code analysis
        let passed = false
        let message = ''
        
        // Check for common bug patterns based on bug description
        if (bug.title.toLowerCase().includes('crash') || bug.title.toLowerCase().includes('undefined')) {
          // Check if the code handles undefined/null cases
          passed = !savedCode.includes('undefined') && 
                   savedCode.includes('if') && 
                   savedCode.includes('?') || 
                   savedCode.includes('||')
        } else if (bug.title.toLowerCase().includes('output') || bug.title.toLowerCase().includes('nothing')) {
          // Check if the code has proper return statements and rendering
          passed = savedCode.includes('return') && 
                   (savedCode.includes('jsx') || savedCode.includes('<div>') || savedCode.includes('<p>'))
        } else if (bug.title.toLowerCase().includes('function') || bug.title.toLowerCase().includes('method')) {
          // Check if functions are properly defined and called
          passed = savedCode.includes('function') && 
                   savedCode.includes('(') && 
                   savedCode.includes(')')
        } else {
          // Default check - look for common React patterns
          passed = savedCode.includes('useState') && 
                   savedCode.includes('export default') &&
                   savedCode.includes('return')
        }
        
        message = passed 
          ? `✅ Bug appears to be fixed! Code follows good practices.`
          : `❌ Bug may still exist. Check: ${bug.clue}`
        
        return {
          bugId: bug.id,
          title: bug.title,
          passed,
          message
        }
      })
      
      setBugCheckResults(results)
      setShowBugResults(true)
      setIsLoading(false)
      
      // Calculate overall progress
      const passedBugs = results.filter(r => r.passed).length
      const totalBugs = results.length
      console.log(`Bug Check Results: ${passedBugs}/${totalBugs} bugs passed`)
      
    }, 1000)
  }

  const resetCode = () => {
    setCode(initialCode)
    setSandpackKey(prev => prev + 1)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  // Save current code for bug checking
  const saveCode = () => {
    setSavedCode(code)
    setIsCodeSaved(true)
    setError(null)
    setBugCheckResults([])
    setShowBugResults(false)
    
    // Show success message
    setTimeout(() => {
      setIsCodeSaved(false)
    }, 2000)
  }

  // Generate AI prompt for debugging assistance
  const generateAIPrompt = (): string => {
    if (!challengeTool) {
      return `I'm working on a React coding challenge but I need help debugging my code. Here's my current code:\n\n${currentCode}\n\nCan you help me identify and fix any issues?`
    }

    const prompt = `I'm working on a React coding challenge called "${challengeTool.title}" and I need help debugging my code.

CHALLENGE CONTEXT:
- Title: ${challengeTool.title}
- Description: ${challengeTool.description}
- Difficulty: ${challengeTool.difficulty}
- Estimated Time: ${challengeTool.estimatedTime} minutes

BUGS TO FIX:
${challengeTool.bugs?.map(bug => `- ${bug.title}: ${bug.description}`).join('\n') || 'No specific bugs listed'}

REQUIREMENTS:
${challengeTool.requirements?.map(req => `- ${req}`).join('\n') || 'No specific requirements listed'}

LEARNING OBJECTIVES:
${challengeTool.learningObjectives?.map(obj => `- ${obj}`).join('\n') || 'No specific learning objectives listed'}

MY CURRENT CODE:
\`\`\`jsx
${currentCode}
\`\`\`

Please help me:
1. Identify any bugs or issues in my code
2. Explain what's causing the problems
3. Provide the corrected code
4. Explain the fixes so I can learn from them

I'm trying to learn React debugging, so please be educational in your explanation.`

    return prompt
  }

  // Copy AI prompt to clipboard
  const copyAIPrompt = async () => {
    try {
      const prompt = generateAIPrompt()
      await navigator.clipboard.writeText(prompt)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch (error) {
      console.error('Failed to copy prompt:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generateAIPrompt()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    }
  }

  // Default React component code
  const defaultCode = `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to BUILD!</h1>
      <p>You're in Guided Learning mode.</p>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;`

  // Ensure the component code is properly formatted for Sandpack
  const formatComponentCode = (code: string): string => {
    if (!code) return defaultCode
    
    // If the code already has a default export, use it as is
    if (code.includes('export default')) {
      return code
    }
    
    // If it's a function component without export, add the export
    if (code.includes('function ') && !code.includes('export default')) {
      const functionName = code.match(/function\s+(\w+)/)?.[1]
      if (functionName) {
        return code + `\n\nexport default ${functionName};`
      }
    }
    
    return code
  }
  
  const currentCode = formatComponentCode(code || defaultCode)
  
  // DEBUG: Log render state
  console.log('🔍 UnifiedIDE Debug - Render state:', {
    currentMode: currentMode.id,
    codeLength: currentCode.length,
    showBugPanel: currentMode.ui.showBugPanel,
    showHints: currentMode.ui.showHints,
    showProgressBar: currentMode.ui.showProgressBar,
    challengeId,
    hasActiveChallenges: !!challengeId
  })

  return (
    <div className={`min-h-screen bg-[#121212] text-white ${className}`}>
             {/* Challenge Header */}
       {challengeTool && challengeTool.title && challengeTool.description && (
         <div className="bg-[#1E1E1E] border-b border-[#2A2A2A] px-4 py-3">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => router.push('/')}
                 className="text-gray-400 hover:text-white"
               >
                 ← Back to Challenges
               </Button>
               <div className="h-4 w-px bg-[#2A2A2A]" />
               <div>
                 <h2 className="font-medium text-white">{challengeTool.title}</h2>
                 <p className="text-xs text-gray-400">{challengeTool.description}</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <Badge className="text-xs bg-blue-500 text-white">
                 {challengeTool.difficulty || 'Unknown'}
               </Badge>
               <Badge variant="outline" className="text-xs border-[#2A2A2A] text-gray-400">
                 {challengeTool.bugs ? challengeTool.bugs.length : 0} bugs
               </Badge>
             </div>
           </div>
         </div>
       )}

      {/* Adaptive Header */}
      <div className="border-b border-[#1E1E1E] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Back button moved to challenge header when challenge is active */}
            
                         {/* Tool Selector */}
             {availableTools && availableTools.length > 0 && (
               <div className="relative">
                 <Button
                   variant="outline"
                   onClick={() => setShowToolSelector(!showToolSelector)}
                   className="border-[#2A2A2A] text-white hover:bg-[#252525] font-medium text-sm"
                   size="sm"
                   aria-label="Select challenge tool"
                   aria-expanded={showToolSelector}
                 >
                   <span className="flex items-center gap-2">
                     <Target className="h-4 w-4 text-[#7EE787]" />
                     {challengeTool ? challengeTool.title : 'Select Tool'}
                     <ChevronDown className="h-3 w-3" />
                   </span>
                 </Button>
                 
                 {showToolSelector && (
                   <div className="absolute top-full left-0 mt-2 w-80 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                     <div className="p-4">
                       <h3 className="text-sm font-medium text-white mb-3">Choose Challenge</h3>
                       <div className="space-y-2">
                         {availableTools.map((tool) => (
                           <button
                             key={tool.id}
                             onClick={() => handleToolChange(tool.id)}
                             className={`w-full text-left p-3 rounded border transition-colors ${
                               challengeTool?.id === tool.id
                                 ? 'border-[#7EE787] bg-[#7EE787]/10'
                                 : 'border-[#2A2A2A] hover:border-[#7EE787]'
                             }`}
                             aria-label={`Switch to ${tool.title} challenge`}
                           >
                             <div className="flex items-center justify-between mb-1">
                               <span className="font-medium text-white">{tool.title}</span>
                               <Badge variant="outline" className="text-xs border-[#2A2A2A] text-gray-400">
                                 {tool.difficulty}
                               </Badge>
                             </div>
                             <p className="text-xs text-gray-400 mb-2">{tool.description}</p>
                             <div className="flex items-center gap-4 text-xs text-gray-500">
                               <span>{tool.estimatedTime} min</span>
                               <span>•</span>
                               <span>{tool.bugs.length} bugs</span>
                             </div>
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             )}

             {/* Mode Selector */}
             <div className="relative">
               <Button
                 variant="outline"
                 onClick={() => setShowModeSelector(!showModeSelector)}
                 className={`${currentMode.color} border font-medium text-sm`}
                 size="sm"
                 aria-label="Select IDE mode"
                 aria-expanded={showModeSelector}
               >
                 <span className="flex items-center gap-2">
                   {currentMode.icon}
                   {currentMode.name}
                   <ChevronDown className="h-3 w-3" />
                 </span>
               </Button>
               
                                {showModeSelector && (
                   <div className="absolute top-full left-0 mt-2 w-80 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-lg z-50">
                     <div className="p-4">
                       <h3 className="text-sm font-medium text-white mb-3">Choose Your Experience</h3>
                       <div className="space-y-2">
                         {Object.values(IDE_MODES).map((mode) => (
                           <button
                             key={mode.id}
                             onClick={() => handleModeChange(mode.id)}
                             className={`w-full text-left p-3 rounded border transition-colors ${
                               currentMode.id === mode.id
                                 ? 'border-[#7EE787] bg-[#7EE787]/10'
                                 : 'border-[#2A2A2A] hover:border-[#7EE787]'
                             }`}
                             aria-label={`Switch to ${mode.name} mode`}
                           >
                             <div className="flex items-center gap-2 mb-1">
                               {mode.icon}
                               <span className="font-medium text-white">{mode.name}</span>
                             </div>
                             <p className="text-xs text-gray-400">{mode.description}</p>
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}
             </div>

            {/* Contextual Mode Description */}
            <div className="hidden md:block">
              <p className="text-sm text-gray-400">{currentMode.description}</p>
            </div>
          </div>

          {/* Adaptive Tools */}
          <div className="flex items-center gap-2">
            {/* Mode-specific tools would go here */}
            {currentMode.ui.advancedTools && (
              <Button
                variant="outline"
                size="sm"
                className="border-[#2A2A2A] text-gray-400 hover:text-white text-sm"
                aria-label="Advanced settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Adaptive IDE Interface */}
      <div className="flex h-[calc(100vh-140px)]">
        <div className="flex-1">
          <Sandpack
            key={`ide-${sandpackKey}`}
            template="react"
            files={{
              "/App.js": {
                code: currentCode,
                active: true
              },
              "/index.js": {
                code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
                hidden: true
              }
            }}
            theme="dark"
            options={{
              showNavigator: false,
              showTabs: false,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true
            }}
            customSetup={{
              dependencies: {
                "react": "^18.0.0",
                "react-dom": "^18.0.0"
              }
            }}
          />
        </div>

                 {/* Adaptive Side Panel */}
         {(currentMode.ui.showBugPanel || currentMode.ui.showHints) && (
           <div className="w-80 border-l border-[#1E1E1E] bg-[#1A1A1A] overflow-y-auto">
             {/* Loading State */}
             {!challengeTool && (
               <div className="p-4 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7EE787] mx-auto mb-3"></div>
                 <p className="text-sm text-gray-400">Loading challenge...</p>
            </div>
             )}
             
             {/* No Challenge State */}
             {challengeTool === null && (
               <div className="p-4 text-center">
                 <Target className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                 <p className="text-sm text-gray-400">No challenge selected</p>
                 <p className="text-xs text-gray-500 mt-1">Choose a challenge from the homepage</p>
               </div>
             )}
                         {/* Challenge Header */}
             {challengeTool && challengeTool.title && challengeTool.description && (
               <div className="p-4 border-b border-[#2A2A2A]">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                     <Target className="h-4 w-4 text-[#7EE787]" />
                     <h3 className="font-medium text-white">{challengeTool.title}</h3>
                   </div>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={copyAIPrompt}
                     className="border-[#2A2A2A] text-gray-400 hover:bg-[#7EE787] hover:border-[#7EE787] hover:text-black text-xs px-2 py-1"
                     aria-label="Copy AI prompt for debugging assistance"
                   >
                     {copiedPrompt ? (
                       <Check className="h-3 w-3 mr-1" />
                     ) : (
                       <Copy className="h-3 w-3 mr-1" />
                     )}
                     {copiedPrompt ? 'Copied!' : 'AI Help'}
                   </Button>
                 </div>
                 <p className="text-sm text-gray-400 mb-3">{challengeTool.description}</p>
                 <div className="flex items-center gap-2 text-xs text-gray-500">
                   <span>Difficulty: {challengeTool.difficulty || 'Unknown'}</span>
                   <span>•</span>
                   <span>{challengeTool.estimatedTime || 'Unknown'} min</span>
                   <span>•</span>
                   <span>{challengeTool.bugs ? challengeTool.bugs.length : 0} bugs</span>
                 </div>
                 
                                   {/* AI Help Info */}
                  <div className="mt-3 p-2 bg-[#7EE787]/10 border border-[#7EE787]/20 rounded text-xs text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="h-3 w-3 text-[#7EE787]" />
                      <span className="text-[#7EE787] font-medium">AI Debugging Assistant</span>
      </div>
                    <p>Click "AI Help" to copy a detailed prompt for AI tools like ChatGPT, Claude, or Copilot. The prompt includes your challenge context, current code, and specific bugs to fix.</p>
    </div>

                  {/* Save & Check Workflow Info */}
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-blue-500 font-medium">Bug Testing Workflow</span>
            </div>
                    <p>1. <strong>Save Code</strong> - Save your current code when ready to test<br/>
                    2. <strong>Check Bugs</strong> - Test if your fixes resolved the bugs<br/>
                    3. <strong>Review Results</strong> - See which bugs passed/failed</p>
          </div>
        </div>
             )}
            
                         {/* Bug Detection Panel */}
             {currentMode.ui.showBugPanel && challengeTool && challengeTool.bugs && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bug className="h-4 w-4 text-yellow-500" />
                   <h3 className="font-medium text-white">Bugs to Fix</h3>
                 </div>
                 <div className="space-y-4">
                   {challengeTool.bugs.map((bug, index) => (
                     <div key={bug.id} className="p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
                       <div className="flex items-center justify-between mb-2">
                         <h4 className="font-medium text-white text-sm">{bug.title}</h4>
                         <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                           {bug.points} pts
                         </Badge>
                       </div>
                       <p className="text-xs text-gray-400 mb-2">{bug.description}</p>
                       <div className="space-y-2">
                         <div className="text-xs">
                           <span className="text-yellow-400 font-medium">Clue:</span>
                           <span className="text-gray-300 ml-1">{bug.clue}</span>
                         </div>
                         {bug.bonus && (
                           <div className="text-xs">
                             <span className="text-[#7EE787] font-medium">Bonus:</span>
                             <span className="text-gray-300 ml-1">{bug.bonus}</span>
                           </div>
                         )}
                       </div>
                </div>
                   ))}
                </div>
              </div>
            )}
            
                         {/* Hints Panel */}
             {currentMode.ui.showHints && challengeTool && challengeTool.requirements && challengeTool.learningObjectives && (
              <div className="p-4 border-t border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                   <h3 className="font-medium text-white">Hints & Help</h3>
                 </div>
                 
                 {/* Requirements */}
                 <div className="mb-4">
                   <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
                   <ul className="space-y-1">
                     {challengeTool.requirements && challengeTool.requirements.length > 0 ? (
                       challengeTool.requirements.map((req, index) => (
                         <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-[#7EE787] rounded-full"></div>
                           {req}
                         </li>
                       ))
                     ) : (
                       <li className="text-xs text-gray-500">No requirements specified</li>
                     )}
                   </ul>
                 </div>
                 
                 {/* Learning Objectives */}
                 <div className="mb-4">
                   <h4 className="text-sm font-medium text-white mb-2">Learning Objectives</h4>
                   <ul className="space-y-1">
                     {challengeTool.learningObjectives && challengeTool.learningObjectives.length > 0 ? (
                       challengeTool.learningObjectives.map((obj, index) => (
                         <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                           {obj}
                         </li>
                       ))
                     ) : (
                       <li className="text-xs text-gray-500">No learning objectives specified</li>
                     )}
                   </ul>
                 </div>
                 
                 {/* Bug Hints */}
                 {challengeTool.bugs && challengeTool.bugs.length > 0 && (
                   <div>
                     <h4 className="text-sm font-medium text-white mb-2">Bug Hints</h4>
                     <div className="space-y-2">
                       {challengeTool.bugs.map((bug, index) => (
                         <details key={bug.id} className="text-xs">
                           <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                             {bug.title} - Click for hints
                           </summary>
                           <div className="mt-2 pl-3 space-y-1">
                             {bug.hints && bug.hints.map((hint, hintIndex) => (
                               <div key={hintIndex} className="text-gray-400">
                                 💡 {hint}
                               </div>
                             ))}
                </div>
                         </details>
                       ))}
                </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adaptive Bottom Dock */}
      <div className="border-t border-[#1E1E1E] bg-[#1E1E1E] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
                       {/* Save Code Button */}
                       <Button
                         variant="outline"
                         onClick={saveCode}
                         className={`border-[#2A2A2A] text-white hover:bg-[#7EE787] hover:border-[#7EE787] hover:text-black transition-all duration-200 ${
                           isCodeSaved ? 'bg-[#7EE787] text-black border-[#7EE787]' : ''
                         }`}
                         disabled={isLoading}
                         aria-label="Save current code for bug checking"
                       >
                         {isCodeSaved ? (
                           <Check className="h-4 w-4 mr-2" />
                           ) : (
                           <Copy className="h-4 w-4 mr-2" />
                         )}
                         {isCodeSaved ? 'Code Saved!' : 'Save Code'}
                       </Button>

                       {/* Run & Check Button */}
            <Button
                         onClick={currentMode.features.bugDetection ? checkBugs : runCode}
              className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium"
                         disabled={isLoading || (currentMode.features.bugDetection && !savedCode)}
                         aria-label={currentMode.features.bugDetection ? 'Check if bugs have been fixed' : 'Run code'}
            >
                         {isLoading ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                         ) : (
              <Play className="h-4 w-4 mr-2" />
                         )}
                         {currentMode.features.bugDetection ? 'Check Bugs' : 'Run'}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetCode}
              className="border-[#2A2A2A] text-white hover:bg-[#252525]"
                         aria-label="Reset code to original state"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

                       {/* Copy AI Prompt Button */}
                       <Button
                         variant="outline"
                         onClick={copyAIPrompt}
                         className="border-[#2A2A2A] text-white hover:bg-[#7EE787] hover:border-[#7EE787] hover:text-black transition-all duration-200"
                         aria-label="Copy AI prompt for debugging assistance"
                       >
                         {copiedPrompt ? (
                           <Check className="h-4 w-4 mr-2" />
                         ) : (
                           <Copy className="h-4 w-4 mr-2" />
                         )}
                         {copiedPrompt ? 'Copied!' : 'Copy AI Prompt'}
                       </Button>
          </div>

          {/* Mode-specific status */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={currentMode.color}>
              {currentMode.name}
            </Badge>
                         {currentMode.ui.showProgressBar && challengeTool && challengeTool.bugs && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                 <span>Progress: {bugCheckResults.length > 0 ? Math.round((bugCheckResults.filter(r => r.passed).length / bugCheckResults.length) * 100) : 0}%</span>
                <div className="w-16 bg-gray-700 rounded-full h-2">
                   <div 
                     className="bg-[#7EE787] h-2 rounded-full transition-all duration-500"
                     style={{
                       width: `${bugCheckResults.length > 0 ? (bugCheckResults.filter(r => r.passed).length / bugCheckResults.length) * 100 : 0}%`
                     }}
                   ></div>
                </div>
                 <span className="text-xs">
                   ({bugCheckResults.length > 0 ? challengeTool.bugs.length - bugCheckResults.filter(r => r.passed).length : challengeTool.bugs.length} bugs remaining)
                 </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Bug Check Results */}
        {showBugResults && bugCheckResults.length > 0 && (
          <div className="mt-3 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Bug Check Results</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBugResults(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                × Close
              </Button>
            </div>
            
            <div className="space-y-3">
              {bugCheckResults.map((result) => (
                <div
                  key={result.bugId}
                  className={`p-3 rounded-lg border ${
                    result.passed
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`text-sm font-medium ${
                      result.passed ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.title}
                    </h5>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        result.passed
                          ? 'border-green-500/30 text-green-400'
                          : 'border-red-500/30 text-red-400'
                      }`}
                    >
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-300">{result.message}</p>
                </div>
              ))}
            </div>
            
            {/* Progress Summary */}
            <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Overall Progress:</span>
                <span className="text-white font-medium">
                  {bugCheckResults.filter(r => r.passed).length} / {bugCheckResults.length} bugs fixed
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#7EE787] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(bugCheckResults.filter(r => r.passed).length / bugCheckResults.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

             {/* Click outside to close dropdowns */}
       {(showModeSelector || showToolSelector) && (
         <div
           className="fixed inset-0 z-40"
           onClick={() => {
             setShowModeSelector(false)
             setShowToolSelector(false)
           }}
         />
       )}
    </div>
  )
}