import { describe, it, expect } from '@jest/globals'
import { BioGeneratorTest } from '../../../lib/utils/toolTests/bioGeneratorTest'

describe('Bio Generator Tool', () => {
  const testClass = new BioGeneratorTest()

  describe('Compile & Bug Detection', () => {
    it('compiles valid code', () => {
      const code = `
        function generateBio(names, jobs, hobbies) {
          const n = names[Math.floor(Math.random()*names.length)]
          const j = jobs[Math.floor(Math.random()*jobs.length)]
          const h = hobbies[Math.floor(Math.random()*hobbies.length)]
          return n + ' is a ' + j + ' who loves ' + h + '.'
        }
      `
      const result = testClass.compileTest(code)
      expect(result.success).toBe(true)
    })
  })

  describe('Integration-like', () => {
    it('handles valid inputs', async () => {
      const result = await testClass.testValidInputs()
      expect(result.success).toBe(true)
      expect(typeof result.output).toBe('string')
    })

    it('handles invalid inputs', async () => {
      const result = await testClass.testInvalidInputs()
      expect(result.success).toBe(true)
    })

    it('generates bio with expected tokens', async () => {
      const result = await testClass.testBioGeneration()
      expect(result.success).toBe(true)
    })
  })
})


