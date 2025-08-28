"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, Target, Bug, Trophy, Play, CheckCircle } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onGetStarted: () => void
}

const onboardingSteps = [
  {
    title: "Welcome to BUILD",
    subtitle: "Your React debugging playground",
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-[#7EE787]/10 rounded-full flex items-center justify-center mx-auto">
          <Target className="h-10 w-10 text-[#7EE787]" />
        </div>
        <p className="text-gray-300 text-lg">
          Master React debugging through hands-on practice with real-world components.
          Fix bugs, learn patterns, and level up your development skills.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#7EE787]">5</div>
            <div className="text-xs text-gray-400">React Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">15+</div>
            <div className="text-xs text-gray-400">Bugs to Fix</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">∞</div>
            <div className="text-xs text-gray-400">Learning</div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Choose Your Challenge",
    subtitle: "Pick a tool and start debugging",
    content: (
      <div className="space-y-4">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#7EE787]/10 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-[#7EE787]" />
            </div>
            <div>
              <h4 className="font-medium">Poll Maker</h4>
              <p className="text-sm text-gray-400">State Management • Event Handling</p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-green-500 text-white text-xs">Beginner</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">3 bugs to fix</span>
            <span className="text-gray-400">15-20 min</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-center">
          Each tool has multiple bugs hidden in the code. Use our real-time feedback 
          system to identify and fix them one by one.
        </p>
      </div>
    )
  },
  {
    title: "Debug Like a Pro",
    subtitle: "Use our powerful debugging tools",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-5 w-5 text-yellow-500" />
              <h4 className="font-medium">Real-time Detection</h4>
            </div>
            <p className="text-sm text-gray-400">
              See bugs as you type with our intelligent detection system
            </p>
          </div>
          
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-5 w-5 text-[#7EE787]" />
              <h4 className="font-medium">Live Preview</h4>
            </div>
            <p className="text-sm text-gray-400">
              See your fixes in action with instant preview updates
            </p>
          </div>
        </div>
        
        <div className="bg-[#252525] border border-[#2A2A2A] rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Pro Tips for Success
          </h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Use Ctrl+Enter to run your code quickly</li>
            <li>• Check the Bug Details panel for hints and clues</li>
            <li>• Use the AI Helper to generate prompts for assistance</li>
            <li>• Watch the progress indicators to track your fixes</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Track Your Progress",
    subtitle: "Level up with every bug you fix",
    content: (
      <div className="space-y-4">
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Your Progress</h4>
            <Badge className="bg-[#7EE787] text-black">0/15 Fixed</Badge>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-3 mb-2">
            <div className="bg-[#7EE787] h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
          </div>
          <p className="text-sm text-gray-400">Start fixing bugs to see your progress grow!</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-xs text-gray-400">Achievements</div>
          </div>
          <div className="text-center p-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-400">Skills</div>
          </div>
          <div className="text-center p-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <div className="text-xs text-gray-400">Completion</div>
          </div>
        </div>
        
        <p className="text-gray-300 text-center">
          Ready to start your debugging journey? Let's build something amazing!
        </p>
      </div>
    )
  }
]

export function OnboardingModal({ isOpen, onClose, onGetStarted }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const prevButtonRef = useRef<HTMLButtonElement>(null)

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
  }, [isOpen, currentStep])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onGetStarted()
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (currentStep < onboardingSteps.length - 1) {
          handleNext()
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentStep > 0) {
          handlePrev()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'Enter':
        e.preventDefault()
        if (e.target === nextButtonRef.current) {
          handleNext()
        }
        break
    }
  }

  const step = onboardingSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#121212] border-[#2A2A2A] text-white max-w-2xl max-h-[80vh] overflow-y-auto"
        ref={modalRef}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        <DialogHeader className="text-center">
          <DialogTitle 
            id="onboarding-title"
            className="text-2xl font-bold text-white mb-2"
          >
            {step.title}
          </DialogTitle>
          <p id="onboarding-description" className="text-gray-400 text-lg">
            {step.subtitle}
          </p>
        </DialogHeader>
        
        <div className="py-6">
          {step.content}
        </div>
        
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6" role="tablist" aria-label="Onboarding progress">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentStep}
              aria-label={`Step ${index + 1} of ${onboardingSteps.length}`}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-[#7EE787]' : 'bg-[#2A2A2A]'
              }`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            ref={prevButtonRef}
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-gray-400 hover:text-white disabled:opacity-50"
            aria-label="Go to previous step"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-400 hover:text-white text-sm"
            aria-label="Skip tutorial"
          >
            Skip Tutorial
          </Button>
          
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium"
            aria-label={currentStep === onboardingSteps.length - 1 ? 'Get started with BUILD' : 'Go to next step'}
          >
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                Get Started
                <Play className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
        
        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Use ← → arrow keys to navigate, Esc to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}