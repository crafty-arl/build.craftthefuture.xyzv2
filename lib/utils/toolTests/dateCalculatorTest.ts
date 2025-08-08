import { BaseToolTest, CompileResult, TestResult } from '../toolTestFramework'

export class DateCalculatorTest extends BaseToolTest {
  toolId = 'date-calculator'

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
    
    // Bug 1: Missing validation
    if (!code.includes('if (!startDate') && !code.includes('if (!endDate')) {
      bugs.push('missing-validation')
    }
    
    // Bug 2: Missing Math.abs and Math.ceil
    if (!code.includes('Math.abs') || !code.includes('Math.ceil')) {
      bugs.push('missing-calculation-methods')
    }
    
    return bugs
  }

  async testValidInputs(): Promise<TestResult> {
    const testCode = `
      function calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) return 'Select both dates';
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return calculateDateDifference(startDate, endDate)
    `
    
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-10')
    
    try {
      const result = await this.executeCode(testCode, { startDate, endDate })
      return {
        success: typeof result === 'number' && result > 0,
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
      function calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) return 'Select both dates';
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    `
    
    try {
      const result1 = await this.executeCode(testCode + "\nreturn calculateDateDifference(startDate, endDate)", { startDate: null, endDate: new Date() })
      const result2 = await this.executeCode(testCode + "\nreturn calculateDateDifference(startDate, endDate)", { startDate: new Date(), endDate: null })
      
      return {
        success: result1 === 'Select both dates' && result2 === 'Select both dates',
        output: { result1, result2 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testEdgeCases(): Promise<TestResult> {
    const testCode = `
      function calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) return 'Select both dates';
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    `
    
    try {
      // Same day
      const sameDay = await this.executeCode(testCode + "\nreturn calculateDateDifference(startDate, endDate)", { 
        startDate: new Date('2024-01-01'), 
        endDate: new Date('2024-01-01') 
      })
      
      // Future date
      const futureDate = await this.executeCode(testCode + "\nreturn calculateDateDifference(startDate, endDate)", { 
        startDate: new Date('2024-01-01'), 
        endDate: new Date('2024-12-31') 
      })
      
      return {
        success: sameDay === 0 && futureDate > 0,
        output: { sameDay, futureDate }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
} 