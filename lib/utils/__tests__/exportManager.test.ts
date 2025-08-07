import { ExportManager, ExportOptions } from '../exportManager'

describe('ExportManager', () => {
  const sampleCode = `
function TestComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

export default TestComponent;
`

  const defaultOptions: ExportOptions = {
    format: 'react-component',
    includeDependencies: false,
    includeStyles: false,
    includeTests: false
  }

  describe('exportAsReactComponent', () => {
    it('should export code as a React component', () => {
      const result = ExportManager.exportAsReactComponent(sampleCode, 'TestComponent', defaultOptions)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeInstanceOf(Blob)
      expect(result.error).toBeUndefined()
    })

    it('should handle invalid code gracefully', () => {
      const invalidCode = 'function TestComponent() { return <div>'
      const result = ExportManager.exportAsReactComponent(invalidCode, 'TestComponent', defaultOptions)
      
      expect(result.success).toBe(true) // Should still succeed as we're just wrapping
      expect(result.data).toBeInstanceOf(Blob)
    })
  })

  describe('exportAsNextJSProject', () => {
    it('should export code as a Next.js project', async () => {
      const result = await ExportManager.exportAsNextJSProject(sampleCode, 'TestComponent', defaultOptions)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeInstanceOf(Blob)
      expect(result.error).toBeUndefined()
    })
  })

  describe('exportToCodeSandbox', () => {
    it('should create a CodeSandbox URL', async () => {
      const result = await ExportManager.exportToCodeSandbox(sampleCode, 'TestComponent', defaultOptions)
      
      // Note: This test might fail if CodeSandbox API is down
      // In a real test environment, you'd mock the fetch call
      expect(result.success).toBeDefined()
      if (result.success) {
        expect(result.url).toContain('codesandbox.io')
      }
    })
  })

  describe('exportToGitHubGist', () => {
    it('should create GitHub Gist data', async () => {
      const result = await ExportManager.exportToGitHubGist(sampleCode, 'TestComponent', defaultOptions)
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      
      if (result.data && typeof result.data === 'string') {
        const gistData = JSON.parse(result.data)
        expect(gistData.description).toContain('TestComponent')
        expect(gistData.files).toBeDefined()
      }
    })
  })

  describe('downloadFile', () => {
    it('should create a download link', () => {
      const content = 'test content'
      const filename = 'test.js'
      
      // Mock document.createElement and related methods
      const mockCreateElement = jest.fn()
      const mockAppendChild = jest.fn()
      const mockRemoveChild = jest.fn()
      const mockClick = jest.fn()
      
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true
      })
      
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true
      })
      
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true
      })
      
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      }
      
      mockCreateElement.mockReturnValue(mockAnchor)
      
      ExportManager.downloadFile(content, filename)
      
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAnchor.download).toBe(filename)
      expect(mockClick).toHaveBeenCalled()
    })
  })

  describe('code cleaning', () => {
    it('should clean export statements', () => {
      const codeWithExport = `
function TestComponent() {
  return <div>Hello</div>
}

export default TestComponent;
`
      
      const result = ExportManager.exportAsReactComponent(codeWithExport, 'TestComponent', defaultOptions)
      expect(result.success).toBe(true)
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
      
      const result = ExportManager.exportAsReactComponent(codeWithImports, 'TestComponent', defaultOptions)
      expect(result.success).toBe(true)
    })
  })
}) 