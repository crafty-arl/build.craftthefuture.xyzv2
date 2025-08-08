// Functional Test System - Simple and Reliable
// Tests actual behavior by extracting and running specific functions

export interface FunctionalTestResult {
  bugId: number
  isFixed: boolean
  confidence: number
  details: string
  testName: string
  executionTime: number
  errorMessage?: string
}

export interface ToolFunctionalTestResult {
  toolId: string
  totalBugs: number
  fixedBugs: number[]
  testResults: FunctionalTestResult[]
  overallSuccess: boolean
}

export class FunctionalTestSystem {
  
  /**
   * Main entry point - tests all bugs for a given tool
   */
  static async testTool(toolId: string, code: string): Promise<ToolFunctionalTestResult> {
    try {
      const testResults: FunctionalTestResult[] = []
      
      switch (toolId) {
        case 'poll-maker':
          testResults.push(...await this.testPollMaker(code))
          break
        case 'date-calculator':
          testResults.push(...await this.testDateCalculator(code))
          break
        case 'product-name-generator':
          testResults.push(...await this.testProductNameGenerator(code))
          break
        case 'receipt-builder':
          testResults.push(...await this.testReceiptBuilder(code))
          break
        case 'bio-generator':
          testResults.push(...await this.testBioGenerator(code))
          break
        default:
          throw new Error(`Unknown tool: ${toolId}`)
      }
      
      const fixedBugs = testResults
        .filter(result => result.isFixed)
        .map(result => result.bugId)
      
      return {
        toolId,
        totalBugs: testResults.length,
        fixedBugs,
        testResults,
        overallSuccess: fixedBugs.length === testResults.length
      }
    } catch (error) {
      console.error(`Error testing tool ${toolId}:`, error)
      return {
        toolId,
        totalBugs: 0,
        fixedBugs: [],
        testResults: [],
        overallSuccess: false
      }
    }
  }

  /**
   * DATE CALCULATOR TESTS - Simple and Direct
   */
  private static async testDateCalculator(code: string): Promise<FunctionalTestResult[]> {
    const results: FunctionalTestResult[] = []
    
    // Test Bug 1: Empty Date Validation
    const bug1Result = await this.executeTest('date-validation', async () => {
      // Extract the calculateDays function directly
      const calculateFunction = this.extractCalculateDaysFunction(code)
      
      const testCode = `
        // Mock state variables
        let startDate = ''
        let endDate = ''
        
        // The user's calculateDays function
        ${calculateFunction}
        
        // Test with empty dates
        const result = calculateDays()
        
        return {
          result: result,
          isNull: result === null,
          isUndefined: result === undefined,
          type: typeof result
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.isNull) {
          return {
            success: true,
            details: '✅ Validation works: Returns null for empty dates',
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: `❌ Validation missing: Returns ${result.result} (${result.type})`,
            confidence: 20
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    // Test Bug 2: Date Calculation
    const bug2Result = await this.executeTest('date-calculation', async () => {
      const calculateFunction = this.extractCalculateDaysFunction(code)
      
      const testCode = `
        // Mock state with valid dates
        let startDate = '2024-01-01'
        let endDate = '2024-01-10'
        
        // The user's calculateDays function
        ${calculateFunction}
        
        // Test calculation
        const result = calculateDays()
        
        return {
          result: result,
          isNumber: typeof result === 'number',
          isPositive: result > 0,
          isCorrect: result >= 9 && result <= 10 // Should be 9 days
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.isNumber && result.isPositive && result.isCorrect) {
          return {
            success: true,
            details: `✅ Calculation works: ${result.result} days`,
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: `❌ Calculation failed: ${result.result}`,
            confidence: 25
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    results.push({
      bugId: 1,
      isFixed: bug1Result.success,
      confidence: bug1Result.confidence,
      details: bug1Result.details,
      testName: 'Empty Date Validation',
      executionTime: bug1Result.executionTime,
      errorMessage: bug1Result.errorMessage
    })
    
    results.push({
      bugId: 2,
      isFixed: bug2Result.success,
      confidence: bug2Result.confidence,
      details: bug2Result.details,
      testName: 'Date Calculation',
      executionTime: bug2Result.executionTime,
      errorMessage: bug2Result.errorMessage
    })
    
    return results
  }

  /**
   * POLL MAKER TESTS
   */
  private static async testPollMaker(code: string): Promise<FunctionalTestResult[]> {
    const results: FunctionalTestResult[] = []
    
    const bug1Result = await this.executeTest('poll-state-mutation', async () => {
      const voteFunction = this.extractVoteFunction(code)
      
      const testCode = `
        // Mock state
        let votes = { A: 0, B: 0 }
        let setVotesCalled = 0
        
        const setVotes = (updater) => {
          setVotesCalled++
          if (typeof updater === 'function') {
            const next = updater(votes)
            if (next === votes) {
              throw new Error('State mutation detected')
            }
            votes = next
          }
        }
        
        // User's vote function
        ${voteFunction}
        
        // Test voting
        vote('A')
        
        return {
          votes: votes,
          setVotesCalled: setVotesCalled,
          success: votes.A === 1 && votes.B === 0 && setVotesCalled > 0
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.success) {
          return {
            success: true,
            details: '✅ State updated correctly without mutation',
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: '❌ State mutation detected',
            confidence: 20
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    results.push({
      bugId: 1,
      isFixed: bug1Result.success,
      confidence: bug1Result.confidence,
      details: bug1Result.details,
      testName: 'State Mutation Prevention',
      executionTime: bug1Result.executionTime,
      errorMessage: bug1Result.errorMessage
    })
    
    return results
  }

  /**
   * PRODUCT NAME GENERATOR TESTS
   */
  private static async testProductNameGenerator(code: string): Promise<FunctionalTestResult[]> {
    const results: FunctionalTestResult[] = []
    
    const bug1Result = await this.executeTest('product-names', async () => {
      const generateFunction = this.extractGenerateNamesFunction(code)
      
      const testCode = `
        // Mock state
        let keyword = 'test'
        let names = []
        // Provide a direct setter so generateNames can call setNames
        const setNames = (newNames) => { names = newNames }
        
        const useState = (initial) => {
          if (Array.isArray(initial)) {
            return [names, (newNames) => { names = newNames }]
          }
          return [keyword, (newKeyword) => { keyword = newKeyword }]
        }
        
        // User's generate function
        ${generateFunction}
        
        // Test generation
        generateNames()
        
        return {
          names: names,
          count: names.length,
          hasMultiple: names.length > 1,
          allDifferent: new Set(names).size === names.length
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.hasMultiple && result.allDifferent) {
          return {
            success: true,
            details: `✅ Generated ${result.count} unique names`,
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: `❌ Only generated ${result.count} names`,
            confidence: 30
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    results.push({
      bugId: 1,
      isFixed: bug1Result.success,
      confidence: bug1Result.confidence,
      details: bug1Result.details,
      testName: 'Multiple Name Generation',
      executionTime: bug1Result.executionTime,
      errorMessage: bug1Result.errorMessage
    })
    
    return results
  }

  /**
   * RECEIPT BUILDER TESTS
   */
  private static async testReceiptBuilder(code: string): Promise<FunctionalTestResult[]> {
    const results: FunctionalTestResult[] = []
    
    // Test Bug 1: State Mutation
    const bug1Result = await this.executeTest('receipt-state', async () => {
      const handleChangeFunction = this.extractHandleChangeFunction(code)
      
      const testCode = `
        // Mock state
        let items = [{ name: 'item1', price: '10', qty: '2' }]
        let setItemsCalled = false
        
        // Provide both useState-style setter and a direct setItems for component code
        const useState = (initial) => [
          items,
          (updater) => {
            setItemsCalled = true
            if (typeof updater === 'function') {
              const next = updater(items)
              items = next
            } else {
              items = updater
            }
          }
        ]
        const setItems = (updater) => {
          setItemsCalled = true
          if (typeof updater === 'function') {
            const next = updater(items)
            items = next
          } else {
            items = updater
          }
        }
        
        // User's handleChange function
        ${handleChangeFunction}
        
        // Test changing an item
        const originalItems = items
        handleChange(0, 'name', 'newitem')
        
        return {
          setItemsCalled: setItemsCalled,
          itemsChanged: items[0].name === 'newitem',
          notSameReference: items !== originalItems,
          success: setItemsCalled && items[0].name === 'newitem' && items !== originalItems
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.success) {
          return {
            success: true,
            details: '✅ State updated correctly without mutation',
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: '❌ State mutation detected',
            confidence: 20
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    // Test Bug 2: Total Calculation
    const bug2Result = await this.executeTest('receipt-total', async () => {
      const totalCalculation = this.extractTotalCalculation(code)
      
      const testCode = `
        // Test data
        const items = [
          { name: 'item1', price: '10.50', qty: '2' },
          { name: 'item2', price: '5.25', qty: '3' }
        ]
        
        // User's total calculation
        ${totalCalculation}
        
        return {
          total: total,
          isNumber: typeof total === 'number',
          isCorrect: Math.abs(total - 36.75) < 0.01
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        if (result.isNumber && result.isCorrect) {
          return {
            success: true,
            details: `✅ Total calculated correctly: $${result.total}`,
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: `❌ Incorrect total: ${result.total}`,
            confidence: 25
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    results.push({
      bugId: 1,
      isFixed: bug1Result.success,
      confidence: bug1Result.confidence,
      details: bug1Result.details,
      testName: 'State Mutation Prevention',
      executionTime: bug1Result.executionTime,
      errorMessage: bug1Result.errorMessage
    })
    
    results.push({
      bugId: 2,
      isFixed: bug2Result.success,
      confidence: bug2Result.confidence,
      details: bug2Result.details,
      testName: 'Total Calculation',
      executionTime: bug2Result.executionTime,
      errorMessage: bug2Result.errorMessage
    })
    
    return results
  }

  /**
   * BIO GENERATOR TESTS
   */
  private static async testBioGenerator(code: string): Promise<FunctionalTestResult[]> {
    const results: FunctionalTestResult[] = []
    
    // Test Bug 1: Randomness
    const bug1Result = await this.executeTest('bio-randomness', async () => {
      const arrays = this.extractArrays(code)
      const generateFunction = this.extractGenerateBioFunction(code)
      // Build test code with string concatenation to allow template literals inside user code
      const testCode = [
        "// Mock state",
        "let bio = \"\"",
        "const setBio = (newBio) => { bio = newBio }",
        "",
        "const useState = (initial) => [bio, (newBio) => { bio = newBio }]",
        "",
        "// User's arrays",
        arrays,
        "",
        "// User's generate function",
        generateFunction,
        "",
        "// Test multiple generations",
        "const bios = []",
        "for (let i = 0; i < 10; i++) {",
        "  generateBio()",
        "  bios.push(bio)",
        "}",
        "",
        "const uniqueBios = new Set(bios)",
        "",
        "return {",
        "  uniqueCount: uniqueBios.size,",
        "  totalCount: bios.length,",
        "  hasVariety: uniqueBios.size > 1",
        "}"
      ].join('\n')
      
      try {
        const result = new Function(testCode)()
        
        if (result.hasVariety) {
          return {
            success: true,
            details: `✅ Generated ${result.uniqueCount} unique bios`,
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: '❌ No randomness detected',
            confidence: 15
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    // Test Bug 2: Array Variety
    const bug2Result = await this.executeTest('bio-variety', async () => {
      const arrays = this.extractArrays(code)
      
      const testCode = `
        // User's arrays
        ${arrays}
        
        return {
          namesCount: names ? names.length : 0,
          jobsCount: jobs ? jobs.length : 0,
          hobbiesCount: hobbies ? hobbies.length : 0
        }
      `
      
      try {
        const result = new Function(testCode)()
        
        const hasGoodVariety = result.namesCount >= 6 && result.jobsCount >= 6 && result.hobbiesCount >= 6
        
        if (hasGoodVariety) {
          return {
            success: true,
            details: `✅ Good variety: ${result.namesCount} names, ${result.jobsCount} jobs, ${result.hobbiesCount} hobbies`,
            confidence: 95
          }
        } else {
          return {
            success: false,
            details: `❌ Limited variety: ${result.namesCount} names, ${result.jobsCount} jobs, ${result.hobbiesCount} hobbies`,
            confidence: 40
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          success: false,
          details: `❌ Test failed: ${message}`,
          confidence: 10
        }
      }
    })
    
    results.push({
      bugId: 1,
      isFixed: bug1Result.success,
      confidence: bug1Result.confidence,
      details: bug1Result.details,
      testName: 'Random Selection',
      executionTime: bug1Result.executionTime,
      errorMessage: bug1Result.errorMessage
    })
    
    results.push({
      bugId: 2,
      isFixed: bug2Result.success,
      confidence: bug2Result.confidence,
      details: bug2Result.details,
      testName: 'Array Variety',
      executionTime: bug2Result.executionTime,
      errorMessage: bug2Result.errorMessage
    })
    
    return results
  }

  // Helper method to execute tests
  private static async executeTest(testName: string, testFunction: () => Promise<any>): Promise<{
    success: boolean
    confidence: number
    details: string
    executionTime: number
    errorMessage?: string
  }> {
    const startTime = Date.now()
    
    try {
      const result = await testFunction()
      return {
        success: result.success,
        confidence: result.confidence,
        details: result.details,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        details: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Simple function extraction - no complex parsing
  private static extractCalculateDaysFunction(code: string): string {
    // Look for the calculateDays function in the code
    const match = code.match(/const calculateDays\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\}/m)
    if (match) {
      return `const calculateDays = () => {${match[1]}}`
    }
    
    // Fallback: try to find it within a function component
    const componentMatch = code.match(/function\s+\w+\(\)\s*\{([\s\S]*?)\}/m)
    if (componentMatch) {
      const componentBody = componentMatch[1]
      const logicMatch = componentBody.match(/const calculateDays\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\}/m)
      if (logicMatch) {
        return `const calculateDays = () => {${logicMatch[1]}}`
      }
    }
    
    return 'const calculateDays = () => { throw new Error("Calculate function not found") }'
  }

  private static extractVoteFunction(code: string): string {
    // Helper to extract full arrow function body by balancing braces
    const extractArrow = (varName: string): { params: string, body: string } | null => {
      const declRegex = new RegExp(`(const|let|var)\\s+${varName}\\s*=\\s*\\(`)
      const declMatch = code.match(declRegex)
      if (!declMatch || declMatch.index === undefined) return null
      const startIdx = declMatch.index
      // Find params between ( ... ) before the =>
      const paramsStart = code.indexOf('(', startIdx)
      if (paramsStart === -1) return null
      let depthParens = 1
      let i = paramsStart + 1
      while (i < code.length && depthParens > 0) {
        if (code[i] === '(') depthParens++
        else if (code[i] === ')') depthParens--
        i++
      }
      if (depthParens !== 0) return null
      const paramsEnd = i - 1
      const arrowIdx = code.indexOf('=>', paramsEnd)
      if (arrowIdx === -1) return null
      const bodyStart = code.indexOf('{', arrowIdx)
      if (bodyStart === -1) return null
      let depthBraces = 1
      let j = bodyStart + 1
      while (j < code.length && depthBraces > 0) {
        if (code[j] === '{') depthBraces++
        else if (code[j] === '}') depthBraces--
        j++
      }
      if (depthBraces !== 0) return null
      const params = code.slice(paramsStart + 1, paramsEnd).trim()
      const body = code.slice(bodyStart + 1, j - 1)
      return { params, body }
    }

    // Try direct vote arrow function
    const voteArrow = extractArrow('vote')
    if (voteArrow) {
      return `const vote = (${voteArrow.params}) => {${voteArrow.body}}`
    }

    // Try handleVote arrow and alias to vote
    const handleVoteArrow = extractArrow('handleVote')
    if (handleVoteArrow) {
      return `const handleVote = (${handleVoteArrow.params}) => {${handleVoteArrow.body}}\nconst vote = handleVote`
    }

    // Try function declaration style
    const funcRegexes = [
      /function\s+vote\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/m,
      /function\s+handleVote\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/m
    ]
    for (const rx of funcRegexes) {
      const m = code.match(rx)
      if (m) {
        const [ , params, body ] = m
        if (rx.source.includes('handleVote')) {
          return `function handleVote(${params}){${body}}\nconst vote = handleVote`
        }
        return `function vote(${params}){${body}}`
      }
    }

    return 'const vote = (option) => { throw new Error("Vote function not found") }'
  }

  private static extractGenerateNamesFunction(code: string): string {
    const match = code.match(/const generateNames\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\}/m)
    if (match) {
      return `const generateNames = () => {${match[1]}}`
    }
    return 'const generateNames = () => { throw new Error("Generate function not found") }'
  }

  private static extractHandleChangeFunction(code: string): string {
    try {
      const signature = 'const handleChange'
      const start = code.indexOf(signature)
      if (start === -1) {
        return 'const handleChange = (index, key, value) => { throw new Error("HandleChange function not found") }'
      }
      const arrowIndex = code.indexOf('=>', start)
      if (arrowIndex === -1) {
        return 'const handleChange = (index, key, value) => { throw new Error("HandleChange function not found") }'
      }
      const bodyStart = code.indexOf('{', arrowIndex)
      if (bodyStart === -1) {
        return 'const handleChange = (index, key, value) => { throw new Error("HandleChange function not found") }'
      }
      // Scan forward to find the matching closing brace, handling nested braces
      let depth = 1
      let i = bodyStart + 1
      while (i < code.length && depth > 0) {
        const ch = code[i]
        if (ch === '{') depth++
        else if (ch === '}') depth--
        i++
      }
      if (depth !== 0) {
        return 'const handleChange = (index, key, value) => { throw new Error("HandleChange function not properly closed") }'
      }
      const body = code.slice(bodyStart + 1, i - 1)
      return `const handleChange = (index, key, value) => {${body}}`
    } catch {
      return 'const handleChange = (index, key, value) => { throw new Error("HandleChange extraction failed") }'
    }
  }

  private static extractTotalCalculation(code: string): string {
    // Robustly extract the expression assigned to total (may be multi-line)
    const assignMatch = code.match(/(const|let|var)\s+total\s*=\s*/m)
    if (!assignMatch) return 'const total = 0'
    const assignIndex = (assignMatch.index ?? 0) + assignMatch[0].length
    // Scan forward to find the end of the expression, balancing (), {}, []
    let paren = 0, brace = 0, bracket = 0
    let i = assignIndex
    while (i < code.length) {
      const ch = code[i]
      if (ch === '(') paren++
      else if (ch === ')') paren = Math.max(0, paren - 1)
      else if (ch === '{') brace++
      else if (ch === '}') brace = Math.max(0, brace - 1)
      else if (ch === '[') bracket++
      else if (ch === ']') bracket = Math.max(0, bracket - 1)
      else if ((ch === ';' || ch === '\n') && paren === 0 && brace === 0 && bracket === 0) {
        break
      }
      i++
    }
    const expr = code.slice(assignIndex, i).trim()
    if (!expr) return 'const total = 0'
    return `const total = ${expr}`
  }

  private static extractGenerateBioFunction(code: string): string {
    // Prefer arrow function: const generateBio = () => { ... }
    const arrowDecl = /(const|let|var)\s+generateBio\s*=\s*\(/m
    const arrowMatch = code.match(arrowDecl)
    if (arrowMatch && arrowMatch.index !== undefined) {
      const startIdx = arrowMatch.index
      // Find params end
      const paramsStart = code.indexOf('(', startIdx)
      let depthParens = 1
      let i = paramsStart + 1
      while (i < code.length && depthParens > 0) {
        if (code[i] === '(') depthParens++
        else if (code[i] === ')') depthParens--
        i++
      }
      const arrowIdx = code.indexOf('=>', i)
      if (arrowIdx !== -1) {
        const bodyStart = code.indexOf('{', arrowIdx)
        if (bodyStart !== -1) {
          // Scan to matching brace, skipping strings and template literals
          let depth = 1
          let j = bodyStart + 1
          let inString: null | '"' | "'" = null
          let inTemplate = false
          while (j < code.length && depth > 0) {
            const ch = code[j]
            const prev = code[j - 1]
            if (inString) {
              if (ch === inString && prev !== '\\') inString = null
              j++
              continue
            }
            if (inTemplate) {
              if (ch === '`' && prev !== '\\') { inTemplate = false; j++; continue }
              // Ignore braces inside template literals entirely
              j++
              continue
            }
            if (ch === '"' || ch === "'") { inString = ch as any; j++; continue }
            if (ch === '`') { inTemplate = true; j++; continue }
            if (ch === '{') depth++
            else if (ch === '}') depth--
            j++
          }
          if (depth === 0) {
            const body = code.slice(bodyStart + 1, j - 1)
            return `const generateBio = () => {${body}}`
          }
        }
      }
    }
    // Function declaration fallback: function generateBio() { ... }
    const funcDecl = /function\s+generateBio\s*\(\)\s*\{([\s\S]*?)\}/m
    const funcMatch = code.match(funcDecl)
    if (funcMatch) {
      return `const generateBio = () => {${funcMatch[1]}}`
    }
    // Named function via const generateBio = function() { ... }
    const funcExpr = /const\s+generateBio\s*=\s*function\s*\(\)\s*\{([\s\S]*?)\}/m
    const funcExprMatch = code.match(funcExpr)
    if (funcExprMatch) {
      return `const generateBio = () => {${funcExprMatch[1]}}`
    }
    return 'const generateBio = () => { throw new Error("GenerateBio function not found") }'
  }

  private static extractArrays(code: string): string {
    const namesMatch = code.match(/const names\s*=\s*(\[[\s\S]*?\])/m)
    const jobsMatch = code.match(/const jobs\s*=\s*(\[[\s\S]*?\])/m)
    const hobbiesMatch = code.match(/const hobbies\s*=\s*(\[[\s\S]*?\])/m)
    
    return `
      const names = ${namesMatch ? namesMatch[1] : '[]'}
      const jobs = ${jobsMatch ? jobsMatch[1] : '[]'}
      const hobbies = ${hobbiesMatch ? hobbiesMatch[1] : '[]'}
    `
  }
} 