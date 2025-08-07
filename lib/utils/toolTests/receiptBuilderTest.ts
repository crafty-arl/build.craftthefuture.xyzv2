import { BaseToolTest, CompileResult, TestResult } from '../toolTestFramework'

export class ReceiptBuilderTest extends BaseToolTest {
  toolId = 'receipt-builder'

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
    
    // Bug 1: Missing form handling
    if (!code.includes('onSubmit') && !code.includes('preventDefault')) {
      bugs.push('missing-form-handling')
    }
    
    // Bug 2: Missing calculation
    if (!code.includes('parseFloat') && !code.includes('Number(')) {
      bugs.push('missing-calculation')
    }
    
    return bugs
  }

  async testValidInputs(): Promise<TestResult> {
    const testCode = `
      function calculateTotal(items) {
        return items.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return total + (price * quantity);
        }, 0);
      }
    `
    
    const items = [
      { name: 'Apple', price: '1.50', quantity: '2' },
      { name: 'Banana', price: '0.75', quantity: '3' }
    ]
    
    try {
      const result = await this.executeCode(testCode, { items })
      const expectedTotal = (1.50 * 2) + (0.75 * 3)
      
      return {
        success: Math.abs(result - expectedTotal) < 0.01,
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
      function calculateTotal(items) {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return total + (price * quantity);
        }, 0);
      }
    `
    
    try {
      const result1 = await this.executeCode(testCode, { items: null })
      const result2 = await this.executeCode(testCode, { items: [] })
      
      return {
        success: result1 === 0 && result2 === 0,
        output: { result1, result2 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testFormSubmission(): Promise<TestResult> {
    const testCode = `
      function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const items = [];
        // Process form data
        return items;
      }
    `
    
    try {
      // Mock form submission
      const mockEvent = {
        preventDefault: () => {},
        target: {
          elements: {
            itemName: { value: 'Test Item' },
            itemPrice: { value: '10.00' },
            itemQuantity: { value: '2' }
          }
        }
      }
      
      const result = await this.executeCode(testCode, { event: mockEvent })
      
      return {
        success: Array.isArray(result),
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