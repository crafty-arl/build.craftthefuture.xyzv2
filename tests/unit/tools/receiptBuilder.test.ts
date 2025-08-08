import { describe, it, expect } from '@jest/globals'
import { ReceiptBuilderTest } from '../../../lib/utils/toolTests/receiptBuilderTest'

describe('Receipt Builder Tool', () => {
  const testClass = new ReceiptBuilderTest()

  describe('Compile & Bug Detection', () => {
    it('compiles valid code', () => {
      const code = `
        function calculateTotal(items) {
          return items.reduce((t, it) => t + (parseFloat(it.price)||0) * (parseInt(it.quantity)||0), 0)
        }
      `
      const result = testClass.compileTest(code)
      expect(result.success).toBe(true)
    })

    it('detects missing calculation', () => {
      const code = `
        function calculateTotal(items) {
          return 0
        }
      `
      const bugs = testClass.detectBugs(code)
      expect(bugs).toContain('missing-calculation')
    })
  })

  describe('Integration-like', () => {
    it('handles valid inputs', async () => {
      const result = await testClass.testValidInputs()
      expect(result.success).toBe(true)
    })

    it('handles invalid inputs', async () => {
      const result = await testClass.testInvalidInputs()
      expect(result.success).toBe(true)
    })

    it('form submission shape', async () => {
      const result = await testClass.testFormSubmission()
      expect(result.success).toBe(true)
    })
  })
})


