"use client"

import { useState, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Zap,
  Layers,
  MoreHorizontal 
} from 'lucide-react'

interface ProgressiveUIConfig {
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  sessionProgress: number // 0-100
  featureUsage: Record<string, number> // tracks how often features are used
  hideComplexFeatures: boolean
  adaptiveComplexity: boolean
}

interface ProgressiveFeatureProps {
  level: 'beginner' | 'intermediate' | 'advanced'
  feature: string
  config: ProgressiveUIConfig
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

interface ProgressiveToolbarProps {
  config: ProgressiveUIConfig
  onConfigChange: (config: Partial<ProgressiveUIConfig>) => void
  actions: {
    essential: ReactNode[]
    intermediate: ReactNode[]
    advanced: ReactNode[]
  }
}

/**
 * Progressive Feature Component
 * Shows/hides features based on user level and usage patterns
 */
export function ProgressiveFeature({ 
  level, 
  feature, 
  config, 
  children, 
  fallback = null,
  className = ""
}: ProgressiveFeatureProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false)

  // Determine if feature should be visible based on user level
  const shouldShow = () => {
    if (!config.hideComplexFeatures) return true
    
    // Always show features appropriate for user level or below
    if (config.userLevel === 'advanced') return true
    if (config.userLevel === 'intermediate' && level !== 'advanced') return true
    if (config.userLevel === 'beginner' && level === 'beginner') return true
    
    return false
  }

  // Check if feature has been used frequently (adaptive complexity)
  const isFrequentlyUsed = () => {
    if (!config.adaptiveComplexity) return false
    return (config.featureUsage[feature] || 0) >= 3
  }

  useEffect(() => {
    const shouldBeVisible = shouldShow() || isFrequentlyUsed() || hasBeenRevealed
    setIsVisible(shouldBeVisible)
  }, [config, feature, hasBeenRevealed])

  const handleReveal = () => {
    setIsVisible(true)
    setHasBeenRevealed(true)
    // Track that user manually revealed this feature
    if (typeof window !== 'undefined') {
      const revealed = JSON.parse(localStorage.getItem('build-revealed-features') || '[]')
      if (!revealed.includes(feature)) {
        revealed.push(feature)
        localStorage.setItem('build-revealed-features', JSON.stringify(revealed))
      }
    }
  }

  if (isVisible) {
    return <div className={className}>{children}</div>
  }

  // Show reveal option for intermediate/advanced features
  if (level !== 'beginner' && fallback !== null) {
    return (
      <div className={`${className} opacity-60 hover:opacity-100 transition-opacity`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReveal}
          className="text-gray-400 hover:text-white h-6 px-2"
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return fallback ? <div className={className}>{fallback}</div> : null
}

/**
 * Progressive Toolbar Component
 * Organizes tools by complexity and adapts to user level
 */
export function ProgressiveToolbar({ 
  config, 
  onConfigChange, 
  actions 
}: ProgressiveToolbarProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)

  const getVisibleActions = () => {
    const essential = actions.essential
    const intermediate = config.userLevel !== 'beginner' ? actions.intermediate : []
    const advanced = config.userLevel === 'advanced' ? actions.advanced : []
    
    return { essential, intermediate, advanced }
  }

  const { essential, intermediate, advanced } = getVisibleActions()

  return (
    <div className="flex items-center justify-between w-full">
      {/* Essential Actions - Always Visible */}
      <div className="flex items-center gap-2">
        {essential.map((action, index) => (
          <div key={`essential-${index}`}>{action}</div>
        ))}
      </div>

      {/* Progressive Actions */}
      <div className="flex items-center gap-2">
        {/* Intermediate Actions */}
        <ProgressiveFeature
          level="intermediate"
          feature="intermediate-toolbar"
          config={config}
          className="flex items-center gap-2"
        >
          {intermediate.map((action, index) => (
            <div key={`intermediate-${index}`}>{action}</div>
          ))}
        </ProgressiveFeature>

        {/* Advanced Actions - Collapsible */}
        {advanced.length > 0 && (
          <ProgressiveFeature
            level="advanced"
            feature="advanced-toolbar"
            config={config}
          >
            <div className="flex items-center gap-2">
              {showAdvancedOptions ? (
                <>
                  {advanced.map((action, index) => (
                    <div key={`advanced-${index}`}>{action}</div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedOptions(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedOptions(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              )}
            </div>
          </ProgressiveFeature>
        )}

        {/* UI Customization Options */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomization(!showCustomization)}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="h-3 w-3" />
          </Button>

          {showCustomization && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Interface Complexity
                </h3>
                
                {/* User Level Override */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Experience Level</label>
                    <div className="flex gap-1">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                        <Button
                          key={level}
                          variant={config.userLevel === level ? "default" : "ghost"}
                          size="sm"
                          onClick={() => onConfigChange({ userLevel: level })}
                          className={`text-xs px-3 ${
                            config.userLevel === level 
                              ? 'bg-[#7EE787] text-black' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Feature Visibility Options */}
                  <div className="pt-3 border-t border-[#2A2A2A]">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-medium text-white">Hide Complex Features</label>
                        <p className="text-xs text-gray-400">Simplify interface for focus</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onConfigChange({ hideComplexFeatures: !config.hideComplexFeatures })}
                        className={`text-xs ${config.hideComplexFeatures ? 'text-[#7EE787]' : 'text-gray-400'}`}
                      >
                        {config.hideComplexFeatures ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-medium text-white">Adaptive Complexity</label>
                      <p className="text-xs text-gray-400">Show features as you use them</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigChange({ adaptiveComplexity: !config.adaptiveComplexity })}
                      className={`text-xs ${config.adaptiveComplexity ? 'text-[#7EE787]' : 'text-gray-400'}`}
                    >
                      {config.adaptiveComplexity ? <Zap className="h-4 w-4" /> : <Zap className="h-4 w-4 opacity-50" />}
                    </Button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="pt-3 mt-3 border-t border-[#2A2A2A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Session Progress</span>
                    <span className="text-xs text-white">{config.sessionProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-[#7EE787] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${config.sessionProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close customization */}
      {showCustomization && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCustomization(false)}
        />
      )}
    </div>
  )
}

/**
 * Progressive Panel Component
 * Shows contextual panels based on user needs and progress
 */
interface ProgressivePanelProps {
  config: ProgressiveUIConfig
  panels: {
    essential: ReactNode
    helpful?: ReactNode
    advanced?: ReactNode
  }
  className?: string
}

export function ProgressivePanel({ config, panels, className = "" }: ProgressivePanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('essential')

  const shouldShowPanel = (level: 'essential' | 'helpful' | 'advanced') => {
    if (level === 'essential') return true
    if (level === 'helpful' && config.userLevel !== 'beginner') return true
    if (level === 'advanced' && config.userLevel === 'advanced') return true
    return false
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Essential Panel - Always Visible */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded">
        {panels.essential}
      </div>

      {/* Helpful Panel - For Intermediate+ */}
      {panels.helpful && shouldShowPanel('helpful') && (
        <ProgressiveFeature
          level="intermediate"
          feature="helpful-panel"
          config={config}
        >
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#252525] transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'helpful' ? null : 'helpful')}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Helpful Tools</span>
              </div>
              {expandedSection === 'helpful' ? 
                <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                <ChevronDown className="h-4 w-4 text-gray-400" />
              }
            </div>
            {expandedSection === 'helpful' && (
              <div className="px-3 pb-3">
                {panels.helpful}
              </div>
            )}
          </div>
        </ProgressiveFeature>
      )}

      {/* Advanced Panel - For Advanced Users Only */}
      {panels.advanced && shouldShowPanel('advanced') && (
        <ProgressiveFeature
          level="advanced"
          feature="advanced-panel"
          config={config}
        >
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#252525] transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'advanced' ? null : 'advanced')}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Advanced Options</span>
                <Badge className="bg-yellow-500/10 text-yellow-400 text-xs">Pro</Badge>
              </div>
              {expandedSection === 'advanced' ? 
                <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                <ChevronDown className="h-4 w-4 text-gray-400" />
              }
            </div>
            {expandedSection === 'advanced' && (
              <div className="px-3 pb-3">
                {panels.advanced}
              </div>
            )}
          </div>
        </ProgressiveFeature>
      )}
    </div>
  )
}

/**
 * Hook for managing progressive UI configuration
 */
export function useProgressiveUI(initialLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner') {
  const [config, setConfig] = useState<ProgressiveUIConfig>({
    userLevel: initialLevel,
    sessionProgress: 0,
    featureUsage: {},
    hideComplexFeatures: initialLevel === 'beginner',
    adaptiveComplexity: true
  })

  // Load saved configuration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('build-progressive-ui-config')
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved)
          setConfig(prev => ({ ...prev, ...savedConfig }))
        } catch (error) {
          console.error('Failed to load progressive UI config:', error)
        }
      }
    }
  }, [])

  // Save configuration changes
  const updateConfig = (updates: Partial<ProgressiveUIConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('build-progressive-ui-config', JSON.stringify(newConfig))
    }
  }

  // Track feature usage
  const trackFeatureUsage = (feature: string) => {
    const currentUsage = config.featureUsage[feature] || 0
    updateConfig({
      featureUsage: {
        ...config.featureUsage,
        [feature]: currentUsage + 1
      }
    })
  }

  // Update session progress
  const updateSessionProgress = (progress: number) => {
    updateConfig({ sessionProgress: Math.min(100, Math.max(0, progress)) })
  }

  return {
    config,
    updateConfig,
    trackFeatureUsage,
    updateSessionProgress
  }
}