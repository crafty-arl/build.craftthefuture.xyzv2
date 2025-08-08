import { describe, it, expect } from '@jest/globals'
import { PollMakerTest } from '../../../lib/utils/toolTests/pollMakerTest'

describe('Poll Maker Tool', () => {
  const testClass = new PollMakerTest()

  describe('Compile & Bug Detection', () => {
    it('compiles valid code', () => {
      const code = `
        function handleVote(optionId, votes, setVotes) {
          setVotes(prev => ({ ...prev, [optionId]: (prev[optionId]||0)+1 }))
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
    })

    it('handles invalid inputs', async () => {
      const result = await testClass.testInvalidInputs()
      expect(result.success).toBe(true)
    })

    it('counts votes correctly', async () => {
      const result = await testClass.testVoteCounting()
      expect(result.success).toBe(true)
    })
  })
})


