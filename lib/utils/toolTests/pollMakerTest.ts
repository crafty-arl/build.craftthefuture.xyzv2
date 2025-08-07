import { BaseToolTest, CompileResult, TestResult } from '../toolTestFramework'

export class PollMakerTest extends BaseToolTest {
  toolId = 'poll-maker'

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
    
    // Bug 1: Missing state updates
    if (!code.includes('setVotes') && !code.includes('prev =>')) {
      bugs.push('missing-state-updates')
    }
    
    // Bug 2: Missing event handling
    if (!code.includes('onClick') && !code.includes('handleVote')) {
      bugs.push('missing-event-handling')
    }
    
    return bugs
  }

  async testValidInputs(): Promise<TestResult> {
    const testCode = `
      function handleVote(optionId, votes, setVotes) {
        setVotes(prev => ({
          ...prev,
          [optionId]: (prev[optionId] || 0) + 1
        }));
      }
    `
    
    const initialVotes = { 'option1': 5, 'option2': 3 }
    const setVotes = (updater: any) => {
      if (typeof updater === 'function') {
        return updater(initialVotes)
      }
      return updater
    }
    
    try {
      const result = await this.executeCode(testCode, { 
        optionId: 'option1', 
        votes: initialVotes, 
        setVotes 
      })
      
      return {
        success: result['option1'] === 6 && result['option2'] === 3,
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
      function handleVote(optionId, votes, setVotes) {
        if (!optionId || !votes || !setVotes) return;
        setVotes(prev => ({
          ...prev,
          [optionId]: (prev[optionId] || 0) + 1
        }));
      }
    `
    
    try {
      const result1 = await this.executeCode(testCode, { 
        optionId: null, 
        votes: {}, 
        setVotes: () => {} 
      })
      const result2 = await this.executeCode(testCode, { 
        optionId: 'option1', 
        votes: null, 
        setVotes: () => {} 
      })
      
      return {
        success: result1 === undefined && result2 === undefined,
        output: { result1, result2 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testVoteCounting(): Promise<TestResult> {
    const testCode = `
      function calculateTotalVotes(votes) {
        return Object.values(votes).reduce((total, count) => total + count, 0);
      }
    `
    
    try {
      const votes = { 'option1': 10, 'option2': 15, 'option3': 5 }
      const result = await this.executeCode(testCode, { votes })
      
      return {
        success: result === 30,
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