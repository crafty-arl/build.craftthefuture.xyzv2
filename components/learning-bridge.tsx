"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ArrowRight, 
  Code2, 
  Play, 
  Lightbulb, 
  Target, 
  Zap,
  BookOpen,
  Beaker,
  ArrowUpRight
} from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[]
  estimatedTime: number
  bugCount: number
}

interface LearningBridgeProps {
  currentEnvironment: 'learning' | 'sandbox'
  currentCode?: string
  onTransition: (targetEnvironment: 'learning' | 'sandbox', data?: any) => void
  suggestedChallenges?: Challenge[]
  className?: string
}

export function LearningBridge({
  currentEnvironment,
  currentCode,
  onTransition,
  suggestedChallenges = [],
  className = ""
}: LearningBridgeProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const getEnvironmentInfo = (env: 'learning' | 'sandbox') => {
    return {
      learning: {
        name: "Guided Challenges",
        icon: <Target className="h-4 w-4" />,
        description: "Structured debugging with hints and progress tracking",
        color: "bg-blue-500/10 text-blue-400 border-blue-400/20",
        whenToUse: "Perfect for learning new React concepts step by step"
      },
      sandbox: {
        name: "Practice Mode", 
        icon: <Beaker className="h-4 w-4" />,
        description: "Free exploration and experimentation",
        color: "bg-purple-500/10 text-purple-400 border-purple-400/20",
        whenToUse: "Great for experimenting with ideas and testing concepts"
      }
    }[env]
  }

  const currentInfo = getEnvironmentInfo(currentEnvironment)
  const otherEnv = currentEnvironment === 'learning' ? 'sandbox' : 'learning'
  const otherInfo = getEnvironmentInfo(otherEnv)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Environment Status */}
      <div className="flex items-center gap-3 p-3 border border-[#2A2A2A] rounded-lg bg-[#1A1A1A]">
        <div className="flex items-center gap-2">
          {currentInfo.icon}
          <span className="font-medium text-white">{currentInfo.name}</span>
        </div>
        <div className="flex-1 text-sm text-gray-400">
          {currentInfo.description}
        </div>
      </div>

      {/* Environment Switch Options */}
      <div className="grid gap-3">
        {/* Switch to Other Environment */}
        <div className="border border-[#2A2A2A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {otherInfo.icon}
              <span className="font-medium text-white">{otherInfo.name}</span>
              <Badge variant="outline" className={otherInfo.color}>
                Switch Mode
              </Badge>
            </div>
            <Button
              onClick={() => onTransition(otherEnv, { code: currentCode })}
              size="sm"
              className="bg-[#7EE787] text-black hover:bg-[#6BD975]"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Switch
            </Button>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            {otherInfo.whenToUse}
          </p>
          <div className="text-xs text-gray-500">
            {currentCode ? "Your current code will be transferred" : "Start fresh in new environment"}
          </div>
        </div>

        {/* Suggested Challenges (when in sandbox) */}
        {currentEnvironment === 'sandbox' && suggestedChallenges.length > 0 && (
          <div className="border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-white">Ready for a Challenge?</span>
              </div>
              <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#2A2A2A] text-white hover:bg-[#252525]"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Suggested Challenges
                    </DialogTitle>
                  </DialogHeader>
                  <ChallengeGrid 
                    challenges={suggestedChallenges} 
                    onSelectChallenge={(challenge) => {
                      onTransition('learning', { toolId: challenge.id })
                      setShowSuggestions(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Based on your sandbox activity, these challenges might interest you:
            </p>
            
            {/* Quick Challenge Preview */}
            <div className="space-y-2">
              {suggestedChallenges.slice(0, 2).map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-3 border border-[#2A2A2A] rounded bg-[#1A1A1A] hover:border-[#7EE787] transition-colors cursor-pointer"
                  onClick={() => onTransition('learning', { toolId: challenge.id })}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">{challenge.title}</span>
                      <DifficultyBadge difficulty={challenge.difficulty} />
                    </div>
                    <div className="text-xs text-gray-400">
                      {challenge.bugCount} bugs • {challenge.estimatedTime} min
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice in Sandbox (when in learning) */}
        {currentEnvironment === 'learning' && (
          <div className="border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-white">Practice & Experiment</span>
              </div>
              <Button
                onClick={() => onTransition('sandbox', { 
                  code: currentCode,
                  template: 'from-challenge'
                })}
                size="sm"
                variant="outline"
                className="border-purple-400/20 text-purple-400 hover:bg-purple-500/10"
              >
                <Beaker className="h-3 w-3 mr-1" />
                Open in Sandbox
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Take your current code to the sandbox for free experimentation without constraints
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface ChallengeGridProps {
  challenges: Challenge[]
  onSelectChallenge: (challenge: Challenge) => void
}

function ChallengeGrid({ challenges, onSelectChallenge }: ChallengeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="border border-[#2A2A2A] rounded-lg p-4 hover:border-[#7EE787] transition-colors cursor-pointer"
          onClick={() => onSelectChallenge(challenge)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{challenge.title}</h3>
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">{challenge.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty={challenge.difficulty} />
              <span className="text-xs text-gray-400">
                {challenge.bugCount} bugs
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {challenge.estimatedTime} min
            </span>
          </div>
          
          {challenge.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {challenge.skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs border-[#2A2A2A] text-gray-400"
                >
                  {skill}
                </Badge>
              ))}
              {challenge.skills.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-[#2A2A2A] text-gray-400"
                >
                  +{challenge.skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' }) {
  const config = {
    beginner: { color: 'bg-green-500/10 text-green-400 border-green-400/20', icon: <Target className="h-3 w-3" /> },
    intermediate: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20', icon: <Zap className="h-3 w-3" /> },
    advanced: { color: 'bg-red-500/10 text-red-400 border-red-400/20', icon: <Code2 className="h-3 w-3" /> }
  }[difficulty]

  return (
    <Badge variant="outline" className={`text-xs ${config.color}`}>
      <span className="flex items-center gap-1">
        {config.icon}
        {difficulty}
      </span>
    </Badge>
  )
}