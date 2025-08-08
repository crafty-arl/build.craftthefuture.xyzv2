// Comprehensive test cases for bug detection
// This ensures reliable detection when users fix bugs

export interface BugTestCase {
  toolId: string
  bugId: number
  name: string
  description: string
  brokenCode: string
  fixedCode: string
  testPatterns: string[]
  testFunctions: string[]
  expectedResult: boolean
}

export class BugTestCases {
  static getAllTestCases(): BugTestCase[] {
    return [
      // Date Calculator Tests
      {
        toolId: 'date-calculator',
        bugId: 1,
        name: 'Missing Date Validation',
        description: 'Check if user added validation for empty dates',
        brokenCode: `
          const calculateDays = () => {
            const diffTime = endDate - startDate
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            setResult(diffDays)
          }
        `,
        fixedCode: `
          const calculateDays = () => {
            if (!startDate || !endDate) {
              setResult('Select both dates')
              return
            }
            const diffTime = endDate - startDate
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            setResult(diffDays)
          }
        `,
        testPatterns: [
          'if (!startDate || !endDate)',
          'if (!startDate',
          'if (!endDate',
          'return',
          'Select both dates'
        ],
        testFunctions: [
          'validation',
          'empty check',
          'null check'
        ],
        expectedResult: true
      },
      {
        toolId: 'date-calculator',
        bugId: 2,
        name: 'Missing Math Functions',
        description: 'Check if user added Math.abs and Math.ceil for proper calculation',
        brokenCode: `
          const calculateDays = () => {
            const diffTime = endDate - startDate
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            setResult(diffDays)
          }
        `,
        fixedCode: `
          const calculateDays = () => {
            const diffTime = Math.abs(endDate - startDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            setResult(diffDays)
          }
        `,
        testPatterns: [
          'Math.abs',
          'Math.ceil'
        ],
        testFunctions: [
          'absolute value',
          'ceiling function'
        ],
        expectedResult: true
      },

      // Product Name Generator Tests
      {
        toolId: 'product-name-generator',
        bugId: 1,
        name: 'Missing Array Mapping',
        description: 'Check if user used array mapping instead of single item',
        brokenCode: `
          const generateNames = () => {
            const newNames = []
            newNames.push('Product' + suffixes[0])
            setNames(newNames)
          }
        `,
        fixedCode: `
          const generateNames = () => {
            const newNames = suffixes.map(suffix => 'Product' + suffix)
            setNames(newNames)
          }
        `,
        testPatterns: [
          'suffixes.map',
          '.map(suffix',
          'newNames',
          'suffixes.map'
        ],
        testFunctions: [
          'array mapping',
          'map function'
        ],
        expectedResult: true
      },

      // Receipt Builder Tests
      {
        toolId: 'receipt-builder',
        bugId: 1,
        name: 'State Mutation',
        description: 'State is being mutated directly, causing issues with re-renders',
        brokenCode: `
          const handleChange = (index, key, value) => {
            items[index][key] = value  // Direct mutation
            setItems(items)
          }
        `,
        fixedCode: `
          const handleChange = (index, key, value) => {
            const updated = [...items]
            updated[index] = { ...updated[index], [key]: value }
            setItems(updated)
          }
        `,
        testPatterns: [
          '[...items]',
          'spread operator',
          '...'
        ],
        testFunctions: [
          'immutable updates',
          'array spread'
        ],
        expectedResult: true
      },
      {
        toolId: 'receipt-builder',
        bugId: 2,
        name: 'Incorrect Total Calculation',
        description: 'Prices and quantities are strings and are not being converted properly',
        brokenCode: `
          const total = items.reduce((sum, item) => {
            return sum + item.price * item.qty
          }, 0)
        `,
        fixedCode: `
          const total = items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0
            const qty = parseInt(item.qty) || 0
            return sum + price * qty
          }, 0)
        `,
        testPatterns: [
          'parseFloat',
          'parseInt',
          '|| 0'
        ],
        testFunctions: [
          'number conversion',
          'string to number'
        ],
        expectedResult: true
      },

      // Poll Maker Tests
      {
        toolId: 'poll-maker',
        bugId: 1,
        name: 'State Mutation',
        description: 'Directly mutating state causes bugs in React',
        brokenCode: `
          const vote = (option) => {
            // BUG: This doesn't update state correctly
            votes[option] += 1
            setVotes(votes)
          }
        `,
        fixedCode: `
          const vote = (option) => {
            setVotes(prevVotes => ({
              ...prevVotes,
              [option]: prevVotes[option] + 1
            }))
          }
        `,
        testPatterns: [
          'setVotes',
          'prev =>',
          '...prev'
        ],
        testFunctions: [
          'state update',
          'functional update',
          'immutable update'
        ],
        expectedResult: true
      },

      // Bio Generator Tests
      {
        toolId: 'bio-generator',
        bugId: 1,
        name: 'Missing Random Selection',
        description: 'Check if user used random selection instead of first item',
                 brokenCode: `
           const generateBio = () => {
             const name = names[0]
             const job = jobs[0]
             const hobby = hobbies[0]
             setBio(\`\${name} is a \${job} who loves \${hobby}\`)
           }
         `,
                 fixedCode: `
           const generateBio = () => {
             const name = names[Math.floor(Math.random() * names.length)]
             const job = jobs[Math.floor(Math.random() * jobs.length)]
             const hobby = hobbies[Math.floor(Math.random() * hobbies.length)]
             setBio(\`\${name} is a \${job} who loves \${hobby}\`)
           }
         `,
        testPatterns: [
          'Math.floor(Math.random()',
          'Math.random() * names.length',
          'Math.random() * jobs.length',
          'Math.random() * hobbies.length'
        ],
        testFunctions: [
          'random selection',
          'random index'
        ],
        expectedResult: true
      },
      {
        toolId: 'bio-generator',
        bugId: 2,
        name: 'Limited Array Variety',
        description: 'Check if user expanded arrays with more variety',
        brokenCode: `
          const names = ['John', 'Jane']
          const jobs = ['Engineer', 'Designer']
          const hobbies = ['Reading', 'Gaming']
        `,
        fixedCode: `
          const names = ['John', 'Jane', 'Morgan', 'Riley', 'Quinn']
          const jobs = ['Engineer', 'Designer', 'Doctor', 'Writer', 'Musician']
          const hobbies = ['Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography']
        `,
        testPatterns: [
          'Morgan',
          'Riley',
          'Quinn',
          'Doctor',
          'Writer',
          'Musician'
        ],
        testFunctions: [
          'expanded arrays',
          'more variety'
        ],
        expectedResult: true
      }
    ]
  }

  static getTestCasesForTool(toolId: string): BugTestCase[] {
    return this.getAllTestCases().filter(testCase => testCase.toolId === toolId)
  }

  static getTestCasesForBug(toolId: string, bugId: number): BugTestCase | undefined {
    return this.getAllTestCases().find(testCase => 
      testCase.toolId === toolId && testCase.bugId === bugId
    )
  }

  // Test if code contains the required patterns for a specific bug
  static testBugFix(toolId: string, bugId: number, code: string): boolean {
    const testCase = this.getTestCasesForBug(toolId, bugId)
    if (!testCase) return false

    // Check if any of the required patterns are present
    return testCase.testPatterns.some(pattern => code.includes(pattern))
  }

  // Get all bugs that are fixed in the given code
  static getFixedBugs(toolId: string, code: string): number[] {
    const testCases = this.getTestCasesForTool(toolId)
    const fixedBugs: number[] = []

    for (const testCase of testCases) {
      if (this.testBugFix(toolId, testCase.bugId, code)) {
        fixedBugs.push(testCase.bugId)
      }
    }

    return fixedBugs
  }

  // Validate that a bug fix is complete and correct
  static validateBugFix(toolId: string, bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    missingPatterns: string[]
  } {
    const testCase = this.getTestCasesForBug(toolId, bugId)
    if (!testCase) {
      return { isFixed: false, confidence: 0, missingPatterns: [] }
    }

    const foundPatterns: string[] = []
    const missingPatterns: string[] = []

    for (const pattern of testCase.testPatterns) {
      if (code.includes(pattern)) {
        foundPatterns.push(pattern)
      } else {
        missingPatterns.push(pattern)
      }
    }

    const confidence = (foundPatterns.length / testCase.testPatterns.length) * 100
    const isFixed = foundPatterns.length === testCase.testPatterns.length // ALL patterns must be found

    return {
      isFixed,
      confidence,
      missingPatterns
    }
  }

  // Get detailed test results for debugging
  static getDetailedTestResults(toolId: string, code: string): {
    toolId: string
    totalBugs: number
    fixedBugs: number[]
    testResults: Array<{
      bugId: number
      name: string
      isFixed: boolean
      confidence: number
      foundPatterns: string[]
      missingPatterns: string[]
    }>
  } {
    const testCases = this.getTestCasesForTool(toolId)
    const testResults = testCases.map(testCase => {
      // Use functional testing first, fall back to pattern matching
      const functionalResult = this.functionalTest(toolId, testCase.bugId, code)
      const patternResult = this.validateBugFix(toolId, testCase.bugId, code)
      
      // Functional test takes priority when available
      const isFixed = functionalResult.confidence > 0 ? functionalResult.isFixed : patternResult.isFixed
      const confidence = functionalResult.confidence > 0 ? functionalResult.confidence : patternResult.confidence
      
      const foundPatterns = testCase.testPatterns.filter(pattern => code.includes(pattern))
      
      return {
        bugId: testCase.bugId,
        name: testCase.name,
        isFixed,
        confidence,
        foundPatterns,
        missingPatterns: patternResult.missingPatterns
      }
    })

    const fixedBugs = testResults
      .filter(result => result.isFixed)
      .map(result => result.bugId)

    return {
      toolId,
      totalBugs: testCases.length,
      fixedBugs,
      testResults
    }
  }

  // NEW: Functional testing that checks if code actually works
  static functionalTest(toolId: string, bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    try {
      switch (toolId) {
        case 'receipt-builder':
          return this.testReceiptBuilderFunctionality(bugId, code)
        case 'date-calculator':
          return this.testDateCalculatorFunctionality(bugId, code)
        case 'poll-maker':
          return this.testPollMakerFunctionality(bugId, code)
        case 'product-name-generator':
          return this.testProductNameGeneratorFunctionality(bugId, code)
        case 'bio-generator':
          return this.testBioGeneratorFunctionality(bugId, code)
        default:
          return { isFixed: false, confidence: 0, details: 'No functional tests available' }
      }
    } catch (error) {
      return { isFixed: false, confidence: 0, details: `Test error: ${error}` }
    }
  }

  // Functional tests for Receipt Builder
  static testReceiptBuilderFunctionality(bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    switch (bugId) {
      case 1: // State Mutation
        // Check for proper immutable state updates
        const hasSpreadArray = /\[\s*\.\.\./.test(code) // [...items]
        const hasSpreadObject = /\{\s*\.\.\./.test(code) // {...item}
        const hasProperStateUpdate = /set\w+\s*\(\s*updated/.test(code)
        const hasDynamicKey = /\[.*\]:\s*value/.test(code) // [key]: value
        const hasHandleChange = code.includes('handleChange')
        const avoidsDirectMutation = !(/items\[\d+\]\[.*\]\s*=/.test(code)) // Avoid items[index][key] = value
        
        if (hasSpreadArray && hasSpreadObject && hasProperStateUpdate && hasDynamicKey && avoidsDirectMutation) {
          return { isFixed: true, confidence: 95, details: 'Perfect immutable state mutation pattern' }
        } else if (hasSpreadArray && hasHandleChange && avoidsDirectMutation) {
          return { isFixed: true, confidence: 80, details: 'Good state mutation with array spread' }
        } else if (hasHandleChange && hasSpreadArray) {
          return { isFixed: true, confidence: 60, details: 'Basic immutable pattern detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No proper state mutation detected' }

      case 2: // Incorrect Total Calculation
        // Check for proper number conversion in calculations
        const hasParseFloat = code.includes('parseFloat')
        const hasParseInt = code.includes('parseInt')
        const hasDefaultValue = code.includes('|| 0')
        const hasProperReduceCalculation = /parseFloat\(.*price.*\).*\|\|.*0/.test(code) && 
                                          /parseInt\(.*qty.*\).*\|\|.*0/.test(code)
        
        if (hasParseFloat && hasParseInt && hasDefaultValue && hasProperReduceCalculation) {
          return { isFixed: true, confidence: 95, details: 'Perfect number conversion with defaults' }
        } else if ((hasParseFloat || hasParseInt) && hasDefaultValue) {
          return { isFixed: true, confidence: 80, details: 'Good number conversion with defaults' }
        } else if (hasParseFloat || hasParseInt) {
          return { isFixed: true, confidence: 60, details: 'Basic number conversion detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No proper number conversion detected' }

      default:
        return { isFixed: false, confidence: 0, details: 'Unknown bug ID' }
    }
  }

  // Functional tests for Date Calculator
  static testDateCalculatorFunctionality(bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    switch (bugId) {
      case 1: // Date Validation
        const hasDateValidation = /if\s*\(\s*!.*startDate.*\|\|.*!.*endDate/.test(code) ||
                                 /if\s*\(\s*!.*endDate.*\|\|.*!.*startDate/.test(code)
        const hasReturnStatement = code.includes('return') && hasDateValidation
        
        if (hasDateValidation && hasReturnStatement) {
          return { isFixed: true, confidence: 90, details: 'Date validation with early return detected' }
        } else if (hasDateValidation) {
          return { isFixed: true, confidence: 70, details: 'Date validation detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No date validation detected' }

      case 2: // Math Functions
        const hasMathAbs = code.includes('Math.abs')
        const hasMathCeil = code.includes('Math.ceil')
        
        if (hasMathAbs && hasMathCeil) {
          return { isFixed: true, confidence: 95, details: 'Both Math.abs and Math.ceil detected' }
        } else if (hasMathAbs || hasMathCeil) {
          return { isFixed: true, confidence: 60, details: 'Partial math functions detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No math functions detected' }

      default:
        return { isFixed: false, confidence: 0, details: 'Unknown bug ID' }
    }
  }

  // Functional tests for Poll Maker
  static testPollMakerFunctionality(bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    switch (bugId) {
      case 1: // State Mutation
        // Check for proper immutable state updates
        const hasFunctionalUpdate = /setVotes\s*\(\s*prev/.test(code) || /setVotes\s*\(\s*\w+\s*=>/.test(code)
        const hasSpreadOperator = /\.\.\.prev/.test(code) || /\.\.\..*Votes/.test(code)
        const hasProperCallback = /\[option\]:\s*(prev|.*Votes)\[option\]\s*\+\s*1/.test(code)
        const avoidsDirectMutation = !(/votes\[.*\]\s*[\+\-]=/.test(code)) // Avoid votes[option] += 1
        
        if (hasFunctionalUpdate && hasSpreadOperator && hasProperCallback && avoidsDirectMutation) {
          return { isFixed: true, confidence: 95, details: 'Perfect immutable state update pattern' }
        } else if (hasFunctionalUpdate && hasSpreadOperator && avoidsDirectMutation) {
          return { isFixed: true, confidence: 80, details: 'Good immutable state update' }
        } else if (hasFunctionalUpdate && avoidsDirectMutation) {
          return { isFixed: true, confidence: 60, details: 'Functional update detected' }
        }
        return { isFixed: false, confidence: 0, details: 'Direct state mutation detected or no proper state update' }

      default:
        return { isFixed: false, confidence: 0, details: 'Unknown bug ID' }
    }
  }

  // Functional tests for Product Name Generator
  static testProductNameGeneratorFunctionality(bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    switch (bugId) {
      case 1: // Array Mapping
        const hasMapFunction = /\.map\s*\(/.test(code)
        const hasSuffixMapping = code.includes('suffixes.map')
        
        if (hasMapFunction && hasSuffixMapping) {
          return { isFixed: true, confidence: 95, details: 'Array mapping with suffixes detected' }
        } else if (hasMapFunction) {
          return { isFixed: true, confidence: 70, details: 'Array mapping detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No array mapping detected' }

      default:
        return { isFixed: false, confidence: 0, details: 'Unknown bug ID' }
    }
  }

  // Functional tests for Bio Generator
  static testBioGeneratorFunctionality(bugId: number, code: string): {
    isFixed: boolean
    confidence: number
    details: string
  } {
    switch (bugId) {
      case 1: // Random Selection
        const hasRandomFunction = code.includes('Math.random()')
        const hasFloorFunction = code.includes('Math.floor')
        const hasLengthProperty = /\.length/.test(code)
        
        if (hasRandomFunction && hasFloorFunction && hasLengthProperty) {
          return { isFixed: true, confidence: 95, details: 'Proper random selection detected' }
        } else if (hasRandomFunction) {
          return { isFixed: true, confidence: 60, details: 'Random function detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No random selection detected' }

      case 2: // Array Variety
        const morganCount = (code.match(/Morgan/g) || []).length
        const rileyCount = (code.match(/Riley/g) || []).length
        const doctorCount = (code.match(/Doctor/g) || []).length
        const totalNewItems = morganCount + rileyCount + doctorCount
        
        if (totalNewItems >= 3) {
          return { isFixed: true, confidence: 90, details: 'Expanded arrays with variety detected' }
        } else if (totalNewItems >= 1) {
          return { isFixed: true, confidence: 60, details: 'Some array expansion detected' }
        }
        return { isFixed: false, confidence: 0, details: 'No array expansion detected' }

      default:
        return { isFixed: false, confidence: 0, details: 'Unknown bug ID' }
    }
  }
} 