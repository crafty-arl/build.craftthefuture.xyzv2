"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Code2, 
  Beaker, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react'

interface ModeTransitionProps {
  currentMode: 'guided' | 'practice' | 'explore'
  onModeChange: (newMode: 'guided' | 'practice' | 'explore', preserveCode?: boolean) => void
  currentCode: string
  sessionProgress: number
  className?: string
}

interface TransitionOption {
  targetMode: 'guided' | 'practice' | 'explore'
  title: string
  description: string
  icon: React.ReactNode
  color: string
  benefits: string[]
  preserveCode: boolean
  transitionType: 'upgrade' | 'downgrade' | 'lateral'
  confidence: number
}

export function ModeTransitionSystem({
  currentMode,
  onModeChange,
  currentCode,
  sessionProgress,
  className = ""
}: ModeTransitionProps) {
  const [showTransitions, setShowTransitions] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const transitionRef = useRef<NodeJS.Timeout>()

  // Get available transition options based on current context
  const getTransitionOptions = (): TransitionOption[] => {
    const options: TransitionOption[] = []

    switch (currentMode) {
      case 'guided':
        options.push({
          targetMode: 'practice',
          title: 'Switch to Practice Mode',
          description: 'Continue with templates and flexible pacing',
          icon: <Code2 className="h-4 w-4" />,
          color: 'bg-green-500/10 text-green-400 border-green-400/20',
          benefits: ['Template library', 'Flexible learning', 'Progress tracking'],
          preserveCode: true,
          transitionType: 'lateral',
          confidence: 85
        })
        
        options.push({
          targetMode: 'explore',
          title: 'Graduate to Exploration',
          description: 'Take full creative control with your code',
          icon: <Beaker className="h-4 w-4" />,
          color: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
          benefits: ['Complete freedom', 'Advanced tools', 'Creative sandbox'],
          preserveCode: true,
          transitionType: 'upgrade',
          confidence: sessionProgress > 60 ? 90 : 60
        })
        break

      case 'practice':
        options.push({
          targetMode: 'guided',
          title: 'Get Structured Guidance',
          description: 'Need help? Get real-time feedback and hints',
          icon: <Target className="h-4 w-4" />,
          color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
          benefits: ['Step-by-step help', 'Bug detection', 'Immediate feedback'],
          preserveCode: true,
          transitionType: 'downgrade',
          confidence: 75
        })

        options.push({
          targetMode: 'explore',
          title: 'Unlock Full Creativity',
          description: 'Ready for unlimited experimentation',
          icon: <Beaker className="h-4 w-4" />,
          color: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
          benefits: ['No constraints', 'Advanced features', 'Export options'],
          preserveCode: true,
          transitionType: 'upgrade',
          confidence: 80
        })
        break

      case 'explore':
        options.push({
          targetMode: 'guided',
          title: 'Get Structured Learning',
          description: 'Want to learn systematically? Try guided challenges',
          icon: <Target className="h-4 w-4" />,
          color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
          benefits: ['Learning path', 'Progress tracking', 'Skill building'],
          preserveCode: false,
          transitionType: 'downgrade',
          confidence: 70
        })

        options.push({
          targetMode: 'practice',
          title: 'Use Templates & Structure',
          description: 'Build from proven starting points',
          icon: <Code2 className="h-4 w-4" />,
          color: 'bg-green-500/10 text-green-400 border-green-400/20',
          benefits: ['Template library', 'Guided practice', 'Structured learning'],
          preserveCode: true,
          transitionType: 'lateral',
          confidence: 75
        })
        break
    }

    return options.sort((a, b) => b.confidence - a.confidence)
  }

  const handleTransition = async (option: TransitionOption) => {
    setIsTransitioning(true)
    setTransitionProgress(0)
    
    // Animate transition progress
    const progressInterval = setInterval(() => {
      setTransitionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 50)

    // Wait for animation to complete
    await new Promise(resolve => {
      transitionRef.current = setTimeout(resolve, 800)
    })

    // Perform the actual mode change
    onModeChange(option.targetMode, option.preserveCode)
    
    setIsTransitioning(false)
    setTransitionProgress(0)
    setShowTransitions(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current)
      }
    }
  }, [])

  const getModeInfo = (mode: string) => {
    const modeConfig = {
      guided: {
        name: 'Guided Learning',
        icon: <Target className="h-4 w-4" />,
        color: 'bg-blue-500/10 text-blue-400 border-blue-400/20'
      },
      practice: {
        name: 'Practice Mode',
        icon: <Code2 className="h-4 w-4" />,
        color: 'bg-green-500/10 text-green-400 border-green-400/20'
      },
      explore: {
        name: 'Free Exploration',
        icon: <Beaker className="h-4 w-4" />,
        color: 'bg-purple-500/10 text-purple-400 border-purple-400/20'
      }
    }
    return modeConfig[mode as keyof typeof modeConfig]
  }

  const currentModeInfo = getModeInfo(currentMode)
  const transitionOptions = getTransitionOptions()

  if (isTransitioning) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8 text-center max-w-md">
          <div className="mb-6">
            <Sparkles className="h-12 w-12 text-[#7EE787] mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Transitioning Mode</h2>
            <p className="text-gray-400">Adapting your environment...</p>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-[#7EE787] h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${transitionProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{transitionProgress}%</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Current Mode Status */}
      <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
        <div className="flex items-center gap-2">
          {currentModeInfo.icon}
          <span className="font-medium text-white">{currentModeInfo.name}</span>
          <Badge variant="outline" className={currentModeInfo.color}>
            Active
          </Badge>
        </div>
        
        <div className="flex-1 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTransitions(!showTransitions)}
            className="text-gray-400 hover:text-white"
          >
            Switch Mode
            <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${showTransitions ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Transition Options */}
      {showTransitions && (
        <div className="mt-4 space-y-3">
          <div className="text-sm font-medium text-gray-300 mb-3">
            Available Transitions
          </div>
          
          {transitionOptions.map((option, index) => (
            <div
              key={option.targetMode}
              className="border border-[#2A2A2A] rounded-lg p-4 hover:border-[#7EE787] transition-colors cursor-pointer group"
              onClick={() => handleTransition(option)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#2A2A2A] rounded group-hover:bg-[#7EE787]/10 transition-colors">
                    {option.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-[#7EE787] transition-colors">
                        {option.title}
                      </h3>
                      {option.transitionType === 'upgrade' && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          <Zap className="h-2 w-2 mr-1" />
                          Upgrade
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {option.confidence >= 80 ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-400" />
                    )}
                    <span className="text-xs text-gray-400">
                      {option.confidence}% match
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#7EE787] transition-colors" />
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2 mb-3">
                {option.benefits.map((benefit) => (
                  <Badge
                    key={benefit}
                    variant="outline"
                    className="text-xs border-[#2A2A2A] text-gray-400 bg-[#1A1A1A]"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>

              {/* Code Preservation Notice */}
              <div className="flex items-center gap-2 text-xs">
                {option.preserveCode ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">Your code will be preserved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-yellow-400" />
                    <span className="text-yellow-400">Will start with new template</span>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Smart Recommendations */}
          {sessionProgress > 30 && currentMode === 'guided' && (
            <div className="mt-4 p-3 bg-[#7EE787]/5 border border-[#7EE787]/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#7EE787] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#7EE787]">Smart Recommendation</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Based on your progress ({sessionProgress}%), you might enjoy the creative freedom of Exploration mode!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showTransitions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTransitions(false)}
        />
      )}
    </div>
  )
}

/**
 * Transition Animation Component
 * Provides smooth visual feedback during mode changes
 */
interface TransitionAnimationProps {
  fromMode: string
  toMode: string
  isVisible: boolean
  onComplete: () => void
}

export function TransitionAnimation({
  fromMode,
  toMode,
  isVisible,
  onComplete
}: TransitionAnimationProps) {
  const [stage, setStage] = useState<'fadeOut' | 'morph' | 'fadeIn'>('fadeOut')

  useEffect(() => {
    if (!isVisible) return

    const sequence = async () => {
      // Stage 1: Fade out current mode
      setStage('fadeOut')
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Stage 2: Morph interface
      setStage('morph')
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Stage 3: Fade in new mode
      setStage('fadeIn')
      await new Promise(resolve => setTimeout(resolve, 300))
      
      onComplete()
    }

    sequence()
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          {stage === 'fadeOut' && (
            <div className="animate-fade-out">
              <div className="h-16 w-16 bg-[#2A2A2A] rounded-full mx-auto mb-4 flex items-center justify-center opacity-50">
                <Code2 className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400">Leaving {fromMode} mode...</p>
            </div>
          )}
          
          {stage === 'morph' && (
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-[#7EE787]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-[#7EE787] animate-spin" />
              </div>
              <p className="text-[#7EE787]">Adapting interface...</p>
            </div>
          )}
          
          {stage === 'fadeIn' && (
            <div className="animate-fade-in">
              <div className="h-16 w-16 bg-[#7EE787]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#7EE787]" />
              </div>
              <p className="text-white">Welcome to {toMode} mode!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}