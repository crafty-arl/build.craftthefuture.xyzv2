'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Bug, Target, Play, Eye, EyeOff, Code, TestTube } from 'lucide-react'
import { FunctionalBugDetection } from '@/lib/utils/functionalBugDetection'

interface Bug {
  id: number
  title: string
  description: string
  clue: string
  bonus: string
  solution?: string
}

interface BugDebugOverlayProps {
  toolId: string
  currentCode: string
  bugs: Bug[]
  isVisible: boolean
  onClose: () => void
}

interface TestResult {
  bugId: number
  name: string
  isFixed: boolean
  confidence: number
  details: string
  testName: string
  executionTime: number
}

export function BugDebugOverlay({ 
  toolId, 
  currentCode, 
  bugs, 
  isVisible, 
  onClose 
}: BugDebugOverlayProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{
    toolId?: string;
    codeLength?: number;
    uiBugCount?: number;
    testBugCount?: number;
    highConfidenceFixed?: number;
    lowConfidenceFixed?: number;
    notFixed?: number;
    completionPercentage?: number;
    allFixed?: boolean;
    confidenceThreshold?: number;
    executionTime?: number;
    fixedBugs?: number[];
    testResults?: unknown[];
  } | null>(null)

  const runTests = async () => {
    if (!currentCode.trim()) {
      setError('No code to test')
      return
    }

    setIsRunning(true)
    setError(null)
    
    try {
      console.log(`[BugDebugOverlay] Running tests for ${toolId}`)
      console.log(`[BugDebugOverlay] Code length: ${currentCode.length}`)
      console.log(`[BugDebugOverlay] UI bugs: ${bugs.length}`)
      
      const startTime = Date.now()
      const results = await FunctionalBugDetection.getDetailedTestResults(toolId, currentCode)
      const endTime = Date.now()
      
      console.log(`[BugDebugOverlay] Raw results:`, results)
      console.log(`[BugDebugOverlay] Test execution time: ${endTime - startTime}ms`)
      
      const mappedResults: TestResult[] = results.testResults.map((result) => ({
        bugId: result.bugId,
        name: result.name || `Bug ${result.bugId}`,
        isFixed: result.isFixed,
        confidence: result.confidence,
        details: result.details,
        testName: result.testName,
        executionTime: result.executionTime
      }))
      
      setTestResults(mappedResults)
      
      const fixedCount = mappedResults.filter(r => r.isFixed && r.confidence >= 80).length
      const percentage = bugs.length > 0 ? Math.round((fixedCount / bugs.length) * 100) : 0
      setCompletionPercentage(percentage)
      
      // Collect debug information
      const debug = {
        toolId,
        codeLength: currentCode.length,
        uiBugCount: bugs.length,
        testBugCount: results.totalBugs,
        fixedBugs: results.fixedBugs,
        testResults: mappedResults,
        completionPercentage: percentage,
        allFixed: fixedCount === bugs.length && bugs.length > 0,
        executionTime: endTime - startTime,
        confidenceThreshold: 80,
        highConfidenceFixed: mappedResults.filter(r => r.isFixed && r.confidence >= 80).length,
        lowConfidenceFixed: mappedResults.filter(r => r.isFixed && r.confidence < 80).length,
        notFixed: mappedResults.filter(r => !r.isFixed).length
      }
      
      setDebugInfo(debug)
      
      console.log(`[BugDebugOverlay] Debug info:`, debug)
      console.log(`[BugDebugOverlay] Fixed: ${fixedCount}/${bugs.length} (${percentage}%)`)
      
    } catch (err) {
      console.error(`[BugDebugOverlay] Test error:`, err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    if (isVisible && currentCode) {
      runTests()
    }
  }, [isVisible, currentCode, toolId, runTests])

  if (!isVisible) return null

  const fixedBugs = testResults.filter(r => r.isFixed && r.confidence >= 80)
  const allFixed = fixedBugs.length === bugs.length && bugs.length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-[#7EE787]" />
            <h2 className="text-xl font-bold text-white">Bug Detection Debug Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Toggle raw data"
            >
              {showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-[#7EE787] text-black px-3 py-1 rounded text-sm hover:bg-[#6BD975] disabled:opacity-50"
            >
              {isRunning ? (
                <div className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-black"></div>
                  Running...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  Re-run
                </div>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500 text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Test Error</span>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-[#7EE787]" />
                <span className="text-white font-medium">UI Bugs</span>
              </div>
              <div className="text-2xl font-bold text-white">{bugs.length}</div>
              <div className="text-xs text-gray-400">From JSON config</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">Test Bugs</span>
              </div>
              <div className="text-2xl font-bold text-white">{testResults.length}</div>
              <div className="text-xs text-gray-400">From functional tests</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Fixed</span>
              </div>
              <div className="text-2xl font-bold text-white">{fixedBugs.length}</div>
              <div className="text-xs text-gray-400">High confidence (≥80%)</div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">Progress</span>
              </div>
              <div className="text-2xl font-bold text-white">{completionPercentage}%</div>
              <div className="text-xs text-gray-400">Completion rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Completion Progress</span>
              <span className="text-[#7EE787] font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-[#1E1E1E] rounded-full h-3">
              <div 
                className="bg-[#7EE787] h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Individual Test Results</h3>
            
            {testResults.length === 0 && !isRunning && (
              <div className="text-center py-8 text-gray-400">
                <Bug className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No test results available</p>
              </div>
            )}
            
            {testResults.map((result, index) => (
              <div
                key={`${result.bugId}-${index}`}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  result.isFixed && result.confidence >= 80
                    ? 'border-green-500 bg-green-950/20' 
                    : result.isFixed && result.confidence < 80
                    ? 'border-yellow-500 bg-yellow-950/20'
                    : 'border-[#2A2A2A] bg-[#252525]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isFixed && result.confidence >= 80 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : result.isFixed && result.confidence < 80 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-white">
                        {result.name}
                      </h3>
                      <span className="text-xs text-gray-400">(Bug #{result.bugId})</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.isFixed && result.confidence >= 80 ? 'bg-green-600 text-white' :
                        result.isFixed && result.confidence < 80 ? 'bg-yellow-600 text-black' :
                        'bg-red-600 text-white'
                      }`}>
                        {result.isFixed ? 'FIXED' : 'NOT FIXED'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">{result.details}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Confidence:</span>
                        <span className={`font-medium ${
                          result.confidence >= 80 ? 'text-green-400' : 
                          result.confidence >= 50 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {result.confidence}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Time:</span>
                        <span className="text-gray-400">{result.executionTime}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Test:</span>
                        <span className="text-gray-400">{result.testName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Counts:</span>
                        <span className="text-gray-400">
                          {result.isFixed && result.confidence >= 80 ? '✅ High' :
                           result.isFixed && result.confidence < 80 ? '⚠️ Low' : '❌ None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {allFixed && (
            <div className="bg-green-500 text-black rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-bold">🎉 Challenge Complete!</span>
              </div>
              <p className="text-sm">All bugs have been successfully fixed!</p>
            </div>
          )}

          {/* Debug Information */}
          {debugInfo && (
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4" />
                <span className="font-medium text-white">Debug Information</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="space-y-1">
                  <div className="text-gray-400">Tool ID: <span className="text-white">{debugInfo.toolId}</span></div>
                  <div className="text-gray-400">Code Length: <span className="text-white">{debugInfo.codeLength} chars</span></div>
                  <div className="text-gray-400">UI Bug Count: <span className="text-white">{debugInfo.uiBugCount}</span></div>
                  <div className="text-gray-400">Test Bug Count: <span className="text-white">{debugInfo.testBugCount}</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">High Confidence Fixed: <span className="text-white">{debugInfo.highConfidenceFixed}</span></div>
                  <div className="text-gray-400">Low Confidence Fixed: <span className="text-white">{debugInfo.lowConfidenceFixed}</span></div>
                  <div className="text-gray-400">Not Fixed: <span className="text-white">{debugInfo.notFixed}</span></div>
                  <div className="text-gray-400">Completion: <span className="text-white">{debugInfo.completionPercentage}%</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">All Fixed: <span className="text-white">{debugInfo.allFixed ? 'Yes' : 'No'}</span></div>
                  <div className="text-gray-400">Confidence Threshold: <span className="text-white">{debugInfo.confidenceThreshold}%</span></div>
                  <div className="text-gray-400">Execution Time: <span className="text-white">{debugInfo.executionTime}ms</span></div>
                  <div className="text-gray-400">Has Error: <span className="text-white">{error ? 'Yes' : 'No'}</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">Fixed Bug IDs: <span className="text-white">{debugInfo.fixedBugs?.join(', ') || 'None'}</span></div>
                  <div className="text-gray-400">Count Match: <span className="text-white">{debugInfo.uiBugCount === debugInfo.testBugCount ? 'Yes' : 'No'}</span></div>
                  <div className="text-gray-400">Tests Run: <span className="text-white">{debugInfo.testResults?.length || 0}</span></div>
                  <div className="text-gray-400">Status: <span className="text-white">{debugInfo.allFixed ? 'COMPLETE' : 'IN PROGRESS'}</span></div>
                </div>
              </div>
              
              {showRawData && (
                <div className="mt-4">
                  <div className="text-gray-400 text-xs mb-2">Raw Test Data:</div>
                  <pre className="bg-[#1E1E1E] p-3 rounded text-xs overflow-x-auto max-h-60">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
