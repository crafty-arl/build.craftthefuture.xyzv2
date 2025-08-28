"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Trophy, Zap, Star } from 'lucide-react'

interface SuccessCelebrationProps {
  isVisible: boolean
  message?: string
  type?: 'bug-fix' | 'all-complete' | 'milestone'
  onComplete?: () => void
}

export function SuccessCelebration({ 
  isVisible, 
  message = "Great job!", 
  type = 'bug-fix',
  onComplete 
}: SuccessCelebrationProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    if (isVisible) {
      // Generate random particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
      setParticles(newParticles)

      // Auto-hide after animation
      const timeout = setTimeout(() => {
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'bug-fix':
        return <CheckCircle className="h-8 w-8 text-green-400" />
      case 'all-complete':
        return <Trophy className="h-8 w-8 text-yellow-400" />
      case 'milestone':
        return <Star className="h-8 w-8 text-purple-400" />
      default:
        return <Zap className="h-8 w-8 text-[#7EE787]" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'bug-fix':
        return 'from-green-500/20 to-green-600/10'
      case 'all-complete':
        return 'from-yellow-500/20 via-orange-500/15 to-red-500/10'
      case 'milestone':
        return 'from-purple-500/20 to-blue-500/10'
      default:
        return 'from-[#7EE787]/20 to-green-500/10'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      
      {/* Main celebration */}
      <div className={`relative bg-gradient-to-br ${getColors()} border border-white/10 rounded-2xl p-8 backdrop-blur-md animate-bounce-in shadow-2xl`}>
        <div className="text-center space-y-4">
          <div className="animate-celebrate">
            {getIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {message}
          </h2>
          {type === 'all-complete' && (
            <p className="text-gray-300 text-sm">
              Challenge completed! Ready for the next one?
            </p>
          )}
        </div>
        
        {/* Animated particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-[#7EE787] rounded-full animate-pulse opacity-80"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animation: `particle 1.5s ease-out ${particle.delay}s forwards`
            }}
          />
        ))}
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7EE787]/10 to-transparent rounded-2xl animate-glow -z-10" />
      </div>
      
      {/* Additional sparkles for 'all-complete' */}
      {type === 'all-complete' && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}