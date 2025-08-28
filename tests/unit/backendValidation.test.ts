import { describe, it, expect, beforeEach } from '@jest/globals'

// Mock tool data for backend validation
const mockToolData = {
  'date-calculator': {
    id: 'date-calculator',
    title: 'Date Calculator',
    description: 'A simple date calculator with common bugs',
    longDescription: 'This tool helps users calculate the difference between two dates.',
    icon: 'Calendar',
    difficulty: 'S-0',
    season: 0,
    category: 'frontend',
    tags: ['javascript', 'dates', 'validation'],
    estimatedTime: 15,
    brokenCode: `import { useState } from 'react'

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
}`,
    fixedCode: `import { useState } from 'react'

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
}`,
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
        solution: 'Add a check for empty dates'
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
    ],
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
    isActive: true,
    metadata: {
      author: 'siki-developer',
      version: '1.0.0',
      difficulty: 'beginner',
      techStack: ['React', 'JavaScript'],
      frameworks: ['React']
    }
  }
}

// Validation schemas
const requiredToolFields = [
  'id', 'title', 'description', 'longDescription', 'icon', 'difficulty',
  'season', 'category', 'tags', 'estimatedTime', 'brokenCode', 'fixedCode',
  'bugs', 'requirements', 'learningObjectives', 'createdAt', 'updatedAt',
  'isActive', 'metadata'
]

const requiredBugFields = [
  'id', 'title', 'description', 'clue', 'bonus', 'difficulty',
  'category', 'points', 'hints', 'solution'
]

const requiredMetadataFields = [
  'author', 'version', 'difficulty', 'techStack', 'frameworks'
]

describe('Backend Tool Validation', () => {
  describe('Tool Data Structure Validation', () => {
    it('should have all required fields for each tool', () => {
      Object.values(mockToolData).forEach(tool => {
        requiredToolFields.forEach(field => {
          expect(tool).toHaveProperty(field)
          expect((tool as any)[field]).toBeDefined()
        })
      })
    })

    it('should have correct data types for tool fields', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(typeof tool.id).toBe('string')
        expect(typeof tool.title).toBe('string')
        expect(typeof tool.description).toBe('string')
        expect(typeof tool.longDescription).toBe('string')
        expect(typeof tool.icon).toBe('string')
        expect(typeof tool.difficulty).toBe('string')
        expect(typeof tool.season).toBe('number')
        expect(typeof tool.category).toBe('string')
        expect(Array.isArray(tool.tags)).toBe(true)
        expect(typeof tool.estimatedTime).toBe('number')
        expect(typeof tool.brokenCode).toBe('string')
        expect(typeof tool.fixedCode).toBe('string')
        expect(Array.isArray(tool.bugs)).toBe(true)
        expect(Array.isArray(tool.requirements)).toBe(true)
        expect(Array.isArray(tool.learningObjectives)).toBe(true)
        expect(typeof tool.createdAt).toBe('string')
        expect(typeof tool.updatedAt).toBe('string')
        expect(typeof tool.isActive).toBe('boolean')
        expect(typeof tool.metadata).toBe('object')
      })
    })

    it('should have valid difficulty levels', () => {
      const validDifficulties = ['S-0', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5']
      Object.values(mockToolData).forEach(tool => {
        expect(validDifficulties).toContain(tool.difficulty)
      })
    })

    it('should have valid categories', () => {
      const validCategories = ['frontend', 'backend', 'fullstack', 'mobile', 'devops']
      Object.values(mockToolData).forEach(tool => {
        expect(validCategories).toContain(tool.category)
      })
    })

    it('should have valid seasons', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.season).toBeGreaterThanOrEqual(0)
        expect(tool.season).toBeLessThanOrEqual(10)
      })
    })

    it('should have reasonable estimated times', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.estimatedTime).toBeGreaterThan(0)
        expect(tool.estimatedTime).toBeLessThanOrEqual(120) // Max 2 hours
      })
    })
  })

  describe('Bug Data Validation', () => {
    it('should have all required fields for each bug', () => {
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
          requiredBugFields.forEach(field => {
            expect(bug).toHaveProperty(field)
            expect((bug as any)[field]).toBeDefined()
          })
        })
      })
    })

    it('should have correct data types for bug fields', () => {
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
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

    it('should have valid bug difficulties', () => {
      const validBugDifficulties = ['easy', 'medium', 'hard', 'expert']
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(validBugDifficulties).toContain(bug.difficulty)
        })
      })
    })

    it('should have valid bug categories', () => {
      const validBugCategories = ['logic', 'syntax', 'performance', 'security', 'accessibility']
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(validBugCategories).toContain(bug.category)
        })
      })
    })

    it('should have reasonable point values', () => {
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(bug.points).toBeGreaterThan(0)
          expect(bug.points).toBeLessThanOrEqual(100)
        })
      })
    })

    it('should have non-empty hints arrays', () => {
      Object.values(mockToolData).forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(bug.hints.length).toBeGreaterThan(0)
          bug.hints.forEach(hint => {
            expect(typeof hint).toBe('string')
            expect(hint.length).toBeGreaterThan(0)
          })
        })
      })
    })
  })

  describe('Code Validation', () => {
    it('should have valid broken code', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.brokenCode.length).toBeGreaterThan(0)
        expect(tool.brokenCode).toContain('function')
        expect(tool.brokenCode).toContain('return')
      })
    })

    it('should have valid fixed code', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.fixedCode.length).toBeGreaterThan(0)
        expect(tool.fixedCode).toContain('function')
        expect(tool.fixedCode).toContain('return')
      })
    })

    it('should have different broken and fixed code', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.brokenCode).not.toBe(tool.fixedCode)
      })
    })

    it('should have valid React component structure', () => {
      Object.values(mockToolData).forEach(tool => {
        // Check for React imports
        expect(tool.brokenCode).toMatch(/import.*react/i)
        expect(tool.fixedCode).toMatch(/import.*react/i)
        
        // Check for function components
        expect(tool.brokenCode).toMatch(/function\s+\w+\s*\(/i)
        expect(tool.fixedCode).toMatch(/function\s+\w+\s*\(/i)
        
        // Check for JSX return
        expect(tool.brokenCode).toMatch(/return\s*\(/i)
        expect(tool.fixedCode).toMatch(/return\s*\(/i)
      })
    })
  })

  describe('Metadata Validation', () => {
    it('should have all required metadata fields', () => {
      Object.values(mockToolData).forEach(tool => {
        requiredMetadataFields.forEach(field => {
          expect(tool.metadata).toHaveProperty(field)
          expect((tool.metadata as any)[field]).toBeDefined()
        })
      })
    })

    it('should have correct data types for metadata fields', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(typeof tool.metadata.author).toBe('string')
        expect(typeof tool.metadata.version).toBe('string')
        expect(typeof tool.metadata.difficulty).toBe('string')
        expect(Array.isArray(tool.metadata.techStack)).toBe(true)
        expect(Array.isArray(tool.metadata.frameworks)).toBe(true)
      })
    })

    it('should have valid version format', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.metadata.version).toMatch(/^\d+\.\d+\.\d+$/)
      })
    })

    it('should have valid difficulty levels in metadata', () => {
      const validMetadataDifficulties = ['beginner', 'intermediate', 'advanced', 'expert']
      Object.values(mockToolData).forEach(tool => {
        expect(validMetadataDifficulties).toContain(tool.metadata.difficulty)
      })
    })

    it('should have non-empty tech stack and frameworks', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.metadata.techStack.length).toBeGreaterThan(0)
        expect(tool.metadata.frameworks.length).toBeGreaterThan(0)
        
        tool.metadata.techStack.forEach(tech => {
          expect(typeof tech).toBe('string')
          expect(tech.length).toBeGreaterThan(0)
        })
        
        tool.metadata.frameworks.forEach(framework => {
          expect(typeof framework).toBe('string')
          expect(framework.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Data Integrity Validation', () => {
    it('should have unique bug IDs within each tool', () => {
      Object.values(mockToolData).forEach(tool => {
        const bugIds = tool.bugs.map(bug => bug.id)
        const uniqueBugIds = new Set(bugIds)
        expect(bugIds.length).toBe(uniqueBugIds.size)
      })
    })

    it('should have consistent difficulty levels', () => {
      Object.values(mockToolData).forEach(tool => {
        // Tool difficulty should be consistent with metadata difficulty
        const toolDifficulty = tool.difficulty
        const metadataDifficulty = tool.metadata.difficulty
        
        // S-0 should correspond to beginner
        if (toolDifficulty === 'S-0') {
          expect(metadataDifficulty).toBe('beginner')
        }
      })
    })

    it('should have valid date formats', () => {
      Object.values(mockToolData).forEach(tool => {
        // Check createdAt
        expect(() => new Date(tool.createdAt)).not.toThrow()
        expect(new Date(tool.createdAt).toString()).not.toBe('Invalid Date')
        
        // Check updatedAt
        expect(() => new Date(tool.updatedAt)).not.toThrow()
        expect(new Date(tool.updatedAt).toString()).not.toBe('Invalid Date')
        
        // updatedAt should not be before createdAt
        const createdAt = new Date(tool.createdAt)
        const updatedAt = new Date(tool.updatedAt)
        expect(updatedAt.getTime()).toBeGreaterThanOrEqual(createdAt.getTime())
      })
    })

    it('should have reasonable tag counts', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.tags.length).toBeGreaterThan(0)
        expect(tool.tags.length).toBeLessThanOrEqual(10) // Max 10 tags
        
        tool.tags.forEach(tag => {
          expect(typeof tag).toBe('string')
          expect(tag.length).toBeGreaterThan(0)
          expect(tag.length).toBeLessThanOrEqual(50) // Max 50 characters per tag
        })
      })
    })
  })

  describe('Business Logic Validation', () => {
    it('should have at least one bug per tool', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.bugs.length).toBeGreaterThan(0)
      })
    })

    it('should have at least one requirement per tool', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.requirements.length).toBeGreaterThan(0)
      })
    })

    it('should have at least one learning objective per tool', () => {
      Object.values(mockToolData).forEach(tool => {
        expect(tool.learningObjectives.length).toBeGreaterThan(0)
      })
    })

    it('should have reasonable total points per tool', () => {
      Object.values(mockToolData).forEach(tool => {
        const totalPoints = tool.bugs.reduce((sum, bug) => sum + bug.points, 0)
        expect(totalPoints).toBeGreaterThan(0)
        expect(totalPoints).toBeLessThanOrEqual(200) // Max 200 points per tool
      })
    })

    it('should have estimated time proportional to complexity', () => {
      Object.values(mockToolData).forEach(tool => {
        const totalPoints = tool.bugs.reduce((sum, bug) => sum + bug.points, 0)
        const estimatedTime = tool.estimatedTime
        
        // Rough estimation: 1 point = 1 minute
        const expectedTime = Math.max(5, Math.min(120, totalPoints))
        expect(estimatedTime).toBeGreaterThanOrEqual(expectedTime * 0.5)
        expect(estimatedTime).toBeLessThanOrEqual(expectedTime * 2)
      })
    })
  })

  describe('Error Handling Validation', () => {
    it('should handle missing optional fields gracefully', () => {
      const toolWithMissingFields = {
        ...mockToolData['date-calculator'],
        bonus: undefined, // Optional field
        metadata: {
          ...mockToolData['date-calculator'].metadata,
          author: undefined // Optional field
        }
      }
      
      // Should not throw errors for missing optional fields
      expect(() => {
        if (toolWithMissingFields.bonus) {
          expect(typeof toolWithMissingFields.bonus).toBe('string')
        }
        if (toolWithMissingFields.metadata.author) {
          expect(typeof toolWithMissingFields.metadata.author).toBe('string')
        }
      }).not.toThrow()
    })

    it('should validate required fields are not null or undefined', () => {
      Object.values(mockToolData).forEach(tool => {
        requiredToolFields.forEach(field => {
          expect((tool as any)[field]).not.toBeNull()
          expect((tool as any)[field]).not.toBeUndefined()
        })
        
        tool.bugs.forEach(bug => {
          requiredBugFields.forEach(field => {
            expect((bug as any)[field]).not.toBeNull()
            expect((bug as any)[field]).not.toBeUndefined()
          })
        })
      })
    })
  })
})
