"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Bug, ArrowRight, Code2, Calendar, User, Zap, CheckCircle, Target, Trophy, Lightbulb, Clock } from 'lucide-react'
import ProfilePage from '../components/profile-page'
import { loadToolsFromJson, fallbackTools, type HomepageTool } from '@/lib/utils/toolLoader'
import { OnboardingModal } from '@/components/onboarding-modal'

type Tool = HomepageTool

export default function BuildPlatform() {
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>(fallbackTools)

  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState<{username: string, avatar: string, name: string} | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

    // Load tools from JSON on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        const loadedTools = await loadToolsFromJson()
        console.log('Loaded tools:', loadedTools.map(t => ({ id: t.id, title: t.title })))
        if (loadedTools.length > 0) {
          setTools(loadedTools)
        }
      } catch (error) {
        console.error('Failed to load tools from JSON:', error)
        // Keep fallback tools if loading fails
      }
    }

    loadTools()

    // Check if user has seen onboarding
    const hasSeenOnboardingBefore = localStorage.getItem('build-onboarding-seen')
    if (!hasSeenOnboardingBefore && !user) {
      setTimeout(() => setShowOnboarding(true), 1000) // Show after 1 second
    }
    setHasSeenOnboarding(!!hasSeenOnboardingBefore)
  }, [])

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

  const handleOnboardingComplete = () => {
    localStorage.setItem('build-onboarding-seen', 'true')
    setHasSeenOnboarding(true)
    setShowOnboarding(false)
  }

  const handleShowOnboarding = () => {
    setShowOnboarding(true)
  }



  const selectTool = (tool: Tool) => {
    // Route to unified IDE with guided mode for challenges
    router.push(`/code?mode=guided&challenge=${tool.id}`)
  }

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />
  }

  // Main Studio View
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground animate-slide-up">
      {/* Header */}
      <div className="border-b border-[#1E1E1E] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#7EE787] shrink-0" />
            <span className="text-base sm:text-lg font-bold truncate">/build</span>
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="/font-test" 
                className="text-xs text-gray-400 hover:text-[#7EE787] transition-colors"
                title="Test font accessibility"
              >
                Test Fonts
              </a>
              <a 
                href="/code?mode=explore" 
                className="text-xs text-gray-400 hover:text-[#7EE787] transition-colors"
                title="Code Editor - All modes available"
              >
                Code Editor
              </a>
            </div>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-1 text-gray-400 hover:text-[#7EE787] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-[#1E1E1E] rounded-full cursor-pointer hover:bg-[#2A2A2A]" onClick={() => setShowProfile(true)}>
                <img 
                  src={user.avatar || "/placeholder.svg"} 
                  alt={user.username}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                />
                <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">{user.username}</span>
              </div>
            ) : (
              <Button
                onClick={handleGitHubLogin}
                disabled={isLoggingIn}
                className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium text-xs sm:text-sm px-3 sm:px-4"
                size="sm"
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black"></div>
                    <span className="hidden sm:inline">Connecting...</span>
                  </div>
                ) : (
                  <>
                    <Github className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Connect GitHub</span>
                    <span className="sm:hidden">Connect</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 sm:mb-6 bg-[#1E1E1E] text-[#7EE787] border-[#7EE787] text-xs sm:text-sm">
            Season 0
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Build. Debug. Ship.
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Welcome to S-0. Your first tools await.<br className="hidden sm:block" />
            <span className="block sm:inline">No forks. No remixes. Just you and the code.</span>
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium w-full sm:w-auto"
              >
                <Bug className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Continue Build
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400 order-first sm:order-none">
                  Welcome back, {user.name} 👋
                </div>
                {hasSeenOnboarding && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleShowOnboarding}
                    className="border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#7EE787] text-xs"
                  >
                    View Tutorial
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button 
                  size="lg" 
                  className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium w-full sm:w-auto"
                  onClick={handleGitHubLogin}
                  disabled={isLoggingIn}
                >
                  <Bug className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {isLoggingIn ? 'Connecting...' : 'Begin Your Build'}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
                
                {!hasSeenOnboarding && (
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={handleShowOnboarding}
                    className="border-[#2A2A2A] text-white hover:border-[#7EE787] hover:bg-[#7EE787]/10 w-full sm:w-auto"
                  >
                    Take the Tour
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {hasSeenOnboarding ? 'Sign in to track your progress' : 'New to BUILD? Take the tour to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-[#1E1E1E] border-[#2A2A2A]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-[#7EE787]/10 rounded-lg">
                  <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#7EE787]" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{tools.length}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Tools Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2A2A2A]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg">
                  <Bug className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{tools.reduce((sum, tool) => sum + tool.bugs.length, 0)}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Bugs to Fix</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2A2A2A]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">S-0</p>
                  <p className="text-xs sm:text-sm text-gray-400">Current Season</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2A2A2A]">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{user ? '1' : '0'}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Builders Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How BUILD Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Master React debugging through hands-on practice with real-world tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {/* Step 1 */}
            <div className="text-center group hover-lift transition-smooth">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7EE787]/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#7EE787]/20 transition-colors">
                  <Target className="h-8 w-8 sm:h-10 sm:w-10 text-[#7EE787]" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7EE787] text-black rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Choose Your Tool</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Select from 5 carefully crafted React components, each with multiple bugs to fix
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group hover-lift transition-smooth">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-yellow-500/20 transition-colors">
                  <Bug className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Debug & Fix</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Use our real-time feedback system to identify and fix bugs in the code editor
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group hover-lift transition-smooth">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-500/20 transition-colors">
                  <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Level Up</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Track your progress, export your solutions, and advance to more complex challenges
              </p>
            </div>
          </div>

          {/* Skills You'll Learn */}
          <div className="mt-12 sm:mt-16 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">Skills You'll Master</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Code2, label: 'React Hooks', color: 'text-blue-400' },
                { icon: Zap, label: 'State Management', color: 'text-yellow-400' },
                { icon: CheckCircle, label: 'Event Handling', color: 'text-green-400' },
                { icon: Lightbulb, label: 'Component Logic', color: 'text-purple-400' }
              ].map((skill, index) => (
                <div key={index} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#7EE787] transition-smooth group hover-lift hover-glow">
                  <skill.icon className={`h-6 w-6 ${skill.color} mb-2 mx-auto group-hover:scale-110 transition-transform animate-bounce-in`} style={{animationDelay: `${index * 0.1}s`}} />
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{skill.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Your Tools</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#2A2A2A] text-gray-400 text-xs sm:text-sm">
                {tools.length} tools
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tools.map((tool) => {
              // Define skill tags and estimated completion time for each tool
              const getToolMetadata = (toolId: string) => {
                const metadata = {
                  'poll-maker': { 
                    skills: ['State Management', 'Event Handling', 'Forms'], 
                    estimatedTime: '15-20 min',
                    difficultyColor: 'bg-green-500'
                  },
                  'date-calculator': { 
                    skills: ['Date APIs', 'Input Validation', 'React Hooks'], 
                    estimatedTime: '20-25 min',
                    difficultyColor: 'bg-blue-500'
                  },
                  'product-name-generator': { 
                    skills: ['Arrays', 'Random Logic', 'State Updates'], 
                    estimatedTime: '10-15 min',
                    difficultyColor: 'bg-green-500'
                  },
                  'receipt-builder': { 
                    skills: ['Complex State', 'Calculations', 'Dynamic Lists'], 
                    estimatedTime: '25-30 min',
                    difficultyColor: 'bg-orange-500'
                  },
                  'bio-generator': { 
                    skills: ['Template Logic', 'String Manipulation', 'Conditional Rendering'], 
                    estimatedTime: '15-20 min',
                    difficultyColor: 'bg-purple-500'
                  }
                };
                return metadata[toolId as keyof typeof metadata] || { 
                  skills: ['React Basics'], 
                  estimatedTime: '15-20 min',
                  difficultyColor: 'bg-gray-500'
                };
              };

              const { skills, estimatedTime, difficultyColor } = getToolMetadata(tool.id);

              return (
                <Card 
                  key={tool.id} 
                  className="bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#7EE787] transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#7EE787]/10"
                  onClick={() => selectTool(tool)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-[#7EE787]/10 rounded-lg group-hover:bg-[#7EE787]/20 transition-colors">
                        <tool.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#7EE787] group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${difficultyColor} text-white font-medium text-xs sm:text-sm`}>
                          {tool.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-[#7EE787] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    
                    {/* Skill Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 3).map((skill, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="text-xs border-[#2A2A2A] text-gray-300 bg-[#252525] hover:border-[#7EE787] hover:text-[#7EE787] transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Bug className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        <span className="text-xs sm:text-sm text-gray-400">{tool.bugs.length} bugs to fix</span>
                      </div>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-[#7EE787] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onGetStarted={handleOnboardingComplete}
      />
    </div>
  )
}
