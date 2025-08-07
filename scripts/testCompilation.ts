import { CompilationTester } from '../lib/utils/compilationTester'

async function testToolCompilation() {
  console.log('🔧 Testing tool compilation...')
  console.log('='.repeat(50))
  
  const tools = [
    'date-calculator',
    'product-name-generator', 
    'receipt-builder',
    'poll-maker',
    'bio-generator'
  ]
  
  const sampleCodes: { [key: string]: string } = {
    'date-calculator': `
      function calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) return 'Select both dates';
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
    `,
    'product-name-generator': `
      function generateProductNames(baseName, suffixes) {
        const newNames = suffixes.map(suffix => baseName + suffix);
        return newNames;
      }
    `,
    'receipt-builder': `
      function calculateTotal(items) {
        return items.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return total + (price * quantity);
        }, 0);
      }
    `,
    'poll-maker': `
      function handleVote(optionId, votes, setVotes) {
        setVotes(prev => ({
          ...prev,
          [optionId]: (prev[optionId] || 0) + 1
        }));
      }
    `,
    'bio-generator': `
      function generateBio(names, jobs, hobbies) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
        
        return \`\${randomName} is a \${randomJob} who loves \${randomHobby}.\`;
      }
    `
  }
  
  let totalTests = 0
  let passedTests = 0
  
  for (const toolId of tools) {
    console.log(`\n🧪 Testing ${toolId} compilation...`)
    
    try {
      const code = sampleCodes[toolId]
      const result = await CompilationTester.testToolCompilation(toolId, code)
      
      totalTests++
      if (result.success) {
        passedTests++
        console.log(`✅ ${toolId}: Compilation successful`)
      } else {
        console.log(`❌ ${toolId}: Compilation failed`)
        
        if (result.results.syntax.errors && result.results.syntax.errors.length > 0) {
          console.log(`  - Syntax errors: ${result.results.syntax.errors.join(', ')}`)
        }
        
        if (result.results.runtime.errors && result.results.runtime.errors.length > 0) {
          console.log(`  - Runtime errors: ${result.results.runtime.errors.join(', ')}`)
        }
        
        if (result.results.bugDetection.length > 0) {
          console.log(`  - Detected bugs: ${result.results.bugDetection.join(', ')}`)
        }
      }
      
      // Test integration results
      if (result.results.integration.length > 0) {
        console.log(`  - Integration tests: ${result.results.integration.filter(r => r.success).length}/${result.results.integration.length} passed`)
      }
      
    } catch (error) {
      totalTests++
      console.log(`❌ ${toolId}: Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  console.log('\n📊 Compilation Test Summary:')
  console.log('='.repeat(50))
  console.log(`- Total Tools Tested: ${totalTests}`)
  console.log(`- Passed: ${passedTests}`)
  console.log(`- Failed: ${totalTests - passedTests}`)
  console.log(`- Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'}%`)
  
  if (passedTests < totalTests) {
    console.log('\n❌ Some compilation tests failed.')
    process.exit(1)
  } else {
    console.log('\n✅ All compilation tests passed!')
  }
}

// Run the compilation tests
testToolCompilation() 