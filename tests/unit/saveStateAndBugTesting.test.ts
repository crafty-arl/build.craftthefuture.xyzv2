import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock the tool data for testing
const mockTools = {
  'date-calculator': {
    id: 'date-calculator',
    title: 'Date Calculator',
    description: 'A simple date calculator with common bugs',
    difficulty: 'S-0',
    estimatedTime: 15,
    bugs: [
      {
        id: 1,
        title: 'Output Shows Nothing',
        description: 'When no dates are selected, the calculator shows undefined',
        clue: 'Check how dates get converted to numbers',
        bonus: 'Add validation for empty inputs',
        difficulty: 'easy',
        category: 'logic',
        points: 10,
        hints: [
          'What happens when you create a Date with an empty string?',
          'Check the calculateDays function when inputs are empty'
        ],
        solution: 'Add a check for empty dates: `if (!startDate || !endDate) return \'Select both dates\'`'
      },
      {
        id: 2,
        title: 'App Crashes',
        description: 'Empty dates break everything',
        clue: 'Guard against missing values',
        bonus: 'Show helpful feedback to users',
        difficulty: 'easy',
        category: 'syntax',
        points: 15,
        hints: [
          'Add validation before calculating',
          'Check if dates are valid before processing'
        ],
        solution: 'Use Math.abs() to handle negative differences and Math.ceil() for proper rounding'
      }
    ],
    requirements: [
      'Basic JavaScript knowledge',
      'Understanding of Date objects',
      'React useState hook'
    ],
    learningObjectives: [
      'Learn to validate user inputs',
      'Understand date manipulation in JavaScript',
      'Practice debugging common errors'
    ]
  },
  'bio-generator': {
    id: 'bio-generator',
    title: 'Bio Generator',
    description: 'Generate random fun bios with names, jobs, and hobbies.',
    difficulty: 'S-0',
    estimatedTime: 15,
    bugs: [
      {
        id: 1,
        title: 'Not Actually Random',
        description: 'The bio generator always uses the first item from each array instead of random selection.',
        clue: 'Check how the name, job, and hobby are selected from their arrays.',
        bonus: 'Add more variety to the names, jobs, and hobbies arrays.',
        difficulty: 'easy',
        category: 'logic',
        points: 10,
        hints: [
          'Use Math.random() to select random items from arrays.',
          'Use Math.floor() to convert the random number to an array index.'
        ],
        solution: 'Use Math.floor(Math.random() * array.length) to get random indices'
      }
    ],
    requirements: [
      'React useState hook',
      'Array manipulation',
      'Random number generation'
    ],
    learningObjectives: [
      'Learn to generate random values in JavaScript',
      'Practice working with arrays and array indices',
      'Understand dynamic state updates in React'
    ]
  }
}

// Mock bug detection logic
const mockBugDetection = {
  // Date Calculator bug detection
  'Output Shows Nothing': (code: string) => {
    const hasValidation = code.includes('if') && (code.includes('!startDate') || code.includes('!endDate'))
    const hasReturn = code.includes('return') && code.includes('Select both dates')
    return hasValidation && hasReturn
  },
  
  'App Crashes': (code: string) => {
    const hasMathAbs = code.includes('Math.abs')
    const hasMathCeil = code.includes('Math.ceil')
    return hasMathAbs && hasMathCeil
  },
  
  // Bio Generator bug detection
  'Not Actually Random': (code: string) => {
    const hasRandomSelection = code.includes('Math.random') && code.includes('Math.floor')
    const hasArrayLength = code.includes('.length')
    return hasRandomSelection && hasArrayLength
  }
}

describe('Save State & Bug Testing System', () => {
  describe('Tool Data Validation', () => {
    it('should have valid tool structure for all tools', () => {
      Object.values(mockTools).forEach(tool => {
        expect(tool).toHaveProperty('id')
        expect(tool).toHaveProperty('title')
        expect(tool).toHaveProperty('description')
        expect(tool).toHaveProperty('difficulty')
        expect(tool).toHaveProperty('estimatedTime')
        expect(tool).toHaveProperty('bugs')
        expect(tool).toHaveProperty('requirements')
        expect(tool).toHaveProperty('learningObjectives')
        
        expect(typeof tool.id).toBe('string')
        expect(typeof tool.title).toBe('string')
        expect(typeof tool.description).toBe('string')
        expect(typeof tool.difficulty).toBe('string')
        expect(typeof tool.estimatedTime).toBe('number')
        expect(Array.isArray(tool.bugs)).toBe(true)
        expect(Array.isArray(tool.requirements)).toBe(true)
        expect(Array.isArray(tool.learningObjectives)).toBe(true)
      })
    })

    it('should have valid bug structure for all bugs', () => {
      Object.values(mockTools).forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(bug).toHaveProperty('id')
          expect(bug).toHaveProperty('title')
          expect(bug).toHaveProperty('description')
          expect(bug).toHaveProperty('clue')
          expect(bug).toHaveProperty('bonus')
          expect(bug).toHaveProperty('difficulty')
          expect(bug).toHaveProperty('category')
          expect(bug).toHaveProperty('points')
          expect(bug).toHaveProperty('hints')
          expect(bug).toHaveProperty('solution')
          
          expect(typeof bug.id).toBe('number')
          expect(typeof bug.title).toBe('string')
          expect(typeof bug.description).toBe('string')
          expect(typeof bug.clue).toBe('string')
          expect(typeof bug.bonus).toBe('string')
          expect(typeof bug.difficulty).toBe('string')
          expect(typeof bug.category).toBe('string')
          expect(typeof bug.points).toBe('number')
          expect(Array.isArray(bug.hints)).toBe(true)
          expect(typeof bug.solution).toBe('string')
        })
      })
    })
  })

  describe('Bug Detection Logic', () => {
    describe('Date Calculator Bugs', () => {
      it('should detect "Output Shows Nothing" bug correctly', () => {
        // Broken code (missing validation)
        const brokenCode = `
          function DateCalculator() {
            const [startDate, setStartDate] = useState('')
            const [endDate, setEndDate] = useState('')
            
            const calculateDays = () => {
              const start = new Date(startDate)
              const end = new Date(endDate)
              const diffTime = end - start
              return diffTime / (1000 * 60 * 60 * 24)
            }
            
            return (
              <div>
                <p>Days between: <strong>{calculateDays()}</strong></p>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['Output Shows Nothing'](brokenCode)).toBe(false)
        
        // Fixed code (with validation)
        const fixedCode = `
          function DateCalculator() {
            const [startDate, setStartDate] = useState('')
            const [endDate, setEndDate] = useState('')
            
            const calculateDays = () => {
              if (!startDate || !endDate) return 'Select both dates'
              const start = new Date(startDate)
              const end = new Date(endDate)
              const diffTime = end - start
              return diffTime / (1000 * 60 * 60 * 24)
            }
            
            return (
              <div>
                <p>Days between: <strong>{calculateDays()}</strong></p>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['Output Shows Nothing'](fixedCode)).toBe(true)
      })

      it('should detect "App Crashes" bug correctly', () => {
        // Broken code (missing Math.abs and Math.ceil)
        const brokenCode = `
          function DateCalculator() {
            const [startDate, setStartDate] = useState('')
            const [endDate, setEndDate] = useState('')
            
            const calculateDays = () => {
              if (!startDate || !endDate) return 'Select both dates'
              const start = new Date(startDate)
              const end = new Date(endDate)
              const diffTime = end - start
              return diffTime / (1000 * 60 * 60 * 24)
            }
            
            return (
              <div>
                <p>Days between: <strong>{calculateDays()}</strong></p>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['App Crashes'](brokenCode)).toBe(false)
        
        // Fixed code (with Math.abs and Math.ceil)
        const fixedCode = `
          function DateCalculator() {
            const [startDate, setStartDate] = useState('')
            const [endDate, setEndDate] = useState('')
            
            const calculateDays = () => {
              if (!startDate || !endDate) return 'Select both dates'
              const start = new Date(startDate)
              const end = new Date(endDate)
              const diffTime = Math.abs(end - start)
              return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            }
            
            return (
              <div>
                <p>Days between: <strong>{calculateDays()}</strong></p>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['App Crashes'](fixedCode)).toBe(true)
      })
    })

    describe('Bio Generator Bugs', () => {
      it('should detect "Not Actually Random" bug correctly', () => {
        // Broken code (no random selection)
        const brokenCode = `
          function BioGenerator() {
            const [bio, setBio] = useState('')
            
            const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
            const jobs = ['Software Engineer', 'Designer', 'Teacher', 'Chef', 'Artist']
            const hobbies = ['reading', 'hiking', 'cooking', 'gaming', 'painting']
            
            const generateBio = () => {
              const name = names[0]
              const job = jobs[0]
              const hobby = hobbies[0]
              
              const newBio = \`\${name} is a \${job} who loves \${hobby}.\`
              setBio(newBio)
            }
            
            return (
              <div>
                <button onClick={generateBio}>Generate Random Bio</button>
                <div>{bio}</div>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['Not Actually Random'](brokenCode)).toBe(false)
        
        // Fixed code (with random selection)
        const fixedCode = `
          function BioGenerator() {
            const [bio, setBio] = useState('')
            
            const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
            const jobs = ['Software Engineer', 'Designer', 'Teacher', 'Chef', 'Artist']
            const hobbies = ['reading', 'hiking', 'cooking', 'gaming', 'painting']
            
            const generateBio = () => {
              const randomName = names[Math.floor(Math.random() * names.length)]
              const randomJob = jobs[Math.floor(Math.random() * jobs.length)]
              const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)]
              
              const newBio = \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`
              setBio(newBio)
            }
            
            return (
              <div>
                <button onClick={generateBio}>Generate Random Bio</button>
                <div>{bio}</div>
              </div>
            )
          }
        `
        
        expect(mockBugDetection['Not Actually Random'](fixedCode)).toBe(true)
      })
    })
  })

  describe('Save State Management', () => {
    let savedCode = ''
    let isCodeSaved = false
    let bugCheckResults: Array<{
      bugId: number
      title: string
      passed: boolean
      message: string
    }> = []
    let showBugResults = false

    beforeEach(() => {
      savedCode = ''
      isCodeSaved = false
      bugCheckResults = []
      showBugResults = false
    })

    it('should save code correctly', () => {
      const testCode = 'function TestComponent() { return <div>Test</div> }'
      
      // Save code
      savedCode = testCode
      isCodeSaved = true
      
      expect(savedCode).toBe(testCode)
      expect(isCodeSaved).toBe(true)
    })

    it('should clear bug results when saving new code', () => {
      // Simulate existing bug results
      bugCheckResults = [
        { bugId: 1, title: 'Test Bug', passed: true, message: 'Test message' }
      ]
      showBugResults = true
      
      // Save new code (should clear results)
      const newCode = 'function NewComponent() { return <div>New</div> }'
      savedCode = newCode
      isCodeSaved = true
      bugCheckResults = []
      showBugResults = false
      
      expect(savedCode).toBe(newCode)
      expect(isCodeSaved).toBe(true)
      expect(bugCheckResults).toHaveLength(0)
      expect(showBugResults).toBe(false)
    })

    it('should maintain save state during editing', () => {
      const originalCode = 'function Original() { return <div>Original</div> }'
      const editedCode = 'function Edited() { return <div>Edited</div> }'
      
      // Save original code
      savedCode = originalCode
      isCodeSaved = true
      
      // Edit code (should not affect saved code)
      const currentCode = editedCode
      
      expect(savedCode).toBe(originalCode)
      expect(currentCode).toBe(editedCode)
      expect(isCodeSaved).toBe(true)
    })
  })

  describe('Bug Check Results', () => {
    it('should generate correct bug check results', () => {
      const tool = mockTools['date-calculator']
      const testCode = `
        function DateCalculator() {
          const [startDate, setStartDate] = useState('')
          const [endDate, setEndDate] = useState('')
          
          const calculateDays = () => {
            if (!startDate || !endDate) return 'Select both dates'
            const start = new Date(startDate)
            const end = new Date(endDate)
            const diffTime = Math.abs(end - start)
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          }
          
          return (
            <div>
              <p>Days between: <strong>{calculateDays()}</strong></p>
            </div>
          )
        }
      `
      
      const results = tool.bugs.map((bug: any) => {
        let passed = false
        let message = ''
        
        if (bug.title === 'Output Shows Nothing') {
          passed = mockBugDetection['Output Shows Nothing'](testCode)
        } else if (bug.title === 'App Crashes') {
          passed = mockBugDetection['App Crashes'](testCode)
        }
        
        message = passed 
          ? `✅ Bug appears to be fixed! Code follows good practices.`
          : `❌ Bug may still exist. Check: ${bug.clue}`
        
        return {
          bugId: bug.id,
          title: bug.title,
          passed,
          message
        }
      })
      
      expect(results).toHaveLength(2)
      expect(results[0].title).toBe('Output Shows Nothing')
      expect(results[0].passed).toBe(true)
      expect(results[1].title).toBe('App Crashes')
      expect(results[1].passed).toBe(true)
    })

    it('should calculate progress correctly', () => {
      const results = [
        { bugId: 1, title: 'Bug 1', passed: true, message: 'Fixed' },
        { bugId: 2, title: 'Bug 2', passed: false, message: 'Not fixed' },
        { bugId: 3, title: 'Bug 3', passed: true, message: 'Fixed' }
      ]
      
      const passedBugs = results.filter(r => r.passed).length
      const totalBugs = results.length
      const progressPercentage = Math.round((passedBugs / totalBugs) * 100)
      
      expect(passedBugs).toBe(2)
      expect(totalBugs).toBe(3)
      expect(progressPercentage).toBe(67)
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete workflow: save → check → results', () => {
      const tool = mockTools['bio-generator']
      let savedCode = ''
      let isCodeSaved = false
      let bugCheckResults: Array<{
        bugId: number
        title: string
        passed: boolean
        message: string
      }> = []
      let showBugResults = false
      
      // Step 1: Save code
      const testCode = `
        function BioGenerator() {
          const [bio, setBio] = useState('')
          
          const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
          const jobs = ['Software Engineer', 'Designer', 'Teacher', 'Chef', 'Artist']
          const hobbies = ['reading', 'hiking', 'cooking', 'gaming', 'painting']
          
          const generateBio = () => {
            const randomName = names[Math.floor(Math.random() * names.length)]
            const randomJob = jobs[Math.floor(Math.random() * jobs.length)]
            const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)]
            
            const newBio = \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`
            setBio(newBio)
          }
          
          return (
            <div>
              <button onClick={generateBio}>Generate Random Bio</button>
              <div>{bio}</div>
            </div>
          )
        }
      `
      
      savedCode = testCode
      isCodeSaved = true
      
      expect(savedCode).toBe(testCode)
      expect(isCodeSaved).toBe(true)
      
      // Step 2: Check bugs
      bugCheckResults = tool.bugs.map((bug: any) => {
        let passed = false
        let message = ''
        
        if (bug.title === 'Not Actually Random') {
          passed = mockBugDetection['Not Actually Random'](testCode)
        }
        
        message = passed 
          ? `✅ Bug appears to be fixed! Code follows good practices.`
          : `❌ Bug may still exist. Check: ${bug.clue}`
        
        return {
          bugId: bug.id,
          title: bug.title,
          passed,
          message
        }
      })
      
      showBugResults = true
      
      expect(bugCheckResults).toHaveLength(1)
      expect(bugCheckResults[0].passed).toBe(true)
      expect(showBugResults).toBe(true)
      
      // Step 3: Verify results
      const passedBugs = bugCheckResults.filter(r => r.passed).length
      const totalBugs = bugCheckResults.length
      const progressPercentage = Math.round((passedBugs / totalBugs) * 100)
      
      expect(passedBugs).toBe(1)
      expect(totalBugs).toBe(1)
      expect(progressPercentage).toBe(100)
    })
  })

  describe('Error Handling', () => {
    it('should handle missing tool data gracefully', () => {
      const checkBugs = (tool: any, savedCode: string) => {
        if (!tool || !tool.bugs || !savedCode) {
          throw new Error('Please save your code first before checking bugs')
        }
        
        return tool.bugs.map(bug => ({
          bugId: bug.id,
          title: bug.title,
          passed: false,
          message: 'Test message'
        }))
      }
      
      // Test with missing tool
      expect(() => checkBugs(null, 'test code')).toThrow('Please save your code first before checking bugs')
      
      // Test with missing bugs
      expect(() => checkBugs({ id: 'test' }, 'test code')).toThrow('Please save your code first before checking bugs')
      
      // Test with missing saved code
      expect(() => checkBugs(mockTools['date-calculator'], '')).toThrow('Please save your code first before checking bugs')
      
      // Test with valid data
      const results = checkBugs(mockTools['date-calculator'], 'test code')
      expect(results).toHaveLength(2)
    })
  })
})
