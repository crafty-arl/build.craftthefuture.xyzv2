export interface BugLocation {
  id: number
  title: string
  lines: number[]
  severity: 'error' | 'warning'
  message: string
  hint?: string
}

export class BugHighlighter {
  static getBugLocations(toolId: string, code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    switch (toolId) {
      case 'bio-generator':
        bugs.push(...this.detectBioGeneratorBugs(code))
        break
      case 'date-calculator':
        bugs.push(...this.detectDateCalculatorBugs(code))
        break
      case 'product-name-generator':
        bugs.push(...this.detectProductNameGeneratorBugs(code))
        break
      case 'receipt-builder':
        bugs.push(...this.detectReceiptBuilderBugs(code))
        break
      case 'poll-maker':
        bugs.push(...this.detectPollMakerBugs(code))
        break
    }
    
    return bugs
  }
  
  private static detectBioGeneratorBugs(code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    // Bug 1: Check for non-random array access
    const bug1Patterns = [
      'names[0]',
      'jobs[0]', 
      'hobbies[0]',
      'const name = names[0]',
      'const job = jobs[0]',
      'const hobby = hobbies[0]'
    ]
    
    const bug1Lines = this.findLines(code, bug1Patterns)
    if (bug1Lines.length > 0) {
      bugs.push({
        id: 1,
        title: 'Not Actually Random',
        lines: bug1Lines,
        severity: 'error',
        message: 'Always uses first array element instead of random selection',
        hint: 'Use Math.floor(Math.random() * array.length) for random selection'
      })
    }
    
    // Bug 2: Check for limited array variety
    const limitedNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey']
    const limitedJobs = ['Software Engineer', 'Designer', 'Teacher', 'Chef', 'Artist']
    const limitedHobbies = ['reading', 'hiking', 'cooking', 'gaming', 'painting']
    
    const hasLimitedVariety = limitedNames.some(name => code.includes(name)) &&
                             limitedJobs.some(job => code.includes(job)) &&
                             limitedHobbies.some(hobby => code.includes(hobby))
    
    if (hasLimitedVariety) {
      bugs.push({
        id: 2,
        title: 'Limited Variety',
        lines: this.findLines(code, ['const names =', 'const jobs =', 'const hobbies =']),
        severity: 'warning',
        message: 'Arrays have very few options',
        hint: 'Add more names, jobs, and hobbies for variety'
      })
    }
    
    return bugs
  }
  
  private static detectDateCalculatorBugs(code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    // Bug 1: Missing validation
    if (!code.includes('if (!startDate || !endDate)') && 
        !code.includes('if (!startDate') && 
        !code.includes('if (!endDate') &&
        !(code.includes('return') && code.includes('Select both dates'))) {
      bugs.push({
        id: 1,
        title: 'Missing Date Validation',
        lines: this.findLines(code, ['calculateDays', 'return diffTime']),
        severity: 'error',
        message: 'No validation for empty dates',
        hint: 'Add validation: if (!startDate || !endDate) return "Select both dates"'
      })
    }
    
    // Bug 2: Incorrect calculation
    if (!code.includes('Math.abs') || !code.includes('Math.ceil')) {
      bugs.push({
        id: 2,
        title: 'Incorrect Date Calculation',
        lines: this.findLines(code, ['diffTime', 'return']),
        severity: 'error',
        message: 'Missing Math.abs() and Math.ceil() for proper calculation',
        hint: 'Use Math.abs() and Math.ceil() for proper date calculation'
      })
    }
    
    return bugs
  }
  
  private static detectProductNameGeneratorBugs(code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    // Bug 1: Not using array mapping
    if (!code.includes('.map(') && !code.includes('suffixes.map')) {
      bugs.push({
        id: 1,
        title: 'Not Using Array Mapping',
        lines: this.findLines(code, ['generateNames', 'newNames']),
        severity: 'error',
        message: 'Not generating all variations using map()',
        hint: 'Use suffixes.map(suffix => keyword + suffix) to generate all variations'
      })
    }
    
    return bugs
  }
  
  private static detectReceiptBuilderBugs(code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    // Bug 1: State mutation
    if (code.includes('updated[index][key] = value') && !code.includes('[...items]')) {
      bugs.push({
        id: 1,
        title: 'State Mutation',
        lines: this.findLines(code, ['handleChange', 'updated[index]']),
        severity: 'error',
        message: 'Directly mutating state array',
        hint: 'Use spread operator: const updated = [...items]'
      })
    }
    
    // Bug 2: Incorrect calculation
    if (!code.includes('parseFloat') && !code.includes('Number(')) {
      bugs.push({
        id: 2,
        title: 'Incorrect Calculation',
        lines: this.findLines(code, ['total', 'reduce']),
        severity: 'warning',
        message: 'Not converting strings to numbers',
        hint: 'Use parseFloat() and parseInt() for proper number conversion'
      })
    }
    
    return bugs
  }
  
  private static detectPollMakerBugs(code: string): BugLocation[] {
    const bugs: BugLocation[] = []
    
    // Bug 1: State mutation
    if (code.includes('votes[option] += 1') || code.includes('votes[option] = votes[option] + 1')) {
      bugs.push({
        id: 1,
        title: 'State Mutation',
        lines: this.findLines(code, ['vote', 'votes[']),
        severity: 'error',
        message: 'Directly mutating votes object',
        hint: 'Use setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))'
      })
    }
    
    return bugs
  }
  
  private static findLines(code: string, searchTerms: string[]): number[] {
    const lines = code.split('\n')
    const foundLines: number[] = []
    
    searchTerms.forEach(term => {
      lines.forEach((line, index) => {
        if (line.includes(term)) {
          foundLines.push(index + 1)
        }
      })
    })
    
    return [...new Set(foundLines)] // Remove duplicates
  }
} 