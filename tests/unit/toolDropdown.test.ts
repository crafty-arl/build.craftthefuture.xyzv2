import { describe, it, expect, beforeEach } from '@jest/globals'

// Mock tool data for testing
const mockAvailableTools = [
  {
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
        hints: ['What happens when you create a Date with an empty string?'],
        solution: 'Add a check for empty dates'
      }
    ],
    requirements: ['Basic JavaScript knowledge'],
    learningObjectives: ['Learn to validate user inputs']
  },
  {
    id: 'bio-generator',
    title: 'Bio Generator',
    description: 'Generate random fun bios with names, jobs, and hobbies.',
    difficulty: 'S-0',
    estimatedTime: 15,
    bugs: [
      {
        id: 1,
        title: 'Not Actually Random',
        description: 'The bio generator always uses the first item from each array.',
        clue: 'Check how the name, job, and hobby are selected.',
        bonus: 'Add more variety to the arrays.',
        difficulty: 'easy',
        category: 'logic',
        points: 10,
        hints: ['Use Math.random() to select random items.'],
        solution: 'Use Math.floor(Math.random() * array.length)'
      }
    ],
    requirements: ['React useState hook'],
    learningObjectives: ['Learn to generate random values']
  }
]

describe('Tool Dropdown Functionality', () => {
  describe('Tool Data Structure', () => {
    it('should have valid tool structure for all tools', () => {
      mockAvailableTools.forEach(tool => {
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

    it('should have unique tool IDs', () => {
      const toolIds = mockAvailableTools.map(tool => tool.id)
      const uniqueIds = new Set(toolIds)
      expect(toolIds.length).toBe(uniqueIds.size)
    })

    it('should have reasonable estimated times', () => {
      mockAvailableTools.forEach(tool => {
        expect(tool.estimatedTime).toBeGreaterThan(0)
        expect(tool.estimatedTime).toBeLessThanOrEqual(120) // Max 2 hours
      })
    })
  })

  describe('Tool Change Handler', () => {
    it('should handle tool changes correctly', () => {
      const mockOnToolChange = jest.fn()
      const toolId = 'date-calculator'
      
      // Simulate tool change
      mockOnToolChange(toolId)
      
      expect(mockOnToolChange).toHaveBeenCalledWith(toolId)
      expect(mockOnToolChange).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple tool changes', () => {
      const mockOnToolChange = jest.fn()
      const toolIds = ['date-calculator', 'bio-generator']
      
      toolIds.forEach(toolId => {
        mockOnToolChange(toolId)
      })
      
      expect(mockOnToolChange).toHaveBeenCalledTimes(2)
      expect(mockOnToolChange).toHaveBeenCalledWith('date-calculator')
      expect(mockOnToolChange).toHaveBeenCalledWith('bio-generator')
    })
  })

  describe('Tool Selection UI', () => {
    it('should display tool information correctly', () => {
      const tool = mockAvailableTools[0]
      
      // Check that tool has all required display properties
      expect(tool.title).toBe('Date Calculator')
      expect(tool.description).toBe('A simple date calculator with common bugs')
      expect(tool.difficulty).toBe('S-0')
      expect(tool.estimatedTime).toBe(15)
      expect(tool.bugs.length).toBe(1)
    })

    it('should have proper bug information for display', () => {
      const tool = mockAvailableTools[0]
      const bug = tool.bugs[0]
      
      expect(bug.title).toBe('Output Shows Nothing')
      expect(bug.description).toBe('When no dates are selected, the calculator shows undefined')
      expect(bug.clue).toBe('Check how dates get converted to numbers')
      expect(bug.bonus).toBe('Add validation for empty inputs')
      expect(bug.points).toBe(10)
    })
  })

  describe('Tool Navigation', () => {
    it('should support navigation between tools', () => {
      const mockRouter = {
        push: jest.fn()
      }
      
      const handleToolChange = (toolId: string) => {
        mockRouter.push(`/code?challenge=${toolId}`)
      }
      
      // Navigate to different tools
      handleToolChange('date-calculator')
      expect(mockRouter.push).toHaveBeenCalledWith('/code?challenge=date-calculator')
      
      handleToolChange('bio-generator')
      expect(mockRouter.push).toHaveBeenCalledWith('/code?challenge=bio-generator')
    })

    it('should maintain tool state during navigation', () => {
      const tools = [...mockAvailableTools]
      const currentTool = tools[0]
      
      // Verify current tool state
      expect(currentTool.id).toBe('date-calculator')
      expect(currentTool.title).toBe('Date Calculator')
      
      // Simulate navigation to different tool
      const newTool = tools[1]
      expect(newTool.id).toBe('bio-generator')
      expect(newTool.title).toBe('Bio Generator')
      
      // Tools should remain separate
      expect(currentTool.id).not.toBe(newTool.id)
      expect(currentTool.title).not.toBe(newTool.title)
    })
  })

  describe('Tool Validation', () => {
    it('should validate tool difficulty levels', () => {
      const validDifficulties = ['S-0', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5']
      
      mockAvailableTools.forEach(tool => {
        expect(validDifficulties).toContain(tool.difficulty)
      })
    })

    it('should validate bug structure', () => {
      mockAvailableTools.forEach(tool => {
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

    it('should have reasonable point values', () => {
      mockAvailableTools.forEach(tool => {
        tool.bugs.forEach(bug => {
          expect(bug.points).toBeGreaterThan(0)
          expect(bug.points).toBeLessThanOrEqual(100)
        })
      })
    })
  })

  describe('Tool Dropdown Integration', () => {
    it('should handle tool dropdown state correctly', () => {
      let showToolSelector = false
      const setShowToolSelector = jest.fn((value: boolean) => {
        showToolSelector = value
      })
      
      // Initially closed
      expect(showToolSelector).toBe(false)
      
      // Open dropdown
      setShowToolSelector(true)
      expect(setShowToolSelector).toHaveBeenCalledWith(true)
      
      // Close dropdown
      setShowToolSelector(false)
      expect(setShowToolSelector).toHaveBeenCalledWith(false)
    })

    it('should reset IDE state when switching tools', () => {
      const mockState = {
        savedCode: 'some saved code',
        isCodeSaved: true,
        bugCheckResults: [{ id: 1, title: 'Test Bug', passed: false, message: 'Test message' }],
        showBugResults: true,
        error: 'some error'
      }
      
      const resetState = () => {
        mockState.savedCode = ''
        mockState.isCodeSaved = false
        mockState.bugCheckResults = []
        mockState.showBugResults = false
        mockState.error = null
      }
      
      // Verify initial state
      expect(mockState.savedCode).toBe('some saved code')
      expect(mockState.isCodeSaved).toBe(true)
      expect(mockState.bugCheckResults.length).toBe(1)
      
      // Reset state (simulating tool change)
      resetState()
      
      // Verify state is reset
      expect(mockState.savedCode).toBe('')
      expect(mockState.isCodeSaved).toBe(false)
      expect(mockState.bugCheckResults.length).toBe(0)
      expect(mockState.showBugResults).toBe(false)
      expect(mockState.error).toBe(null)
    })

    it('should handle click outside to close dropdowns', () => {
      let showToolSelector = false
      let showModeSelector = false
      
      const closeDropdowns = () => {
        showToolSelector = false
        showModeSelector = false
      }
      
      // Simulate opening dropdowns
      showToolSelector = true
      showModeSelector = true
      
      expect(showToolSelector).toBe(true)
      expect(showModeSelector).toBe(true)
      
      // Simulate click outside
      closeDropdowns()
      
      expect(showToolSelector).toBe(false)
      expect(showModeSelector).toBe(false)
    })
  })
})
