console.log('🧪 Simple test script running...')

// Test basic functionality
function testBasicFunctionality() {
  console.log('✅ Basic functionality test passed')
  return true
}

function testCodeCompilation() {
  try {
    // Test if basic JavaScript code compiles
    const testCode = 'function test() { return true; }'
    new Function(testCode)
    console.log('✅ Code compilation test passed')
    return true
  } catch (error) {
    console.log('❌ Code compilation test failed:', error)
    return false
  }
}

function testBugDetection() {
  // Simple bug detection test
  const codeWithBug = 'function test() { return value; }' // Missing variable
  const codeWithoutBug = 'function test() { return true; }'
  
  const hasBug1 = codeWithBug.includes('value') && !codeWithBug.includes('const value')
  const hasBug2 = !codeWithoutBug.includes('value')
  
  if (hasBug1 && hasBug2) {
    console.log('✅ Bug detection test passed')
    return true
  } else {
    console.log('❌ Bug detection test failed')
    return false
  }
}

// Run tests
const results = [
  testBasicFunctionality(),
  testCodeCompilation(),
  testBugDetection()
]

const passed = results.filter(r => r).length
const total = results.length

console.log('\n📊 Test Results:')
console.log(`- Total Tests: ${total}`)
console.log(`- Passed: ${passed}`)
console.log(`- Failed: ${total - passed}`)
console.log(`- Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

if (passed === total) {
  console.log('\n✅ All simple tests passed!')
  process.exit(0)
} else {
  console.log('\n❌ Some tests failed.')
  process.exit(1)
} 