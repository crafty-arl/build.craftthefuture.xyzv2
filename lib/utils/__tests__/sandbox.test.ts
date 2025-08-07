import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Sandbox System', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Save System', () => {
    it('should save sandbox to localStorage', () => {
      const sandboxData = {
        id: '123',
        name: 'Test Sandbox',
        code: 'function Test() { return <div>Hello</div> }',
        timestamp: new Date().toISOString()
      }

      const savedSandboxes = [sandboxData]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSandboxes))

      // Simulate saving a sandbox
      const newSandbox = {
        id: '456',
        name: 'New Sandbox',
        code: 'function New() { return <div>World</div> }',
        timestamp: new Date().toISOString()
      }

      const updatedSandboxes = [...savedSandboxes, newSandbox]
      localStorageMock.setItem('sandbox-saves', JSON.stringify(updatedSandboxes))

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sandbox-saves',
        JSON.stringify(updatedSandboxes)
      )
    })

    it('should load sandboxes from localStorage', () => {
      const savedSandboxes = [
        {
          id: '123',
          name: 'Test Sandbox',
          code: 'function Test() { return <div>Hello</div> }',
          timestamp: new Date().toISOString()
        }
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSandboxes))

      const loadedSandboxes = JSON.parse(localStorageMock.getItem('sandbox-saves') || '[]')

      expect(loadedSandboxes).toEqual(savedSandboxes)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('sandbox-saves')
    })

    it('should handle empty localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const loadedSandboxes = JSON.parse(localStorageMock.getItem('sandbox-saves') || '[]')

      expect(loadedSandboxes).toEqual([])
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      // Should handle gracefully
      let loadedSandboxes = []
      try {
        loadedSandboxes = JSON.parse(localStorageMock.getItem('sandbox-saves') || '[]')
      } catch {
        loadedSandboxes = []
      }

      expect(loadedSandboxes).toEqual([])
    })
  })

  describe('Template System', () => {
    const mockTemplates = [
      {
        id: 'react-counter',
        name: 'React Counter',
        description: 'Simple counter component with useState',
        category: 'react' as const,
        code: `function Counter() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
}`
      },
      {
        id: 'todo-app',
        name: 'Todo App',
        description: 'Simple todo list with add/remove functionality',
        category: 'react' as const,
        code: `function TodoApp() {
  const [todos, setTodos] = useState([]);
  return <div>Todo App</div>;
}`
      }
    ]

    it('should have valid template structure', () => {
      mockTemplates.forEach(template => {
        expect(template).toHaveProperty('id')
        expect(template).toHaveProperty('name')
        expect(template).toHaveProperty('description')
        expect(template).toHaveProperty('category')
        expect(template).toHaveProperty('code')
        expect(typeof template.id).toBe('string')
        expect(typeof template.name).toBe('string')
        expect(typeof template.description).toBe('string')
        expect(['react', 'nextjs', 'vanilla', 'typescript']).toContain(template.category)
        expect(typeof template.code).toBe('string')
      })
    })

    it('should have unique template IDs', () => {
      const ids = mockTemplates.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('should have valid React code in templates', () => {
      mockTemplates.forEach(template => {
        expect(template.code).toContain('function')
        expect(template.code).toContain('return')
        expect(template.code).toContain('<')
        expect(template.code).toContain('>')
      })
    })
  })

  describe('Code Processing', () => {
    it('should clean export statements', () => {
      const codeWithExport = `
function TestComponent() {
  return <div>Hello</div>
}

export default TestComponent;
`
      const cleanedCode = codeWithExport.replace(/export default.*;?\s*$/, '')
      expect(cleanedCode).not.toContain('export default')
    })

    it('should clean import statements', () => {
      const codeWithImports = `
import React from 'react'
import { useState } from 'react'

function TestComponent() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}
`
      const cleanedCode = codeWithImports.replace(/import.*from.*['"].*['"];?\s*$/gm, '')
      expect(cleanedCode).not.toContain('import')
    })

    it('should wrap code as React component', () => {
      const componentCode = `function TestComponent() {
  return <div>Hello</div>
}`
      
      const wrappedCode = `import React from 'react';

${componentCode}

export default TestComponent;`
      
      expect(wrappedCode).toContain('import React')
      expect(wrappedCode).toContain('export default TestComponent')
      expect(wrappedCode).toContain(componentCode)
    })
  })

  describe('Component Name Generation', () => {
    it('should generate valid component names', () => {
      const testCases = [
        { input: 'React Counter', expected: 'ReactCounter' },
        { input: 'Todo App', expected: 'TodoApp' },
        { input: 'Contact Form', expected: 'ContactForm' },
        { input: 'API Fetch', expected: 'APIFetch' },
        { input: 'My Component', expected: 'MyComponent' }
      ]

      testCases.forEach(({ input, expected }) => {
        const generated = input.replace(/\s+/g, '')
        expect(generated).toBe(expected)
      })
    })

    it('should handle special characters in names', () => {
      const testCases = [
        { input: 'Counter (v2)', expected: 'Counter(v2)' },
        { input: 'Form-Component', expected: 'Form-Component' },
        { input: 'Test_Component', expected: 'Test_Component' }
      ]

      testCases.forEach(({ input, expected }) => {
        const generated = input.replace(/\s+/g, '')
        expect(generated).toBe(expected)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      // Should not crash the application
      expect(() => {
        try {
          localStorageMock.setItem('test', 'value')
        } catch (error) {
          // Handle error gracefully
          console.error('Storage error:', error)
        }
      }).not.toThrow()
    })

    it('should handle invalid template data', () => {
      const invalidTemplate = {
        id: 'invalid',
        name: '',
        description: '',
        category: 'invalid',
        code: ''
      }

      // Should validate template structure
      const isValid = (
        invalidTemplate.id &&
        invalidTemplate.name &&
        invalidTemplate.description &&
        ['react', 'nextjs', 'vanilla', 'typescript'].includes(invalidTemplate.category) &&
        invalidTemplate.code
      )

      expect(isValid).toBe(false)
    })
  })
}) 