import { ToolTestConfig, CompileResult, TestResult } from './toolTestFramework'

export interface CompilationResult {
  toolId: string
  success: boolean
  results: {
    syntax: CompileResult
    runtime: CompileResult
    bugDetection: string[]
    integration: TestResult[]
  }
}

export class CompilationTester {
  static async testToolCompilation(toolId: string, code: string): Promise<CompilationResult> {
    const toolTests = this.getToolTests(toolId)
    
    const [syntaxResult, runtimeResult, bugDetectionResult, integrationResult] = await Promise.all([
      this.testSyntax(code),
      this.testRuntime(code),
      this.testBugDetection(code, toolTests.bugs),
      this.testIntegration(code, toolTests.integration)
    ])
    
    return {
      toolId,
      success: syntaxResult.success && runtimeResult.success,
      results: {
        syntax: syntaxResult,
        runtime: runtimeResult,
        bugDetection: bugDetectionResult,
        integration: integrationResult
      }
    }
  }

  private static getToolTests(toolId: string): ToolTestConfig {
    const testConfigs: { [key: string]: ToolTestConfig } = {
      'date-calculator': {
        bugs: ['missing-validation', 'missing-calculation-methods'],
        integration: ['valid-inputs', 'invalid-inputs', 'edge-cases']
      },
      'product-name-generator': {
        bugs: ['missing-array-mapping', 'limited-variety'],
        integration: ['name-generation', 'suffix-mapping', 'output-format']
      },
      'receipt-builder': {
        bugs: ['missing-form-handling', 'missing-calculation'],
        integration: ['form-submission', 'calculation-accuracy', 'data-persistence']
      },
      'poll-maker': {
        bugs: ['missing-state-updates', 'missing-event-handling'],
        integration: ['vote-counting', 'state-management', 'ui-updates']
      },
      'bio-generator': {
        bugs: ['missing-random-selection', 'limited-arrays'],
        integration: ['bio-generation', 'random-selection', 'output-format']
      }
    }
    
    return testConfigs[toolId] || { bugs: [], integration: [] }
  }

  private static async testSyntax(code: string): Promise<CompileResult> {
    try {
      // Basic syntax check using Function constructor
      new Function(code)
      return {
        success: true,
        errors: []
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown syntax error']
      }
    }
  }

  private static async testRuntime(code: string): Promise<CompileResult> {
    try {
      // Test if code can be executed safely
      const testContext = {
        startDate: new Date(),
        endDate: new Date(),
        names: ['Test'],
        jobs: ['Test'],
        hobbies: ['Test'],
        items: [],
        votes: {},
        setVotes: () => {},
        suffixes: ['Test']
      }
      
      const func = new Function(...Object.keys(testContext), code)
      func(...Object.values(testContext))
      
      return {
        success: true,
        errors: []
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Runtime error']
      }
    }
  }

  private static async testBugDetection(code: string, expectedBugs: string[]): Promise<string[]> {
    const detectedBugs: string[] = []
    
    // Check for common bug patterns
    if (expectedBugs.includes('missing-validation')) {
      if (!code.includes('if (!') && !code.includes('if (!')) {
        detectedBugs.push('missing-validation')
      }
    }
    
    if (expectedBugs.includes('missing-calculation-methods')) {
      if (!code.includes('Math.abs') && !code.includes('Math.ceil')) {
        detectedBugs.push('missing-calculation-methods')
      }
    }
    
    if (expectedBugs.includes('missing-array-mapping')) {
      if (!code.includes('.map(') && !code.includes('suffixes.map')) {
        detectedBugs.push('missing-array-mapping')
      }
    }
    
    if (expectedBugs.includes('missing-random-selection')) {
      if (!code.includes('Math.random') && !code.includes('Math.floor')) {
        detectedBugs.push('missing-random-selection')
      }
    }
    
    if (expectedBugs.includes('missing-form-handling')) {
      if (!code.includes('onSubmit') && !code.includes('preventDefault')) {
        detectedBugs.push('missing-form-handling')
      }
    }
    
    if (expectedBugs.includes('missing-state-updates')) {
      if (!code.includes('setVotes') && !code.includes('prev =>')) {
        detectedBugs.push('missing-state-updates')
      }
    }
    
    return detectedBugs
  }

  private static async testIntegration(code: string, integrationTests: string[]): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    for (const test of integrationTests) {
      try {
        let result: TestResult
        
        switch (test) {
          case 'valid-inputs':
            result = await this.testValidInputs(code)
            break
          case 'invalid-inputs':
            result = await this.testInvalidInputs(code)
            break
          case 'edge-cases':
            result = await this.testEdgeCases(code)
            break
          default:
            result = { success: false, error: `Unknown integration test: ${test}` }
        }
        
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Integration test failed'
        })
      }
    }
    
    return results
  }

  private static async testValidInputs(code: string): Promise<TestResult> {
    try {
      // Test with valid inputs
      const testContext = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-10'),
        names: ['Alex', 'Sam'],
        jobs: ['Engineer', 'Designer'],
        hobbies: ['reading', 'coding'],
        items: [{ name: 'Item', price: '10', quantity: '2' }],
        votes: { 'option1': 5 },
        setVotes: (updater: any) => updater,
        suffixes: ['Pro', 'Plus']
      }
      
      const func = new Function(...Object.keys(testContext), code)
      const result = func(...Object.values(testContext))
      
      return {
        success: result !== undefined,
        output: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Valid inputs test failed'
      }
    }
  }

  private static async testInvalidInputs(code: string): Promise<TestResult> {
    try {
      // Test with invalid inputs
      const testContext = {
        startDate: null,
        endDate: null,
        names: null,
        jobs: null,
        hobbies: null,
        items: null,
        votes: null,
        setVotes: null,
        suffixes: null
      }
      
      const func = new Function(...Object.keys(testContext), code)
      const result = func(...Object.values(testContext))
      
      return {
        success: true, // Should handle invalid inputs gracefully
        output: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid inputs test failed'
      }
    }
  }

  private static async testEdgeCases(code: string): Promise<TestResult> {
    try {
      // Test edge cases
      const testContext = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'), // Same day
        names: [],
        jobs: [],
        hobbies: [],
        items: [],
        votes: {},
        setVotes: () => {},
        suffixes: []
      }
      
      const func = new Function(...Object.keys(testContext), code)
      const result = func(...Object.values(testContext))
      
      return {
        success: true, // Should handle edge cases gracefully
        output: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Edge cases test failed'
      }
    }
  }
} 