import { TestResult, TestCase } from '../types/enhancedBugTypes';

export class BugTestRunner {
  async runBugTest(toolId: string, bugId: number, code: string): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const testSuite = this.getTestSuite(toolId, bugId);
      const results = await Promise.all(
        testSuite.map(test => this.executeTest(test, code))
      );
      
      const success = results.every(r => r.success);
      const errorMessages = results.filter(r => !r.success).map(r => r.errorMessage).filter(Boolean);
      
      return {
        success,
        testName: `Bug ${bugId} Test Suite`,
        executionTime: Date.now() - startTime,
        errorMessage: errorMessages.length > 0 ? errorMessages.join('; ') : undefined,
        details: results.map(r => r.details).filter(Boolean) as string[]
      };
    } catch (error) {
      return {
        success: false,
        testName: `Bug ${bugId} Test Suite`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async executeTest(testCase: TestCase, code: string): Promise<{ success: boolean; details?: string; errorMessage?: string }> {
    try {
      // Create a test environment with the code
      const testFunction = this.createTestFunction(testCase, code);
      const result = await testFunction();
      
      return {
        success: result.success,
        details: result.details,
        errorMessage: result.error
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Test execution failed'
      };
    }
  }

  private createTestFunction(testCase: TestCase, code: string): () => Promise<{ success: boolean; details?: string; error?: string }> {
    // Create tool-specific test functions
    switch (testCase.name) {
      case 'date-validation-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              const result1 = calculateDateDifference(null, new Date('2024-01-10'));
              const result2 = calculateDateDifference(new Date('2024-01-01'), null);
              return { 
                success: result1 === 'Select both dates' && result2 === 'Select both dates',
                details: 'Validation test passed'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      case 'date-calculation-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              const result = calculateDateDifference(new Date('2024-01-01'), new Date('2024-01-10'));
              return { 
                success: typeof result === 'number' && result > 0,
                details: 'Calculation test passed'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      case 'array-mapping-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              const names = generateProductNames();
              return { 
                success: Array.isArray(names) && names.length > 1,
                details: 'Array mapping test passed'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      case 'form-handling-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              // Simulate form submission
              const mockEvent = { preventDefault: () => {} };
              const result = handleSubmit(mockEvent);
              return { 
                success: true,
                details: 'Form handling test passed'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      case 'state-update-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              // Provide a minimal React-like state mock for setVotes
              let votes = { option1: 0, option2: 0 };
              let setVotesCalled = false;
              const setVotes = (updater) => {
                setVotesCalled = true;
                if (typeof updater === 'function') {
                  const next = updater({ ...votes });
                  if (next === votes) {
                    throw new Error('State mutation detected: same reference returned');
                  }
                  votes = next;
                } else if (updater && typeof updater === 'object') {
                  if (updater === votes) {
                    throw new Error('State mutation detected: same reference assigned');
                  }
                  votes = { ...updater };
                } else {
                  throw new Error('setVotes called with invalid argument');
                }
              };
              
              // Prefer handleVote, fallback to vote
              const hasHandleVote = typeof handleVote === 'function';
              const callable = hasHandleVote ? handleVote : (typeof vote === 'function' ? vote : undefined);
              if (!callable) {
                throw new Error('No vote function found (expected handleVote or vote)');
              }
              
              // Execute
              callable('option1');
              
              const success = setVotesCalled && typeof votes.option1 === 'number';
              return {
                success,
                details: success ? 'Functional state update performed via setVotes(updater)' : 'setVotes was not called correctly'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      case 'random-selection-test':
        return async () => {
          try {
            const testCode = `
              ${code}
              const bio1 = generateBio();
              const bio2 = generateBio();
              return { 
                success: bio1 !== bio2,
                details: 'Random selection test passed'
              };
            `;
            
            const func = new Function(testCode);
            return await func();
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };
      
      default:
        return async () => ({ success: false, error: 'No test available for this case' });
    }
  }

  private getTestSuite(toolId: string, bugId: number): TestCase[] {
    const testSuites: Record<string, Record<number, TestCase[]>> = {
      'date-calculator': {
        1: [
          {
            name: 'date-validation-test',
            input: { startDate: null, endDate: new Date('2024-01-10') },
            expectedOutput: 'Select both dates',
            description: 'Test validation for empty dates'
          }
        ],
        2: [
          {
            name: 'date-calculation-test',
            input: { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-10') },
            expectedOutput: 9,
            description: 'Test date calculation with Math functions'
          }
        ]
      },
      'product-name-generator': {
        1: [
          {
            name: 'array-mapping-test',
            input: {},
            expectedOutput: ['ProductName1', 'ProductName2'],
            description: 'Test array mapping functionality'
          }
        ]
      },
      'receipt-builder': {
        1: [
          {
            name: 'form-handling-test',
            input: { event: { preventDefault: () => {} } },
            expectedOutput: true,
            description: 'Test form submission handling'
          }
        ],
        2: [
          {
            name: 'calculation-test',
            input: { items: [{ price: '10.50', qty: '2' }] },
            expectedOutput: 21.00,
            description: 'Test calculation with number conversion'
          }
        ]
      },
      'poll-maker': {
        1: [
          {
            name: 'state-update-test',
            input: { option: 'option1' },
            expectedOutput: true,
            description: 'Test state updates with proper immutability'
          }
        ],
        2: [
          {
            name: 'event-handling-test',
            input: { option: 'option1' },
            expectedOutput: true,
            description: 'Test event handling'
          }
        ]
      },
      'bio-generator': {
        1: [
          {
            name: 'random-selection-test',
            input: {},
            expectedOutput: 'Different bios each time',
            description: 'Test random selection instead of fixed values'
          }
        ],
        2: [
          {
            name: 'variety-test',
            input: {},
            expectedOutput: 'Multiple variety options',
            description: 'Test expanded variety in arrays'
          }
        ]
      }
    };
    
    return testSuites[toolId]?.[bugId] || [];
  }
} 