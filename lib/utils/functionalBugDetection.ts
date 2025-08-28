// Integration layer for functional bug detection
// This replaces the pattern-based system with actual behavior testing

import { FunctionalTestSystem } from './functionalTestSystem'

export interface BugDetectionResult {
  toolId: string
  totalBugs: number
  fixedBugs: number[]
  testResults: Array<{
    bugId: number
    name: string
    isFixed: boolean
    confidence: number
    details: string
    testName: string
    executionTime: number
  }>
}

export class FunctionalBugDetection {
  
  /**
   * Main method that replaces BugTestCases.getDetailedTestResults()
   * This performs ONLY functional testing - no pattern matching
   */
  static async getDetailedTestResults(toolId: string, code: string): Promise<BugDetectionResult> {
    try {
      const functionalResult = await FunctionalTestSystem.testTool(toolId, code)
      
      // Convert functional test results to the expected format
      const testResults = functionalResult.testResults.map(result => ({
        bugId: result.bugId,
        name: this.getBugName(toolId, result.bugId),
        isFixed: result.isFixed,
        // Enforce functional-first confidence shaping (0-100)
        confidence: result.isFixed ? Math.max(80, Math.min(99, result.confidence)) : Math.min(20, result.confidence),
        details: result.details,
        testName: result.testName,
        executionTime: result.executionTime
      }))
      
      return {
        toolId: functionalResult.toolId,
        totalBugs: functionalResult.totalBugs,
        fixedBugs: functionalResult.fixedBugs,
        testResults
      }
    } catch (error) {
      console.error(`Functional bug detection failed for ${toolId}:`, error)
      
      // Return empty results on error
      return {
        toolId,
        totalBugs: 0,
        fixedBugs: [],
        testResults: []
      }
    }
  }
  
  /**
   * Test a specific bug for a tool (replaces functionalTest method)
   */
  static async testSpecificBug(toolId: string, bugId: number, code: string): Promise<{
    isFixed: boolean
    confidence: number
    details: string
  }> {
    try {
      const result = await FunctionalTestSystem.testTool(toolId, code)
      const bugResult = result.testResults.find(r => r.bugId === bugId)
      
      if (bugResult) {
        return {
          isFixed: bugResult.isFixed,
          confidence: bugResult.confidence,
          details: bugResult.details
        }
      } else {
        return {
          isFixed: false,
          confidence: 0,
          details: `Bug ${bugId} not found for tool ${toolId}`
        }
      }
    } catch (error) {
      return {
        isFixed: false,
        confidence: 0,
        details: `Functional test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Get bug names for each tool
   */
  private static getBugName(toolId: string, bugId: number): string {
    const bugNames: Record<string, Record<number, string>> = {
      'poll-maker': {
        1: 'State Mutation'
      },
      'date-calculator': {
        1: 'Missing Validation',
        2: 'Calculation Errors'
      },
      'product-name-generator': {
        1: 'Single Name Generation'
      },
      'receipt-builder': {
        1: 'State Mutation',
        2: 'Incorrect Total Calculation'
      },
      'bio-generator': {
        1: 'Not Actually Random',
        2: 'Limited Variety'
      }
    }
    
    return bugNames[toolId]?.[bugId] || `Bug ${bugId}`
  }
  
  /**
   * Check if a tool has any bugs fixed
   */
  static async hasFixedBugs(toolId: string, code: string): Promise<boolean> {
    const result = await this.getDetailedTestResults(toolId, code)
    return result.fixedBugs.length > 0
  }
  
  /**
   * Get completion percentage for a tool
   */
  static async getCompletionPercentage(toolId: string, code: string): Promise<number> {
    const result = await this.getDetailedTestResults(toolId, code)
    if (result.totalBugs === 0) return 0
    return Math.round((result.fixedBugs.length / result.totalBugs) * 100)
  }
  
  /**
   * Get performance metrics for debugging
   */
  static async getPerformanceMetrics(toolId: string, code: string): Promise<{
    totalExecutionTime: number
    averageTestTime: number
    testsRun: number
    successRate: number
  }> {
    const result = await this.getDetailedTestResults(toolId, code)
    
    const totalExecutionTime = result.testResults.reduce((sum, test) => sum + test.executionTime, 0)
    const testsRun = result.testResults.length
    const successfulTests = result.testResults.filter(test => test.isFixed).length
    
    return {
      totalExecutionTime,
      averageTestTime: testsRun > 0 ? totalExecutionTime / testsRun : 0,
      testsRun,
      successRate: testsRun > 0 ? (successfulTests / testsRun) * 100 : 0
    }
  }
} 