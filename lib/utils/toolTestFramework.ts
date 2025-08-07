export interface ToolTest {
  toolId: string
  testCases: TestCase[]
  compileTests: CompileTest[]
  integrationTests: IntegrationTest[]
}

export interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  bugDetection: BugDetection[]
}

export interface CompileTest {
  id: string
  name: string
  code: string
  shouldCompile: boolean
  expectedErrors?: string[]
}

export interface IntegrationTest {
  id: string
  name: string
  setup: () => Promise<void>
  test: () => Promise<boolean>
  cleanup: () => Promise<void>
}

export interface BugDetection {
  id: string
  name: string
  pattern: string | RegExp
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface CompileResult {
  success: boolean
  errors?: string[]
  warnings?: string[]
}

export interface TestResult {
  success: boolean
  output?: any
  error?: string
  duration?: number
}

export interface ToolTestResult {
  toolId: string
  passed: number
  total: number
  results: TestResult[]
  compileResults: CompileResult[]
  integrationResults: TestResult[]
}

export interface ToolTestConfig {
  bugs: string[]
  integration: string[]
}

export abstract class BaseToolTest {
  abstract toolId: string
  
  abstract compileTest(code: string): CompileResult
  abstract detectBugs(code: string): string[]
  abstract testValidInputs(): Promise<TestResult>
  abstract testInvalidInputs(): Promise<TestResult>
  
  protected checkSyntax(code: string): { valid: boolean; errors: string[] } {
    try {
      // Basic syntax check using Function constructor
      new Function(code)
      return { valid: true, errors: [] }
    } catch (error) {
      return { valid: false, errors: [error instanceof Error ? error.message : 'Unknown error'] }
    }
  }
  
  protected async executeCode(code: string, context: any): Promise<any> {
    try {
      // Create a safe execution environment
      const func = new Function(...Object.keys(context), code)
      return func(...Object.values(context))
    } catch (error) {
      throw new Error(`Code execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
} 