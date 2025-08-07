import { ToolTestRunner } from '../lib/utils/toolTestRunner'
import { ReactCodeGenerator } from '../lib/utils/reactCodeGenerator'

async function runReactTestTools() {
  console.log('🧪 Running React-specific tool tests...')
  console.log('='.repeat(50))
  
  const tools = [
    'date-calculator',
    'product-name-generator', 
    'receipt-builder',
    'poll-maker',
    'bio-generator'
  ]
  
  let totalTests = 0
  let passedTests = 0
  
  for (const toolId of tools) {
    console.log(`\n🧪 Testing ${toolId}...`)
    
    try {
      // Test 1: Code Generation
      const sampleCode = getSampleCode(toolId)
      const generatedCode = ReactCodeGenerator.generateToolCode(toolId, sampleCode)
      totalTests++
      
      console.log(`Generated code preview for ${toolId}:`)
      console.log(generatedCode.substring(0, 200) + '...')
      
      if (generatedCode.includes('import React')) {
        passedTests++
        console.log(`✅ ${toolId}: Code generation successful`)
      } else {
        console.log(`❌ ${toolId}: Code generation failed - missing React import`)
      }
      
      // Test 2: React Validation
      const validation = ReactCodeGenerator.validateReactCode(generatedCode)
      totalTests++
      if (validation.isValid) {
        passedTests++
        console.log(`✅ ${toolId}: React validation passed`)
      } else {
        console.log(`❌ ${toolId}: React validation failed`)
        validation.errors.forEach(error => console.log(`   - ${error}`))
      }
      
      // Test 3: Hook Detection
      const hasCorrectHooks = testHookDetection(toolId, generatedCode)
      totalTests++
      if (hasCorrectHooks) {
        passedTests++
        console.log(`✅ ${toolId}: Hook detection correct`)
      } else {
        console.log(`❌ ${toolId}: Hook detection failed`)
      }
      
      // Test 4: CodeSandbox Compatibility
      const isSandboxReady = testCodeSandboxCompatibility(generatedCode)
      totalTests++
      if (isSandboxReady) {
        passedTests++
        console.log(`✅ ${toolId}: CodeSandbox compatible`)
      } else {
        console.log(`❌ ${toolId}: CodeSandbox compatibility failed`)
      }
      
    } catch (error) {
      console.log(`❌ ${toolId}: Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      totalTests += 4
    }
  }
  
  console.log('\n📊 React Test Results:')
  console.log('='.repeat(50))
  console.log(`- Total Tests: ${totalTests}`)
  console.log(`- Passed: ${passedTests}`)
  console.log(`- Failed: ${totalTests - passedTests}`)
  console.log(`- Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'}%`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 100% React Test Success Rate Achieved!')
    console.log('🚀 All React code generation tests passed!')
    process.exit(0)
  } else {
    console.log('\n⚠️ Some React tests failed. Check the details above.')
    process.exit(1)
  }
}

function getSampleCode(toolId: string): string {
  const sampleCodes: { [key: string]: string } = {
    'date-calculator': `
function DateCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 'Select both dates';
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  return (
    <div>
      <h2>Date Calculator</h2>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <div>Days: {calculateDays()}</div>
    </div>
  )
}
    `,
    'product-name-generator': `
function ProductNameGenerator() {
  const [baseName, setBaseName] = useState('')
  const [names, setNames] = useState([])
  
  const generateNames = () => {
    const suffixes = ['Pro', 'Plus', 'Elite']
    const newNames = suffixes.map(suffix => baseName + suffix)
    setNames(newNames)
  }
  
  return (
    <div>
      <input value={baseName} onChange={(e) => setBaseName(e.target.value)} />
      <button onClick={generateNames}>Generate</button>
      <ul>{names.map((name, i) => <li key={i}>{name}</li>)}</ul>
    </div>
  )
}
    `,
    'receipt-builder': `
function ReceiptBuilder() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '' })
  
  const addItem = () => {
    setItems([...items, newItem])
    setNewItem({ name: '', price: '' })
  }
  
  return (
    <div>
      <input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
      <button onClick={addItem}>Add</button>
    </div>
  )
}
    `,
    'poll-maker': `
function PollMaker() {
  const [votes, setVotes] = useState({})
  
  const handleVote = (option) => {
    setVotes(prev => ({...prev, [option]: (prev[option] || 0) + 1}))
  }
  
  return (
    <div>
      <button onClick={() => handleVote('option1')}>Vote A</button>
      <button onClick={() => handleVote('option2')}>Vote B</button>
    </div>
  )
}
    `,
    'bio-generator': `
function BioGenerator() {
  const [bio, setBio] = useState('')
  
  const generateBio = () => {
    const names = ['Alex', 'Jordan']
    const jobs = ['Engineer', 'Designer']
    const name = names[Math.floor(Math.random() * names.length)]
    const job = jobs[Math.floor(Math.random() * jobs.length)]
    setBio(\`\${name} is a \${job}\`)
  }
  
  return (
    <div>
      <button onClick={generateBio}>Generate</button>
      <p>{bio}</p>
    </div>
  )
}
    `
  }
  
  return sampleCodes[toolId] || 'function TestComponent() { return <div>Test</div> }'
}

function testHookDetection(toolId: string, generatedCode: string): boolean {
  // Test that the generated code correctly detects and imports the right hooks
  const expectedHooks: { [key: string]: string[] } = {
    'date-calculator': ['useState'],
    'product-name-generator': ['useState'],
    'receipt-builder': ['useState'],
    'poll-maker': ['useState'],
    'bio-generator': ['useState']
  }
  
  const hooks = expectedHooks[toolId] || []
  
  for (const hook of hooks) {
    if (!generatedCode.includes(hook)) {
      return false
    }
  }
  
  // Check that the import statement includes the hooks
  if (hooks.length > 0 && !generatedCode.includes(`{ ${hooks.join(', ')} }`)) {
    return false
  }
  
  return true
}

function testCodeSandboxCompatibility(generatedCode: string): boolean {
  // Test that the generated code is compatible with CodeSandbox
  const requirements = [
    'import React',        // Has React import
    'function App()',      // Has App component
    'export default App',  // Has default export
    'return <'             // Has JSX return
  ]
  
  return requirements.every(requirement => generatedCode.includes(requirement))
}

// Run the React tests
runReactTestTools() 