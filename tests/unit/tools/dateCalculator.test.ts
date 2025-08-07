import { describe, it, expect } from '@jest/globals'
import { DateCalculatorTest } from '../../../lib/utils/toolTests/dateCalculatorTest'

describe('Date Calculator Tool', () => {
  const testClass = new DateCalculatorTest()

  describe('Compile Tests', () => {
    it('should compile valid date calculation code', () => {
      const code = `
        function calculateDateDifference(startDate, endDate) {
          if (!startDate || !endDate) return 'Select both dates';
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
      `
      const result = testClass.compileTest(code)
      expect(result.success).toBe(true)
    })

    it('should detect missing validation bug', () => {
      const code = `
        function calculateDateDifference(startDate, endDate) {
          const diffTime = Math.abs(endDate - startDate);
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      `
      const bugs = testClass.detectBugs(code)
      expect(bugs).toContain('missing-validation')
    })

    it('should detect missing calculation methods bug', () => {
      const code = `
        function calculateDateDifference(startDate, endDate) {
          if (!startDate || !endDate) return 'Select both dates';
          return (endDate - startDate) / (1000 * 60 * 60 * 24);
        }
      `
      const bugs = testClass.detectBugs(code)
      expect(bugs).toContain('missing-calculation-methods')
    })
  })

  describe('Integration Tests', () => {
    it('should handle valid date inputs', async () => {
      const result = await testClass.testValidInputs()
      expect(result.success).toBe(true)
      expect(typeof result.output).toBe('number')
      expect(result.output).toBeGreaterThan(0)
    })

    it('should handle invalid date inputs', async () => {
      const result = await testClass.testInvalidInputs()
      expect(result.success).toBe(true)
      expect(result.output).toHaveProperty('result1')
      expect(result.output).toHaveProperty('result2')
    })

    it('should handle edge cases', async () => {
      const result = await testClass.testEdgeCases()
      expect(result.success).toBe(true)
      expect(result.output).toHaveProperty('sameDay')
      expect(result.output).toHaveProperty('futureDate')
    })
  })

  describe('Bug Detection', () => {
    it('should detect multiple bugs in broken code', () => {
      const brokenCode = `
        function calculateDateDifference(startDate, endDate) {
          return (endDate - startDate) / (1000 * 60 * 60 * 24);
        }
      `
      const bugs = testClass.detectBugs(brokenCode)
      expect(bugs).toContain('missing-validation')
      expect(bugs).toContain('missing-calculation-methods')
    })

    it('should not detect bugs in correct code', () => {
      const correctCode = `
        function calculateDateDifference(startDate, endDate) {
          if (!startDate || !endDate) return 'Select both dates';
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
      `
      const bugs = testClass.detectBugs(correctCode)
      expect(bugs).toHaveLength(0)
    })
  })
}) 