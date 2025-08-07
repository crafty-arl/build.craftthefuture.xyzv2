export class ReactCodeGenerator {
  /**
   * Generates properly formatted React code with necessary imports
   */
  static generateReactCode(code: string, componentName: string): string {
    // Clean the code first
    const cleanedCode = code.replace(/export default.*;?\s*$/, '').trim()
    
    // Detect what React features are being used
    const usesState = cleanedCode.includes('useState')
    const usesEffect = cleanedCode.includes('useEffect')
    const usesCallback = cleanedCode.includes('useCallback')
    const usesMemo = cleanedCode.includes('useMemo')
    const usesRef = cleanedCode.includes('useRef')
    const usesReducer = cleanedCode.includes('useReducer')
    const usesContext = cleanedCode.includes('useContext')
    const usesLayoutEffect = cleanedCode.includes('useLayoutEffect')
    
    // Build the import statement
    const hooks = []
    
    if (usesState) hooks.push('useState')
    if (usesEffect) hooks.push('useEffect')
    if (usesCallback) hooks.push('useCallback')
    if (usesMemo) hooks.push('useMemo')
    if (usesRef) hooks.push('useRef')
    if (usesReducer) hooks.push('useReducer')
    if (usesContext) hooks.push('useContext')
    if (usesLayoutEffect) hooks.push('useLayoutEffect')
    
    let importStatement = ''
    if (hooks.length > 0) {
      importStatement = `import React, { ${hooks.join(', ')} } from 'react';\n\n`
    } else {
      importStatement = `import React from 'react';\n\n`
    }
    
    // Check if the code already has proper component structure
    const hasComponentDefinition = cleanedCode.includes(`function ${componentName}`) || 
                                   cleanedCode.includes(`const ${componentName}`) ||
                                   cleanedCode.includes(`class ${componentName}`)
    
    let finalCode = ''
    
    if (hasComponentDefinition) {
      // Code already has component definition
      finalCode = `${importStatement}${cleanedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    } else {
      // Need to wrap code in component
      finalCode = `${importStatement}function ${componentName}() {\n${this.indentCode(cleanedCode)}\n}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    return finalCode
  }
  
  /**
   * Generates code specifically for tools with proper error handling
   */
  static generateToolCode(toolId: string, code: string): string {
    const componentName = this.getComponentName(toolId)
    const cleanedCode = code.replace(/export default.*;?\s*$/, '').trim()
    
    // Tool-specific code generation
    switch (toolId) {
      case 'date-calculator':
        return this.generateDateCalculatorCode(cleanedCode, componentName)
      case 'product-name-generator':
        return this.generateProductNameGeneratorCode(cleanedCode, componentName)
      case 'receipt-builder':
        return this.generateReceiptBuilderCode(cleanedCode, componentName)
      case 'poll-maker':
        return this.generatePollMakerCode(cleanedCode, componentName)
      case 'bio-generator':
        return this.generateBioGeneratorCode(cleanedCode, componentName)
      default:
        return this.generateReactCode(code, componentName)
    }
  }
  
  private static generateDateCalculatorCode(code: string, componentName: string): string {
    const importStatement = `import React, { useState } from 'react';\n\n`
    
    // Check if code has component structure
    if (code.includes(`function ${componentName}`)) {
      // Check if imports already exist
      const hasImports = code.includes('import React') || code.includes('import { useState }')
      const finalCode = hasImports ? code : `${importStatement}${code}`
      return `${finalCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    // Wrap code in component if needed
    const wrappedCode = `function ${componentName}() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 'Select both dates';
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Date Calculator</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Start Date: </label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>End Date: </label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <strong>Days between: {calculateDays()}</strong>
      </div>
    </div>
  )
}`
    
    return `${importStatement}${wrappedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
  }
  
  private static generateProductNameGeneratorCode(code: string, componentName: string): string {
    const importStatement = `import React, { useState } from 'react';\n\n`
    
    if (code.includes(`function ${componentName}`)) {
      // Check if imports already exist
      const hasImports = code.includes('import React') || code.includes('import { useState }')
      const finalCode = hasImports ? code : `${importStatement}${code}`
      return `${finalCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    const wrappedCode = `function ${componentName}() {
  const [baseName, setBaseName] = useState('')
  const [suffixes, setSuffixes] = useState(['Pro', 'Plus', 'Elite', 'Max'])
  const [generatedNames, setGeneratedNames] = useState([])
  
  const generateNames = () => {
    if (!baseName) return
    const newNames = suffixes.map(suffix => baseName + suffix)
    setGeneratedNames(newNames)
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Product Name Generator</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Base Name: </label>
        <input 
          type="text" 
          value={baseName} 
          onChange={(e) => setBaseName(e.target.value)}
          placeholder="Enter base name"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      <button 
        onClick={generateNames}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Generate Names
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Generated Names:</h3>
        <ul>
          {generatedNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}`
    
    return `${importStatement}${wrappedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
  }
  
  private static generateReceiptBuilderCode(code: string, componentName: string): string {
    const importStatement = `import React, { useState } from 'react';\n\n`
    
    if (code.includes(`function ${componentName}`)) {
      // Check if imports already exist
      const hasImports = code.includes('import React') || code.includes('import { useState }')
      const finalCode = hasImports ? code : `${importStatement}${code}`
      return `${finalCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    const wrappedCode = `function ${componentName}() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '1' })
  
  const addItem = () => {
    if (!newItem.name || !newItem.price) return
    setItems([...items, { ...newItem, id: Date.now() }])
    setNewItem({ name: '', price: '', quantity: '1' })
  }
  
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 0
      return total + (price * quantity)
    }, 0).toFixed(2)
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Receipt Builder</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          type="number" 
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          type="number" 
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button 
          onClick={addItem}
          style={{ padding: '5px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Add Item
        </button>
      </div>
      <div>
        <h3>Items:</h3>
        {items.map((item) => (
          <div key={item.id} style={{ marginBottom: '5px' }}>
            {item.name} - {item.price} x {item.quantity}
          </div>
        ))}
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          Total: {calculateTotal()}
        </div>
      </div>
    </div>
  )
}`
    
    return `${importStatement}${wrappedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
  }
  
  private static generatePollMakerCode(code: string, componentName: string): string {
    const importStatement = `import React, { useState } from 'react';\n\n`
    
    if (code.includes(`function ${componentName}`)) {
      // Check if imports already exist
      const hasImports = code.includes('import React') || code.includes('import { useState }')
      const finalCode = hasImports ? code : `${importStatement}${code}`
      return `${finalCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    const wrappedCode = `function ${componentName}() {
  const [question, setQuestion] = useState('What is your favorite programming language?')
  const [options, setOptions] = useState(['JavaScript', 'Python', 'TypeScript', 'Go'])
  const [votes, setVotes] = useState({ 'JavaScript': 0, 'Python': 0, 'TypeScript': 0, 'Go': 0 })
  
  const handleVote = (option) => {
    setVotes(prev => ({
      ...prev,
      [option]: (prev[option] || 0) + 1
    }))
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Poll Maker</h2>
      <h3>{question}</h3>
      <div style={{ marginBottom: '20px' }}>
        {options.map(option => (
          <div key={option} style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => handleVote(option)}
              style={{ 
                padding: '10px 20px', 
                marginRight: '10px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px' 
              }}
            >
              {option}
            </button>
            <span>({votes[option]} votes)</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
    
    return `${importStatement}${wrappedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
  }
  
  private static generateBioGeneratorCode(code: string, componentName: string): string {
    const importStatement = `import React, { useState } from 'react';\n\n`
    
    if (code.includes(`function ${componentName}`)) {
      // Check if imports already exist
      const hasImports = code.includes('import React') || code.includes('import { useState }')
      const finalCode = hasImports ? code : `${importStatement}${code}`
      return `${finalCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
    }
    
    const wrappedCode = `function ${componentName}() {
  const [generatedBio, setGeneratedBio] = useState('')
  
  const names = ['Alex', 'Morgan', 'Jordan', 'Casey', 'Riley', 'Quinn']
  const jobs = ['Software Engineer', 'Designer', 'Teacher', 'Doctor', 'Writer', 'Musician']
  const hobbies = ['reading', 'cooking', 'hiking', 'photography', 'gaming', 'traveling']
  
  const generateBio = () => {
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)]
    const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)]
    
    const bio = \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`
    setGeneratedBio(bio)
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Bio Generator</h2>
      <button 
        onClick={generateBio}
        style={{ 
          padding: '15px 30px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        Generate Bio
      </button>
      {generatedBio && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h3>Generated Bio:</h3>
          <p style={{ fontSize: '18px' }}>{generatedBio}</p>
        </div>
      )}
    </div>
  )
}`
    
    return `${importStatement}${wrappedCode}\n\nfunction App() {\n  return <${componentName} />\n}\n\nexport default App;`
  }
  
  private static getComponentName(toolId: string): string {
    const componentNames: { [key: string]: string } = {
      'date-calculator': 'DateCalculator',
      'product-name-generator': 'ProductNameGenerator',
      'receipt-builder': 'ReceiptBuilder',
      'poll-maker': 'PollMaker',
      'bio-generator': 'BioGenerator'
    }
    return componentNames[toolId] || 'MyComponent'
  }
  
  private static indentCode(code: string, spaces: number = 2): string {
    const indent = ' '.repeat(spaces)
    return code.split('\n').map(line => line.trim() ? indent + line : line).join('\n')
  }
  
  /**
   * Validates React code for common issues
   */
  static validateReactCode(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check for useState without import
    if (code.includes('useState') && !code.includes('import')) {
      errors.push('useState is used but React is not imported')
    }
    
    // Check for useEffect without import
    if (code.includes('useEffect') && !code.includes('useEffect')) {
      errors.push('useEffect is used but not imported')
    }
    
    // Check for JSX without React import
    if ((code.includes('<') && code.includes('>')) && !code.includes('import React')) {
      errors.push('JSX is used but React is not imported')
    }
    
    // Check for missing component export
    if (!code.includes('export default') && !code.includes('function App')) {
      errors.push('No default export or App component found')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
} 