"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sandpack } from "@codesandbox/sandpack-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, RotateCcw, Terminal, Github, LogOut, Bug, BookOpen, CheckCircle, AlertCircle, Download } from 'lucide-react'
import ProfilePage from '../../../components/profile-page'
import { loadToolsFromJson, fallbackTools, type HomepageTool } from '@/lib/utils/toolLoader'
import { ExportDialog } from '@/components/export-dialog'

type Tool = HomepageTool

export default function ToolPage() {
  const params = useParams()
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>(fallbackTools)
  const [isLoadingTools, setIsLoadingTools] = useState(true)
  const [currentTool, setCurrentTool] = useState<Tool | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [showBugs, setShowBugs] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [sandpackKey, setSandpackKey] = useState(0)
  const [user, setUser] = useState<{username: string, avatar: string, name: string} | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [currentCode, setCurrentCode] = useState('')
  const [bugsFixed, setBugsFixed] = useState<number[]>([])
  const [showSolutions, setShowSolutions] = useState<number[]>([])

  // Load tools from JSON on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        const loadedTools = await loadToolsFromJson()
        if (loadedTools.length > 0) {
          setTools(loadedTools)
        }
      } catch (error) {
        console.error('Failed to load tools from JSON:', error)
        // Keep fallback tools if loading fails
      } finally {
        setIsLoadingTools(false)
      }
    }

    loadTools()
  }, [])

  // Set current tool based on URL slug
  useEffect(() => {
    if (tools.length > 0 && params.slug) {
      console.log('Available tools:', tools.map(t => t.id))
      console.log('Looking for tool with slug:', params.slug)
      const tool = tools.find(t => t.id === params.slug)
      if (tool) {
        console.log('Found tool:', tool.title)
        console.log('Tool broken code:', tool.brokenCode.substring(0, 100) + '...')
        setCurrentTool(tool)
        setCurrentCode(tool.brokenCode)
        setBugsFixed([])
        setShowSolutions([])
      } else {
        console.log('Tool not found, redirecting to home')
        // Tool not found, redirect to home
        router.push('/')
      }
    }
  }, [tools, params.slug, router])

  const resetCode = () => {
    if (currentTool) {
      setCurrentCode(currentTool.brokenCode)
      setBugsFixed([])
      setSandpackKey(prev => prev + 1)
    }
  }

  const runCode = () => {
    if (!currentTool) return

    // Tool-specific bug detection
    const toolId = currentTool.id
    const newBugsFixed: number[] = []

    if (toolId === 'date-calculator') {
      // Bug 1: Check for validation of empty dates
      if (currentCode.includes('if (!startDate || !endDate)') || 
          currentCode.includes('if (!startDate') || 
          currentCode.includes('if (!endDate') ||
          (currentCode.includes('return') && currentCode.includes('Select both dates'))) {
        if (!bugsFixed.includes(1)) {
          newBugsFixed.push(1)
        }
      }
      
      // Bug 2: Check for proper date calculation with Math.abs and Math.ceil
      if (currentCode.includes('Math.abs') && currentCode.includes('Math.ceil')) {
        if (!bugsFixed.includes(2)) {
          newBugsFixed.push(2)
        }
      }
    }

    if (toolId === 'product-name-generator') {
      // Bug 1: Check for proper array mapping instead of just pushing one item
      if (currentCode.includes('suffixes.map') || 
          currentCode.includes('.map(suffix') ||
          (currentCode.includes('newNames') && currentCode.includes('suffixes.map'))) {
        if (!bugsFixed.includes(1)) {
          newBugsFixed.push(1)
        }
      }
    }

    if (toolId === 'receipt-builder') {
      // Bug 1: Check for proper form handling
      if (currentCode.includes('onSubmit') && currentCode.includes('preventDefault')) {
        if (!bugsFixed.includes(1)) {
          newBugsFixed.push(1)
        }
      }
      
      // Bug 2: Check for proper calculation
      if (currentCode.includes('parseFloat') || currentCode.includes('Number(')) {
        if (!bugsFixed.includes(2)) {
          newBugsFixed.push(2)
        }
      }
    }

    if (toolId === 'poll-maker') {
      // Bug 1: Check for proper state updates
      if (currentCode.includes('setVotes') && currentCode.includes('prev =>')) {
        if (!bugsFixed.includes(1)) {
          newBugsFixed.push(1)
        }
      }
      
      // Bug 2: Check for proper event handling
      if (currentCode.includes('onClick') && currentCode.includes('handleVote')) {
        if (!bugsFixed.includes(2)) {
          newBugsFixed.push(2)
        }
      }
    }

    if (toolId === 'bio-generator') {
      // Bug 1: Check for random selection instead of always using first item
      if (currentCode.includes('Math.floor(Math.random()') || 
          currentCode.includes('Math.random() * names.length') ||
          currentCode.includes('Math.random() * jobs.length') ||
          currentCode.includes('Math.random() * hobbies.length')) {
        if (!bugsFixed.includes(1)) {
          newBugsFixed.push(1)
        }
      }
      
      // Bug 2: Check for expanded arrays (more variety)
      if (currentCode.includes('Morgan') || currentCode.includes('Riley') || 
          currentCode.includes('Quinn') || currentCode.includes('Doctor') || 
          currentCode.includes('Writer') || currentCode.includes('Musician')) {
        if (!bugsFixed.includes(2)) {
          newBugsFixed.push(2)
        }
      }
    }

    // Update bugs fixed state and show notifications
    if (newBugsFixed.length > 0) {
      setBugsFixed(prev => [...prev, ...newBugsFixed])
      
      // Show notification for each fixed bug
      newBugsFixed.forEach(bugId => {
        const bug = currentTool.bugs.find(b => b.id === bugId)
        if (bug) {
          // Create a simple notification
          const notification = document.createElement('div')
          notification.className = 'fixed top-4 right-4 bg-[#7EE787] text-black px-4 py-2 rounded-md shadow-lg z-50 animate-in slide-in-from-right'
          notification.innerHTML = `
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-medium">Bug Fixed: ${bug.title}</span>
            </div>
          `
          document.body.appendChild(notification)
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            notification.remove()
          }, 3000)
        }
      })
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
    }, 1500)
  }

  const handleLogout = () => {
    setUser(null)
  }



  const toggleSolution = (bugId: number) => {
    setShowSolutions(prev => 
      prev.includes(bugId) 
        ? prev.filter(id => id !== bugId)
        : [...prev, bugId]
    )
  }

  // Get component name from tool ID
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
    console.log('Current tool is null, showing not found page')
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

  console.log('Rendering tool page with currentTool:', currentTool?.title, 'currentCode length:', currentCode.length)
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-[#1E1E1E] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white hover:bg-[#1E1E1E] text-xs sm:text-sm shrink-0"
              size="sm"
            >
              ← <span className="hidden sm:inline">Back to Studio</span><span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold truncate">{currentTool.title}</h1>
                <Badge className="bg-[#7EE787] text-black font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm shrink-0">
                  {currentTool.difficulty}
                </Badge>
                <Badge className="bg-yellow-500 text-black font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm shrink-0">
                  {bugsFixed.length}/{currentTool.bugs.length} Fixed
                </Badge>
              </div>
              <p className="text-gray-400 mt-1 text-sm sm:text-base hidden md:block">{currentTool.description}</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-[#1E1E1E] rounded-full cursor-pointer hover:bg-[#2A2A2A] shrink-0" onClick={() => setShowProfile(true)}>
              <img 
                src={user.avatar || "/placeholder.svg"} 
                alt={user.username}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
              />
              <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Split View */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)]">
        {/* Left Panel - Code Editor */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#1E1E1E] h-1/2 lg:h-full">
          <Sandpack
            key={`${currentTool.id}-${sandpackKey}`}
            template="react"
                            files={{
                  "/App.js": {
                    code: (() => {
                      const cleanedCode = currentCode.replace(/export default.*;?\s*$/, '')
                      const componentName = getComponentName(currentTool.id)
                      const finalCode = `${cleanedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
                      console.log('Generated Sandpack code:', finalCode.substring(0, 200) + '...')
                      return finalCode
                    })(),
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
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: "calc(50vh - 70px)",
                layout: "preview",
                editorWidthPercentage: 100
              }}
            customSetup={{
              dependencies: {
                "react": "^18.0.0",
                "react-dom": "^18.0.0"
              }
            }}
          />
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-full lg:w-1/2 bg-[#1E1E1E] h-1/2 lg:h-full">
          <div className="h-full">
            <Sandpack
              key={`preview-${currentTool.id}-${sandpackKey}`}
              template="react"
              files={{
                "/App.js": {
                  code: (() => {
                    const cleanedCode = currentCode.replace(/export default.*;?\s*$/, '')
                    const componentName = getComponentName(currentTool.id)
                    const finalCode = `${cleanedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
                    return finalCode
                  })(),
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
                editorHeight: "calc(50vh - 70px)",
                layout: "preview",
                editorWidthPercentage: 0
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

      {/* Bottom Dock */}
      <div className="border-t border-[#1E1E1E] bg-[#1E1E1E] px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              onClick={runCode}
              className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium px-3 sm:px-4 py-2 text-sm"
              size="sm"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Run
            </Button>
            <Button
              variant="outline"
              onClick={resetCode}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-3 sm:px-4 py-2 text-sm"
              size="sm"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Reset
            </Button>
            
            <Dialog open={showBugs} onOpenChange={setShowBugs}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Bugs ({bugsFixed.length}/{currentTool.bugs.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Bugs to Fix</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentTool.bugs.map((bug) => (
                    <div key={bug.id} className="border border-[#2A2A2A] rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{bug.title}</h3>
                          <p className="text-gray-300 mb-3">{bug.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-400">Clue:</span>
                              <p className="text-sm text-gray-300">{bug.clue}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-400">Bonus:</span>
                              <p className="text-sm text-gray-300">{bug.bonus}</p>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => toggleSolution(bug.id)}
                              className="text-[#7EE787] hover:text-[#6BD975] p-0 h-auto"
                            >
                              {showSolutions.includes(bug.id) ? 'Hide Solution' : 'Show Solution'}
                            </Button>
                            {showSolutions.includes(bug.id) && (
                              <div className="mt-2 p-3 bg-[#2A2A2A] rounded border-l-4 border-[#7EE787]">
                                <p className="text-sm text-gray-300">{bug.solution}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {bugsFixed.includes(bug.id) ? (
                            <CheckCircle className="h-6 w-6 text-[#7EE787]" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConsole(!showConsole)}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Console
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNotes(!showNotes)}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Notes
            </Button>
            
            <ExportDialog
              code={currentCode}
              componentName={getComponentName(currentTool.id)}
              toolTitle={currentTool.title}
              trigger={
                <Button
                  variant="outline"
                  className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              }
            />
            {!user ? (
              <Button
                onClick={handleGitHubLogin}
                disabled={isLoggingIn}
                className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium px-4 py-2"
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 