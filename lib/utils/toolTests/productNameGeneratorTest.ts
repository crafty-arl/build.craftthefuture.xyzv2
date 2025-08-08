import { BaseToolTest, CompileResult, TestResult } from '../toolTestFramework'

export class ProductNameGeneratorTest extends BaseToolTest {
  toolId = 'product-name-generator'

  compileTest(code: string): CompileResult {
    try {
      const syntaxCheck = this.checkSyntax(code)
      return {
        success: syntaxCheck.valid,
        errors: syntaxCheck.errors
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  detectBugs(code: string): string[] {
    const bugs: string[] = []
    
    // Bug 1: Missing array mapping
    if (!code.includes('suffixes.map') && !code.includes('.map(suffix')) {
      bugs.push('missing-array-mapping')
    }
    
    // Bug 2: Limited variety (not using random selection)
    if (!code.includes('Math.random') && !code.includes('Math.floor')) {
      bugs.push('limited-variety')
    }
    
    return bugs
  }

  async testValidInputs(): Promise<TestResult> {
    const testCode = `
      function generateProductNames(baseName, suffixes) {
        const newNames = suffixes.map(suffix => baseName + suffix);
        return newNames;
      }
      return generateProductNames(baseName, suffixes)
    `
    
    const baseName = 'Tech'
    const suffixes = ['Pro', 'Plus', 'Max', 'Ultra']
    
    try {
      const result = await this.executeCode(testCode, { baseName, suffixes })
      return {
        success: Array.isArray(result) && result.length === 4,
        output: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testInvalidInputs(): Promise<TestResult> {
    const testCode = `
      function generateProductNames(baseName, suffixes) {
        if (!baseName || !suffixes) return [];
        const newNames = suffixes.map(suffix => baseName + suffix);
        return newNames;
      }
    `
    
    try {
      const result1 = await this.executeCode(testCode + "\nreturn generateProductNames(baseName, suffixes)", { baseName: null, suffixes: ['Pro'] })
      const result2 = await this.executeCode(testCode + "\nreturn generateProductNames(baseName, suffixes)", { baseName: 'Tech', suffixes: null })
      
      return {
        success: Array.isArray(result1) && Array.isArray(result2),
        output: { result1, result2 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testNameGeneration(): Promise<TestResult> {
    const testCode = `
      function generateProductNames(baseName, suffixes) {
        const newNames = suffixes.map(suffix => baseName + suffix);
        return newNames;
      }
    `
    
    try {
      const result = await this.executeCode(testCode + "\nreturn generateProductNames(baseName, suffixes)", { 
        baseName: 'Smart', 
        suffixes: ['Phone', 'Watch', 'Tablet'] 
      })
      
      const expectedNames = ['SmartPhone', 'SmartWatch', 'SmartTablet']
      
      return {
        success: JSON.stringify(result) === JSON.stringify(expectedNames),
        output: result
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
} 