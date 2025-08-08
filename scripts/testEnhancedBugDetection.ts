import { BugDetectionEngine } from '../lib/utils/bugDetectionEngine';
import { EnhancedToolManager } from '../lib/utils/enhancedToolManager';

async function testEnhancedBugDetection() {
  console.log('🧪 Testing Enhanced Bug Detection System');
  console.log('='.repeat(50));
  
  const detectionEngine = new BugDetectionEngine();
  const toolManager = EnhancedToolManager.getInstance();
  
  const testCases = [
    {
      toolId: 'date-calculator',
      bugId: 1,
      code: `
        function calculateDateDifference(startDate, endDate) {
          if (!startDate || !endDate) {
            return 'Select both dates';
          }
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
      `,
      description: 'Date Calculator - Fixed Validation Bug'
    },
    {
      toolId: 'date-calculator',
      bugId: 2,
      code: `
        function calculateDateDifference(startDate, endDate) {
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
      `,
      description: 'Date Calculator - Fixed Math Functions Bug'
    },
    {
      toolId: 'product-name-generator',
      bugId: 1,
      code: `
        function generateProductNames() {
          const suffixes = ['Pro', 'Max', 'Ultra', 'Plus'];
          const newNames = suffixes.map(suffix => 'Product' + suffix);
          return newNames;
        }
      `,
      description: 'Product Name Generator - Fixed Array Mapping Bug'
    },
    {
      toolId: 'receipt-builder',
      bugId: 1,
      code: `
        function handleSubmit(event) {
          event.preventDefault();
          // Form handling logic
        }
      `,
      description: 'Receipt Builder - Fixed Form Handling Bug'
    },
    {
      toolId: 'poll-maker',
      bugId: 1,
      code: `
        function handleVote(option) {
          setVotes(prev => ({
            ...prev,
            [option]: prev[option] + 1
          }));
        }
      `,
      description: 'Poll Maker - Fixed State Updates Bug'
    }
  ];
  
  let totalTests = 0;
  let passedTests = 0;
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.description}`);
    console.log(`Tool: ${testCase.toolId}, Bug: ${testCase.bugId}`);
    
    try {
      // Test individual detection methods
      const patternResult = detectionEngine.detectByPattern(testCase.toolId, testCase.bugId, testCase.code);
      const testResult = await detectionEngine.detectByTestExecution(testCase.toolId, testCase.bugId, testCase.code);
      const analysisResult = detectionEngine.detectByCodeAnalysis(testCase.toolId, testCase.bugId, testCase.code);
      
      // Test combined detection
      const combinedResult = await detectionEngine.detectBugCompletion(testCase.toolId, testCase.bugId, testCase.code);
      
      totalTests += 4; // 4 detection methods
      
      // Log results
      console.log(`✅ Pattern Match: ${patternResult.success ? 'PASS' : 'FAIL'} (${patternResult.confidence.toFixed(1)}% confidence)`);
      console.log(`✅ Test Execution: ${testResult.success ? 'PASS' : 'FAIL'} (${testResult.confidence.toFixed(1)}% confidence)`);
      console.log(`✅ Code Analysis: ${analysisResult.success ? 'PASS' : 'FAIL'} (${analysisResult.confidence.toFixed(1)}% confidence)`);
      console.log(`✅ Combined Detection: ${combinedResult.success ? 'PASS' : 'FAIL'} (${combinedResult.confidence.toFixed(1)}% confidence)`);
      
      if (patternResult.success) passedTests++;
      if (testResult.success) passedTests++;
      if (analysisResult.success) passedTests++;
      if (combinedResult.success) passedTests++;
      
      // Test tool manager integration
      const toolManagerResult = await toolManager.detectBugCompletions(testCase.toolId, testCase.code);
      console.log(`📊 Tool Manager: ${toolManagerResult.newCompletions.length} new completions detected`);
      
    } catch (error) {
      console.log(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      totalTests += 4;
    }
  }
  
  // Performance metrics
  const performanceMetrics = detectionEngine.getPerformanceMetrics();
  console.log('\n📊 Performance Metrics:');
  console.log('='.repeat(30));
  Object.entries(performanceMetrics).forEach(([method, avgTime]) => {
    console.log(`${method}: ${avgTime.toFixed(2)}ms average`);
  });
  
  // Final results
  console.log('\n📊 Final Results:');
  console.log('='.repeat(30));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Enhanced bug detection system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check individual results above.');
  }
}

// Run the test
testEnhancedBugDetection().catch(console.error); 