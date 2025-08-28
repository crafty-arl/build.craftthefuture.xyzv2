import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UnifiedIDE } from '@/components/unified-ide'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}))

// Mock challenge tool data
const mockChallengeTool = {
  id: 'date-calculator',
  title: 'Date Calculator',
  description: 'A simple date calculator with common bugs',
  longDescription: 'This tool helps users calculate the difference between two dates.',
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
      solution: 'Add a check for empty dates'
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
      solution: 'Use Math.abs() and Math.ceil()'
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
}

describe('UnifiedIDE Save State & Bug Testing Frontend', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Save Code Functionality', () => {
    it('should render Save Code button', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      const saveButton = screen.getByRole('button', { name: /save code/i })
      expect(saveButton).toBeInTheDocument()
    })

    it('should show "Code Saved!" after clicking Save Code', async () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      const saveButton = screen.getByRole('button', { name: /save code/i })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText('Code Saved!')).toBeInTheDocument()
      })
    })

    it('should enable Check Bugs button after saving code', async () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Initially, Check Bugs should be disabled
      const checkBugsButton = screen.getByRole('button', { name: /check bugs/i })
      expect(checkBugsButton).toBeDisabled()
      
      // Save code
      const saveButton = screen.getByRole('button', { name: /save code/i })
      fireEvent.click(saveButton)
      
      // Wait for save to complete
      await waitFor(() => {
        expect(screen.getByText('Code Saved!')).toBeInTheDocument()
      })
      
      // Now Check Bugs should be enabled
      expect(checkBugsButton).toBeEnabled()
    })
  })

  describe('Bug Testing Workflow', () => {
    it('should show bug testing workflow info in sidebar', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      expect(screen.getByText('Bug Testing Workflow')).toBeInTheDocument()
      expect(screen.getByText(/1\. Save Code/)).toBeInTheDocument()
      expect(screen.getByText(/2\. Check Bugs/)).toBeInTheDocument()
      expect(screen.getByText(/3\. Review Results/)).toBeInTheDocument()
    })

    it('should display all bugs in the sidebar', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      expect(screen.getByText('Bugs to Fix')).toBeInTheDocument()
      expect(screen.getByText('Output Shows Nothing')).toBeInTheDocument()
      expect(screen.getByText('App Crashes')).toBeInTheDocument()
    })

    it('should show bug details including clues and hints', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Check for bug details
      expect(screen.getByText('Clue:')).toBeInTheDocument()
      expect(screen.getByText('Check how dates get converted to numbers')).toBeInTheDocument()
      expect(screen.getByText('Bonus:')).toBeInTheDocument()
      expect(screen.getByText('Add validation for empty inputs')).toBeInTheDocument()
    })

    it('should show expandable hints for each bug', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Look for hints section
      expect(screen.getByText('Bug Hints')).toBeInTheDocument()
      
      // Check for expandable hint summaries
      expect(screen.getByText('Output Shows Nothing - Click for hints')).toBeInTheDocument()
      expect(screen.getByText('App Crashes - Click for hints')).toBeInTheDocument()
    })
  })

  describe('Progress Tracking', () => {
    it('should show progress bar with correct initial state', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
      expect(screen.getByText('(2 bugs remaining)')).toBeInTheDocument()
    })

    it('should update progress after bug checking', async () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Save code first
      const saveButton = screen.getByRole('button', { name: /save code/i })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText('Code Saved!')).toBeInTheDocument()
      })
      
      // Check bugs
      const checkBugsButton = screen.getByRole('button', { name: /check bugs/i })
      fireEvent.click(checkBugsButton)
      
      // Wait for bug checking to complete
      await waitFor(() => {
        expect(screen.getByText('Bug Check Results')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Progress should be updated
      expect(screen.getByText(/Progress: \d+%/)).toBeInTheDocument()
    })
  })

  describe('AI Help Integration', () => {
    it('should show AI Help button in sidebar', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      const aiHelpButton = screen.getByRole('button', { name: /ai help/i })
      expect(aiHelpButton).toBeInTheDocument()
    })

    it('should show AI Debugging Assistant info', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      expect(screen.getByText('AI Debugging Assistant')).toBeInTheDocument()
      expect(screen.getByText(/Click "AI Help" to copy a detailed prompt/)).toBeInTheDocument()
    })

    it('should show "Copied!" after clicking AI Help', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      })
      
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      const aiHelpButton = screen.getByRole('button', { name: /ai help/i })
      fireEvent.click(aiHelpButton)
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })
  })

  describe('Mode-Specific Features', () => {
    it('should show bug panel only in guided mode', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // In guided mode, bug panel should be visible
      expect(screen.getByText('Bugs to Fix')).toBeInTheDocument()
      expect(screen.getByText('Hints & Help')).toBeInTheDocument()
    })

    it('should hide bug panel in practice mode', () => {
      render(
        <UnifiedIDE
          initialMode="practice"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // In practice mode, bug panel should not be visible
      expect(screen.queryByText('Bugs to Fix')).not.toBeInTheDocument()
      expect(screen.queryByText('Hints & Help')).not.toBeInTheDocument()
    })

    it('should show progress bar only in guided mode', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
      
      // Switch to practice mode
      const modeSelector = screen.getByRole('button', { name: /select ide mode/i })
      fireEvent.click(modeSelector)
      
      const practiceMode = screen.getByText('Practice Mode')
      fireEvent.click(practiceMode)
      
      // Progress bar should not be visible in practice mode
      expect(screen.queryByText('Progress: 0%')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should show error when trying to check bugs without saving', async () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Try to check bugs without saving (button should be disabled)
      const checkBugsButton = screen.getByRole('button', { name: /check bugs/i })
      expect(checkBugsButton).toBeDisabled()
    })

    it('should handle missing challenge tool gracefully', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Should show loading state
      expect(screen.getByText('Loading challenge...')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should maintain functionality on different screen sizes', () => {
      // Test with different viewport sizes
      const { rerender } = render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // All core functionality should work regardless of screen size
      expect(screen.getByRole('button', { name: /save code/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /check bugs/i })).toBeInTheDocument()
      expect(screen.getByText('Bugs to Fix')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Check for proper ARIA labels
      expect(screen.getByRole('button', { name: /save current code for bug checking/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /check if bugs have been fixed/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /copy ai prompt for debugging assistance/i })).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(
        <UnifiedIDE
          initialMode="guided"
          challengeTool={mockChallengeTool}
          initialCode="function Test() { return <div>Test</div> }"
        />
      )
      
      // Tab through interactive elements
      const saveButton = screen.getByRole('button', { name: /save code/i })
      const checkBugsButton = screen.getByRole('button', { name: /check bugs/i })
      
      expect(saveButton).toHaveAttribute('tabIndex', '0')
      expect(checkBugsButton).toHaveAttribute('tabIndex', '0')
    })
  })
})
