import { ToolTestRunner } from '../lib/utils/toolTestRunner'

async function runAllToolTests() {
  console.log('🧪 Running tool tests...')
  console.log('='.repeat(50))
  
  try {
    const results = await ToolTestRunner.runAllTests()
    
    console.log('\n📊 Test Results:')
    console.log('='.repeat(50))
    
    results.forEach(result => {
      const status = result.passed === result.total ? '✅' : '❌'
      console.log(`${status} ${result.toolId}: ${result.passed}/${result.total} tests passed`)
    })
    
    const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
    const totalTests = results.reduce((sum, r) => sum + r.total, 0)
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0'
    
    console.log('\n🎯 Overall Results:')
    console.log(`- Total Tests: ${totalTests}`)
    console.log(`- Passed: ${totalPassed}`)
    console.log(`- Failed: ${totalTests - totalPassed}`)
    console.log(`- Success Rate: ${successRate}%`)
    
    // Generate detailed report
    const report = ToolTestRunner.generateReport(results)
    
    // Save report to file
    const fs = require('fs')
    const path = require('path')
    const reportPath = path.join(__dirname, '..', 'tests', 'test-report.md')
    
    try {
      fs.writeFileSync(reportPath, report)
      console.log(`\n📄 Detailed report saved to: ${reportPath}`)
    } catch (error) {
      console.error('Failed to save report:', error)
    }
    
    if (totalPassed < totalTests) {
      console.log('\n❌ Some tests failed. Check the report for details.')
      process.exit(1)
    } else {
      console.log('\n✅ All tests passed!')
    }
    
  } catch (error) {
    console.error('❌ Error running tests:', error)
    process.exit(1)
  }
}

// Run the tests
runAllToolTests() 