import { ReactCodeGenerator } from '../lib/utils/reactCodeGenerator'

// Test the ReactCodeGenerator with sample tool code
const sampleCode = `function DateCalculator() {
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
}`

console.log('🧪 Testing ReactCodeGenerator...')
console.log('='.repeat(50))

const generatedCode = ReactCodeGenerator.generateToolCode('date-calculator', sampleCode)

console.log('Generated Code:')
console.log(generatedCode)

console.log('\n📊 Analysis:')
console.log('- Has React import:', generatedCode.includes('import React'))
console.log('- Has useState import:', generatedCode.includes('useState'))
console.log('- Has App component:', generatedCode.includes('function App()'))
console.log('- Has export default:', generatedCode.includes('export default App'))

const validation = ReactCodeGenerator.validateReactCode(generatedCode)
console.log('- Is valid:', validation.isValid)
if (!validation.isValid) {
  console.log('- Errors:', validation.errors)
} 