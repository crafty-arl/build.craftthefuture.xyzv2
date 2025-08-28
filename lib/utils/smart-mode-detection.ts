/**
 * Smart Mode Detection System
 * 
 * Intelligently determines the optimal IDE mode based on user context,
 * behavior patterns, and current session data.
 */

export interface UserContext {
  // User profile
  experience: 'beginner' | 'intermediate' | 'advanced'
  previousSessions: number
  completedChallenges: string[]
  
  // Current session
  sessionTime: number
  currentChallenge?: string
  codeSource: 'challenge' | 'template' | 'scratch' | 'import' | 'saved'
  
  // Behavioral indicators
  hasActiveChallenges: boolean
  recentActivity: 'debugging' | 'exploring' | 'learning' | 'building'
  errorFrequency: 'low' | 'medium' | 'high'
  
  // Context clues
  entryPoint: 'homepage' | 'direct-link' | 'challenge-card' | 'sandbox-link' | 'bridge'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

export interface ModeRecommendation {
  modeId: 'guided' | 'practice' | 'explore'
  confidence: number // 0-100
  reasoning: string[]
  alternatives: Array<{
    modeId: 'guided' | 'practice' | 'explore'
    confidence: number
    reason: string
  }>
}

export class SmartModeDetection {
  /**
   * Main function to detect optimal mode based on comprehensive user context
   */
  static detectOptimalMode(context: UserContext): ModeRecommendation {
    const scores = this.calculateModeScores(context)
    const topMode = this.getTopMode(scores)
    const reasoning = this.generateReasoning(context, scores)
    const alternatives = this.getAlternatives(scores, topMode.modeId)

    return {
      modeId: topMode.modeId,
      confidence: topMode.score,
      reasoning,
      alternatives
    }
  }

  /**
   * Calculate weighted scores for each mode based on context factors
   */
  private static calculateModeScores(context: UserContext): Record<string, number> {
    const scores = {
      guided: 0,
      practice: 0,
      explore: 0
    }

    // Factor 1: Experience Level (25% weight)
    const experienceWeight = 0.25
    switch (context.experience) {
      case 'beginner':
        scores.guided += 40 * experienceWeight
        scores.practice += 30 * experienceWeight
        scores.explore += 10 * experienceWeight
        break
      case 'intermediate':
        scores.guided += 25 * experienceWeight
        scores.practice += 40 * experienceWeight
        scores.explore += 25 * experienceWeight
        break
      case 'advanced':
        scores.guided += 10 * experienceWeight
        scores.practice += 20 * experienceWeight
        scores.explore += 40 * experienceWeight
        break
    }

    // Factor 2: Current Challenge Context (30% weight)
    const challengeWeight = 0.30
    if (context.hasActiveChallenges && context.currentChallenge) {
      scores.guided += 45 * challengeWeight
      scores.practice += 15 * challengeWeight
      scores.explore += 5 * challengeWeight
    } else {
      scores.guided += 5 * challengeWeight
      scores.practice += 35 * challengeWeight
      scores.explore += 35 * challengeWeight
    }

    // Factor 3: Code Source (20% weight)
    const sourceWeight = 0.20
    switch (context.codeSource) {
      case 'challenge':
        scores.guided += 40 * sourceWeight
        scores.practice += 10 * sourceWeight
        scores.explore += 5 * sourceWeight
        break
      case 'template':
        scores.guided += 10 * sourceWeight
        scores.practice += 35 * sourceWeight
        scores.explore += 25 * sourceWeight
        break
      case 'scratch':
        scores.guided += 5 * sourceWeight
        scores.practice += 25 * sourceWeight
        scores.explore += 40 * sourceWeight
        break
      case 'import':
      case 'saved':
        scores.guided += 15 * sourceWeight
        scores.practice += 25 * sourceWeight
        scores.explore += 30 * sourceWeight
        break
    }

    // Factor 4: Recent Activity Pattern (15% weight)
    const activityWeight = 0.15
    switch (context.recentActivity) {
      case 'debugging':
        scores.guided += 35 * activityWeight
        scores.practice += 25 * activityWeight
        scores.explore += 10 * activityWeight
        break
      case 'learning':
        scores.guided += 40 * activityWeight
        scores.practice += 30 * activityWeight
        scores.explore += 15 * activityWeight
        break
      case 'exploring':
        scores.guided += 5 * activityWeight
        scores.practice += 20 * activityWeight
        scores.explore += 40 * activityWeight
        break
      case 'building':
        scores.guided += 10 * activityWeight
        scores.practice += 30 * activityWeight
        scores.explore += 35 * activityWeight
        break
    }

    // Factor 5: Entry Point Intent (10% weight)
    const entryWeight = 0.10
    switch (context.entryPoint) {
      case 'challenge-card':
        scores.guided += 40 * entryWeight
        scores.practice += 10 * entryWeight
        scores.explore += 5 * entryWeight
        break
      case 'sandbox-link':
        scores.guided += 5 * entryWeight
        scores.practice += 20 * entryWeight
        scores.explore += 40 * entryWeight
        break
      case 'homepage':
        scores.guided += 25 * entryWeight
        scores.practice += 30 * entryWeight
        scores.explore += 20 * entryWeight
        break
      case 'direct-link':
      case 'bridge':
        // Neutral - no strong preference
        scores.guided += 20 * entryWeight
        scores.practice += 25 * entryWeight
        scores.explore += 25 * entryWeight
        break
    }

    // Bonus adjustments based on session context
    this.applySessionBonuses(scores, context)
    
    // Normalize scores to 0-100 range
    return this.normalizeScores(scores)
  }

  /**
   * Apply contextual bonuses based on session-specific factors
   */
  private static applySessionBonuses(scores: Record<string, number>, context: UserContext) {
    // Time-based adjustments (shorter sessions favor guided mode)
    if (context.sessionTime < 5 * 60 * 1000) { // Less than 5 minutes
      scores.guided += 5
      scores.practice += 2
    }

    // Error frequency adjustments
    if (context.errorFrequency === 'high') {
      scores.guided += 8
      scores.practice += 3
      scores.explore -= 2
    } else if (context.errorFrequency === 'low') {
      scores.explore += 5
      scores.practice += 3
    }

    // Device type adjustments
    if (context.deviceType === 'mobile') {
      // Mobile users benefit from simpler, guided experiences
      scores.guided += 7
      scores.practice += 3
      scores.explore -= 5
    }

    // Previous session adjustments
    if (context.previousSessions === 0) {
      scores.guided += 10 // New users should start guided
    } else if (context.previousSessions > 10) {
      scores.explore += 5 // Experienced users might want more freedom
    }
  }

  /**
   * Normalize scores to 0-100 confidence range
   */
  private static normalizeScores(scores: Record<string, number>): Record<string, number> {
    const max = Math.max(...Object.values(scores))
    const min = Math.min(...Object.values(scores))
    const range = max - min || 1

    const normalized: Record<string, number> = {}
    for (const [mode, score] of Object.entries(scores)) {
      // Scale to 0-100 range, with minimum confidence of 20
      normalized[mode] = Math.max(20, Math.round(((score - min) / range) * 80 + 20))
    }

    return normalized
  }

  /**
   * Get the top scoring mode
   */
  private static getTopMode(scores: Record<string, number>): { modeId: 'guided' | 'practice' | 'explore', score: number } {
    const sortedModes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
    
    return {
      modeId: sortedModes[0][0] as 'guided' | 'practice' | 'explore',
      score: sortedModes[0][1]
    }
  }

  /**
   * Generate human-readable reasoning for the recommendation
   */
  private static generateReasoning(context: UserContext, scores: Record<string, number>): string[] {
    const reasoning: string[] = []

    // Primary factors
    if (context.hasActiveChallenges) {
      reasoning.push("You have active challenges that benefit from guided feedback")
    }

    if (context.experience === 'beginner') {
      reasoning.push("As a beginner, structured learning helps build confidence")
    }

    if (context.experience === 'advanced' && context.codeSource === 'scratch') {
      reasoning.push("Your experience level suggests you'll benefit from creative freedom")
    }

    if (context.codeSource === 'template') {
      reasoning.push("Template-based work often benefits from practice mode features")
    }

    if (context.recentActivity === 'debugging') {
      reasoning.push("Your debugging focus aligns with guided challenge features")
    }

    if (context.errorFrequency === 'high') {
      reasoning.push("Real-time feedback can help reduce errors and improve learning")
    }

    // Fallback reasoning if no specific factors
    if (reasoning.length === 0) {
      const topMode = this.getTopMode(scores).modeId
      reasoning.push(`Based on your overall context, ${topMode} mode offers the best experience`)
    }

    return reasoning
  }

  /**
   * Get alternative mode recommendations
   */
  private static getAlternatives(scores: Record<string, number>, topMode: string): Array<{
    modeId: 'guided' | 'practice' | 'explore'
    confidence: number
    reason: string
  }> {
    const alternatives = Object.entries(scores)
      .filter(([mode]) => mode !== topMode)
      .sort(([, a], [, b]) => b - a)
      .map(([mode, score]) => ({
        modeId: mode as 'guided' | 'practice' | 'explore',
        confidence: score,
        reason: this.getAlternativeReason(mode as 'guided' | 'practice' | 'explore')
      }))

    return alternatives
  }

  /**
   * Get reason for alternative mode suggestions
   */
  private static getAlternativeReason(mode: 'guided' | 'practice' | 'explore'): string {
    const reasons = {
      guided: "Try this if you want step-by-step guidance and immediate feedback",
      practice: "Switch to this for template-based learning with flexible pacing", 
      explore: "Choose this for complete creative freedom and experimentation"
    }
    return reasons[mode]
  }

  /**
   * Track user behavior to improve future recommendations
   */
  static recordModeUsage(
    context: UserContext, 
    recommendedMode: string, 
    actualMode: string, 
    sessionDuration: number,
    userSatisfaction?: 'positive' | 'neutral' | 'negative'
  ) {
    // This would typically save to localStorage or send to analytics
    const usage = {
      timestamp: Date.now(),
      context,
      recommendedMode,
      actualMode,
      sessionDuration,
      userSatisfaction,
      modeOverride: recommendedMode !== actualMode
    }

    // Store in localStorage for local learning
    const history = JSON.parse(localStorage.getItem('build-mode-usage') || '[]')
    history.push(usage)
    
    // Keep only last 50 entries to avoid excessive storage
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
    
    localStorage.setItem('build-mode-usage', JSON.stringify(history))
  }

  /**
   * Get personalized insights based on usage history
   */
  static getPersonalizedInsights(): string[] {
    const history = JSON.parse(localStorage.getItem('build-mode-usage') || '[]')
    const insights: string[] = []

    if (history.length === 0) return insights

    // Analyze mode preferences
    const modeUsage = history.reduce((acc: Record<string, number>, entry: any) => {
      acc[entry.actualMode] = (acc[entry.actualMode] || 0) + 1
      return acc
    }, {})

    const favoriteMode = Object.entries(modeUsage)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0]

    if (favoriteMode) {
      insights.push(`You tend to prefer ${favoriteMode} mode`)
    }

    // Analyze override patterns
    const overrides = history.filter((entry: any) => entry.modeOverride)
    if (overrides.length > history.length * 0.3) {
      insights.push("You often choose different modes than recommended")
    }

    // Session duration insights
    const avgDuration = history.reduce((sum: number, entry: any) => sum + entry.sessionDuration, 0) / history.length
    if (avgDuration > 30 * 60 * 1000) { // 30+ minutes
      insights.push("You have long coding sessions - explore mode might suit you well")
    }

    return insights
  }
}