import { BaseToolTest, CompileResult, TestResult } from '../toolTestFramework'

export class BioGeneratorTest extends BaseToolTest {
  toolId = 'bio-generator'

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
    
    // Bug 1: Missing random selection
    if (!code.includes('Math.floor(Math.random') && !code.includes('Math.random() *')) {
      bugs.push('missing-random-selection')
    }
    
    // Bug 2: Limited arrays (not expanded)
    if (!code.includes('Morgan') && !code.includes('Riley') && !code.includes('Quinn')) {
      bugs.push('limited-arrays')
    }
    
    return bugs
  }

  async testValidInputs(): Promise<TestResult> {
    const testCode = `
      function generateBio(names, jobs, hobbies) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
        
        return \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`;
      }
    `
    
    const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
    const jobs = ['Software Engineer', 'Designer', 'Teacher', 'Chef', 'Artist']
    const hobbies = ['reading', 'hiking', 'cooking', 'gaming', 'painting']
    
    try {
      const result = await this.executeCode(testCode + "\nreturn generateBio(names, jobs, hobbies)", { names, jobs, hobbies })
      
      return {
        success: typeof result === 'string' && result.includes(' is a ') && result.includes(' who loves '),
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
      function generateBio(names, jobs, hobbies) {
        if (!names || !jobs || !hobbies) return 'Invalid input';
        if (names.length === 0 || jobs.length === 0 || hobbies.length === 0) return 'Empty arrays';
        
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
        
        return \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`;
      }
    `
    
    try {
      const result1 = await this.executeCode(testCode + "\nreturn generateBio(names, jobs, hobbies)", { names: null, jobs: [], hobbies: [] })
      const result2 = await this.executeCode(testCode + "\nreturn generateBio(names, jobs, hobbies)", { names: [], jobs: ['Job'], hobbies: ['Hobby'] })
      
      return {
        success: result1 === 'Invalid input' && result2 === 'Empty arrays',
        output: { result1, result2 }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testBioGeneration(): Promise<TestResult> {
    const testCode = `
      function generateBio(names, jobs, hobbies) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
        
        return \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`;
      }
    `
    
    try {
      const names = ['Morgan', 'Riley', 'Quinn']
      const jobs = ['Doctor', 'Writer', 'Musician']
      const hobbies = ['photography', 'yoga', 'travel']
      
      const result = await this.executeCode(testCode + "\nreturn generateBio(names, jobs, hobbies)", { names, jobs, hobbies })
      
      // Check if the result contains expected patterns
      const hasName = names.some(name => result.includes(name))
      const hasJob = jobs.some(job => result.includes(job))
      const hasHobby = hobbies.some(hobby => result.includes(hobby))
      
      return {
        success: hasName && hasJob && hasHobby,
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