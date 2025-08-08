import { describe, it, expect } from '@jest/globals'
import { ProductNameGeneratorTest } from '../../../lib/utils/toolTests/productNameGeneratorTest'

describe('Product Name Generator Tool', () => {
  const testClass = new ProductNameGeneratorTest()

  describe('Compile & Bug Detection', () => {
    it('compiles valid code', () => {
      const code = `
        function generateProductNames(baseName, suffixes) {
          return suffixes.map(s => baseName + s)
        }
      `
      const result = testClass.compileTest(code)
      expect(result.success).toBe(true)
    })

    it('detects missing array mapping', () => {
      const code = `
        function generateProductNames(baseName, suffixes) {
          return [baseName]
        }
      `
      const bugs = testClass.detectBugs(code)
      expect(bugs).toContain('missing-array-mapping')
    })
  })

  describe('Integration-like', () => {
    it('handles valid inputs', async () => {
      const result = await testClass.testValidInputs()
      expect(result.success).toBe(true)
      expect(Array.isArray(result.output)).toBe(true)
      expect(result.output.length).toBeGreaterThanOrEqual(1)
    })

    it('handles invalid inputs', async () => {
      const result = await testClass.testInvalidInputs()
      expect(result.success).toBe(true)
    })

    it('generates expected names', async () => {
      const result = await testClass.testNameGeneration()
      expect(result.success).toBe(true)
    })
  })
})


