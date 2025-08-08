import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

const requiredFields = ['id','title','description','difficulty','bugs','brokenCode','fixedCode']

function readJson(p: string) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

describe('Tool JSON schema (public/*_tool.json)', () => {
  const publicDir = path.join(process.cwd(), 'public')
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('_tool.json'))

  it('has at least one tool file', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    it(`${file} has required fields`, () => {
      const data = readJson(path.join(publicDir, file))
      for (const field of requiredFields) {
        expect(data[field]).not.toBeUndefined()
      }
      expect(Array.isArray(data.bugs)).toBe(true)
    })
  }
})


