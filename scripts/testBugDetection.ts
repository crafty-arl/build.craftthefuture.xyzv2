import { BugTestCases } from '../lib/utils/bugTestCases'

async function testBugDetection() {
  console.log('🧪 Testing Comprehensive Bug Detection System')
  console.log('='.repeat(60))
  
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
    console.log(`\n🔧 Testing ${toolId}...`)
    
    const testCases = BugTestCases.getTestCasesForTool(toolId)
    console.log(`Found ${testCases.length} test cases for ${toolId}`)
    
    for (const testCase of testCases) {
      console.log(`\n  🐛 Testing Bug ${testCase.bugId}: ${testCase.name}`)
      console.log(`  Description: ${testCase.description}`)
      
      // Test 1: Broken code should NOT be detected as fixed
      const brokenCodeResult = BugTestCases.testBugFix(toolId, testCase.bugId, testCase.brokenCode)
      totalTests++
      if (!brokenCodeResult) {
        passedTests++
        console.log(`  ✅ Test 1 PASSED: Broken code correctly NOT detected as fixed`)
      } else {
        console.log(`  ❌ Test 1 FAILED: Broken code incorrectly detected as fixed`)
      }
      
      // Test 2: Fixed code should be detected as fixed
      const fixedCodeResult = BugTestCases.testBugFix(toolId, testCase.bugId, testCase.fixedCode)
      totalTests++
      if (fixedCodeResult) {
        passedTests++
        console.log(`  ✅ Test 2 PASSED: Fixed code correctly detected as fixed`)
      } else {
        console.log(`  ❌ Test 2 FAILED: Fixed code incorrectly NOT detected as fixed`)
      }
      
      // Test 3: Validation should provide confidence scores
      const validation = BugTestCases.validateBugFix(toolId, testCase.bugId, testCase.fixedCode)
      totalTests++
      if (validation.isFixed && validation.confidence > 0) {
        passedTests++
        console.log(`  ✅ Test 3 PASSED: Validation provides confidence score (${validation.confidence.toFixed(1)}%)`)
      } else {
        console.log(`  ❌ Test 3 FAILED: Validation failed (isFixed: ${validation.isFixed}, confidence: ${validation.confidence}%)`)
      }
      
      // Test 4: Detailed results should be comprehensive
      const detailedResults = BugTestCases.getDetailedTestResults(toolId, testCase.fixedCode)
      totalTests++
      if (detailedResults.fixedBugs.includes(testCase.bugId)) {
        passedTests++
        console.log(`  ✅ Test 4 PASSED: Detailed results correctly identify fixed bug`)
      } else {
        console.log(`  ❌ Test 4 FAILED: Detailed results failed to identify fixed bug`)
      }
    }
  }
  
  console.log('\n📊 Final Test Results:')
  console.log('='.repeat(60))
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed Tests: ${passedTests}`)
  console.log(`Failed Tests: ${totalTests - passedTests}`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Bug detection system is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Please review the bug detection logic.')
  }
  
  // Test edge cases
  console.log('\n🔍 Testing Edge Cases...')
  
  // Test with empty code
  const emptyCodeResult = BugTestCases.getFixedBugs('date-calculator', '')
  console.log(`Empty code test: ${emptyCodeResult.length === 0 ? '✅ PASSED' : '❌ FAILED'}`)
  
  // Test with partial fixes
  const partialFixCode = `
    const calculateDays = () => {
      if (!startDate || !endDate) {
        return 'Select both dates'
      }
      const diffTime = endDate - startDate
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      setResult(diffDays)
    }
  `
  const partialFixResult = BugTestCases.getDetailedTestResults('date-calculator', partialFixCode)
  const bug1Result = partialFixResult.testResults.find(r => r.bugId === 1)
  const bug2Result = partialFixResult.testResults.find(r => r.bugId === 2)
  
  console.log(`Partial fix test - Bug 1: ${bug1Result?.isFixed ? '✅ FIXED' : '❌ NOT FIXED'}`)
  console.log(`Partial fix test - Bug 2: ${bug2Result?.isFixed ? '✅ FIXED' : '❌ NOT FIXED'}`)
  
  // Test with completely fixed code
  const completeFixCode = `
    const calculateDays = () => {
      if (!startDate || !endDate) {
        return 'Select both dates'
      }
      const diffTime = Math.abs(endDate - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setResult(diffDays)
    }
  `
  const completeFixResult = BugTestCases.getDetailedTestResults('date-calculator', completeFixCode)
  console.log(`Complete fix test: ${completeFixResult.fixedBugs.length === 2 ? '✅ ALL BUGS FIXED' : '❌ NOT ALL BUGS FIXED'}`)
}

// Run the tests
testBugDetection().catch(console.error) 