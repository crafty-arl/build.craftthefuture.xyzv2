"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UnifiedIDE } from "@/components/unified-ide"
import { SmartModeDetection, type UserContext } from "@/lib/utils/smart-mode-detection"
import { loadToolsFromJson, fallbackTools, type HomepageTool } from '@/lib/utils/toolLoader'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ArrowLeft } from 'lucide-react'

function CodeEditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [tools, setTools] = useState<HomepageTool[]>(fallbackTools)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTool, setCurrentTool] = useState<HomepageTool | null>(null)
  const [detectedMode, setDetectedMode] = useState<'guided' | 'practice' | 'explore' | null>(null)
  const [showModeRecommendation, setShowModeRecommendation] = useState(false)

  // Extract parameters from URL
  const modeParam = searchParams.get('mode') as 'guided' | 'practice' | 'explore' | null
  const challengeParam = searchParams.get('challenge')
  const codeParam = searchParams.get('code')

  // Load tools and determine context
  useEffect(() => {
    const loadTools = async () => {
      console.log('🔍 Code Page Debug - Starting tool loading process')
      try {
        const loadedTools = await loadToolsFromJson()
        console.log('🔍 Code Page Debug - Tools loaded from JSON:', {
          count: loadedTools.length,
          toolIds: loadedTools.map(t => t.id)
        })
        
        if (loadedTools.length > 0) {
          setTools(loadedTools)
        }

        // Find current tool if challenge is specified
        if (challengeParam) {
          console.log('🔍 Code Page Debug - Looking for challenge tool:', challengeParam)
          const tool = loadedTools.find(t => t.id === challengeParam) || fallbackTools.find(t => t.id === challengeParam)
          console.log('🔍 Code Page Debug - Challenge tool found:', {
            found: !!tool,
            tool: tool ? {
              id: tool.id,
              title: tool.title,
              description: tool.description,
              hasBrokenCode: !!tool.brokenCode
            } : null
          })
          setCurrentTool(tool || null)
        } else {
          console.log('🔍 Code Page Debug - No challengeParam provided')
        }
      } catch (error) {
        console.error('🔍 Code Page Debug - Failed to load tools:', error)
      } finally {
        setIsLoading(false)
        console.log('🔍 Code Page Debug - Tool loading completed')
      }
    }

    loadTools()
  }, [challengeParam])

  // Smart mode detection
  useEffect(() => {
    if (isLoading) return

    console.log('🔍 Code Page Debug - Mode detection triggered:', {
      isLoading,
      modeParam,
      challengeParam,
      codeParam
    })

    // If mode is explicitly specified in URL, use it
    if (modeParam) {
      console.log('🔍 Code Page Debug - Using explicit mode from URL:', modeParam)
      setDetectedMode(modeParam)
      return
    }

    // Otherwise, use smart detection
    const userContext: UserContext = {
      experience: getUserExperience(),
      previousSessions: getPreviousSessions(),
      completedChallenges: getCompletedChallenges(),
      sessionTime: 0,
      currentChallenge: challengeParam || undefined,
      codeSource: challengeParam ? 'challenge' : (codeParam ? 'import' : 'scratch'),
      hasActiveChallenges: !!challengeParam,
      recentActivity: challengeParam ? 'learning' : 'exploring',
      errorFrequency: 'medium',
      entryPoint: challengeParam ? 'challenge-card' : 'direct-link',
      timeOfDay: getTimeOfDay(),
      deviceType: getDeviceType()
    }

    console.log('🔍 Code Page Debug - User context created:', userContext)

    const recommendation = SmartModeDetection.detectOptimalMode(userContext)
    console.log('🔍 Code Page Debug - Smart mode recommendation:', recommendation)
    
    setDetectedMode(recommendation.modeId)
    
    // Show recommendation if confidence is not very high or user might benefit from explanation
    if (recommendation.confidence < 90 || userContext.previousSessions === 0) {
      setShowModeRecommendation(true)
    }
  }, [isLoading, modeParam, challengeParam, codeParam])

  // Helper functions for user context
  const getUserExperience = (): 'beginner' | 'intermediate' | 'advanced' => {
    const saved = localStorage.getItem('build-user-experience')
    return (saved as 'beginner' | 'intermediate' | 'advanced') || 'beginner'
  }

  const getPreviousSessions = (): number => {
    const saved = localStorage.getItem('build-session-count')
    return saved ? parseInt(saved, 10) : 0
  }

  const getCompletedChallenges = (): string[] => {
    const saved = localStorage.getItem('build-completed-challenges')
    return saved ? JSON.parse(saved) : []
  }

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours()
    if (hour < 6) return 'night'
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    if (hour < 22) return 'evening'
    return 'night'
  }

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  // Handle tool change
  const handleToolChange = (toolId: string) => {
    router.push(`/code?challenge=${toolId}`)
  }

  const getInitialCode = (): string => {
    console.log('🔍 Code Page Debug - getInitialCode called:', {
      codeParam,
      currentTool: currentTool ? {
        id: currentTool.id,
        title: currentTool.title,
        hasBrokenCode: !!currentTool.brokenCode,
        brokenCodeLength: currentTool.brokenCode?.length || 0
      } : null
    })
    
    if (codeParam) {
      try {
        const decoded = decodeURIComponent(codeParam)
        console.log('🔍 Code Page Debug - Using codeParam:', decoded.substring(0, 100))
        return decoded
      } catch {
        console.log('🔍 Code Page Debug - Failed to decode codeParam')
        return ''
      }
    }
    
    if (currentTool) {
      const code = currentTool.brokenCode || ''
      console.log('🔍 Code Page Debug - Using currentTool.brokenCode:', code.substring(0, 100))
      return code
    }

    console.log('🔍 Code Page Debug - No code source found, returning empty string')
    return ''
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7EE787] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your coding environment...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Smart Mode Recommendation */}
      {showModeRecommendation && detectedMode && (
        <div className="fixed top-4 right-4 max-w-sm bg-[#1E1E1E] border border-[#7EE787] rounded-lg p-4 z-50 shadow-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-[#7EE787] mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Smart Recommendation</h3>
              <p className="text-sm text-gray-300 mb-3">
                Based on your context, we've selected <strong>{detectedMode} mode</strong> for you.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowModeRecommendation(false)}
                  className="bg-[#7EE787] text-black hover:bg-[#6BD975] text-xs"
                >
                  Got it
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModeRecommendation(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge banner moved to UnifiedIDE component */}

      {/* Unified IDE */}
      {detectedMode ? (
        <>
          {console.log('🔍 Code Page Debug - Rendering UnifiedIDE with:', {
            detectedMode,
            challengeId: challengeParam,
            initialCode: getInitialCode() ? `${getInitialCode().substring(0, 100)}...` : 'empty'
          })}
                  <UnifiedIDE
          initialMode={detectedMode}
          challengeId={challengeParam || undefined}
          initialCode={getInitialCode()}
          challengeTool={currentTool || undefined}
          availableTools={tools}
          onToolChange={handleToolChange}
        />
        </>
      ) : (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7EE787] mx-auto mb-4"></div>
            <p className="text-gray-400">Waiting for mode detection...</p>
            <p className="text-sm text-gray-500 mt-2">detectedMode: {detectedMode || 'undefined'}</p>
          </div>
        </div>
      )}
    </>
  )
}

// Main page component with Suspense boundary
export default function CodeEditorPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7EE787] mx-auto mb-4"></div>
            <p className="text-gray-400">Initializing editor...</p>
          </div>
        </div>
      }
    >
      <CodeEditorContent />
    </Suspense>
  )
}