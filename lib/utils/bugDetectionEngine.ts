import { DetectionResult } from '../types/enhancedBugTypes';
import { BugTestRunner } from './bugTestRunner';
import { CodeAnalyzer } from './codeAnalyzer';
import { PerformanceMonitor } from './performanceMonitor';

export class BugDetectionEngine {
  private testRunner: BugTestRunner;
  private codeAnalyzer: CodeAnalyzer;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.testRunner = new BugTestRunner();
    this.codeAnalyzer = new CodeAnalyzer();
    this.performanceMonitor = new PerformanceMonitor();
  }

  // Method 1: Enhanced Pattern Matching
  detectByPattern(toolId: string, bugId: number, code: string): DetectionResult {
    const startTime = Date.now();
    
    try {
      const patterns = this.getBugPatterns(toolId, bugId);
      const matches = patterns.patterns.filter(pattern => code.includes(pattern));
      const success = matches.length >= patterns.required;
      const confidence = success ? patterns.confidence : Math.max(0, (matches.length / patterns.patterns.length) * 50);
      
      const result: DetectionResult = {
        success,
        confidence,
        method: 'pattern-match',
        details: `Found ${matches.length}/${patterns.patterns.length} required patterns`,
        executionTime: Date.now() - startTime
      };

      this.performanceMonitor.trackDetectionPerformance('pattern-match', result.executionTime!, success);
      return result;
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        method: 'pattern-match',
        details: `Pattern matching failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method 2: Test Execution
  async detectByTestExecution(toolId: string, bugId: number, code: string): Promise<DetectionResult> {
    const startTime = Date.now();
    
    try {
      const testResult = await this.testRunner.runBugTest(toolId, bugId, code);
      
      const result: DetectionResult = {
        success: testResult.success,
        confidence: testResult.success ? 90 : 10,
        method: 'test-execution',
        details: testResult.success ? 'All tests passed' : testResult.errorMessage,
        executionTime: Date.now() - startTime
      };

      this.performanceMonitor.trackDetectionPerformance('test-execution', result.executionTime!, testResult.success);
      return result;
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        method: 'test-execution',
        details: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method 3: Code Structure Analysis
  detectByCodeAnalysis(toolId: string, bugId: number, code: string): DetectionResult {
    const startTime = Date.now();
    
    try {
      const analysis = this.codeAnalyzer.analyzeCodeStructure(toolId, bugId, code);
      
      const result: DetectionResult = {
        success: analysis.isStructurallyCorrect,
        confidence: analysis.confidence,
        method: 'code-analysis',
        details: analysis.reasoning,
        executionTime: Date.now() - startTime
      };

      this.performanceMonitor.trackDetectionPerformance('code-analysis', result.executionTime!, analysis.isStructurallyCorrect);
      return result;
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        method: 'code-analysis',
        details: `Code analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method 4: Combined Detection (Primary method)
  async detectBugCompletion(toolId: string, bugId: number, code: string): Promise<DetectionResult> {
    const startTime = Date.now();
    
    try {
      // Run all detection methods in parallel
      const [patternResult, testResult, analysisResult] = await Promise.all([
        this.detectByPattern(toolId, bugId, code),
        this.detectByTestExecution(toolId, bugId, code),
        this.detectByCodeAnalysis(toolId, bugId, code)
      ]);

      // Combine results for final decision
      const combinedResult = this.combineDetectionResults([patternResult, testResult, analysisResult]);
      
      const result: DetectionResult = {
        success: combinedResult.isFixed,
        confidence: combinedResult.confidence,
        method: 'combined',
        details: combinedResult.details,
        executionTime: Date.now() - startTime
      };

      this.performanceMonitor.trackDetectionPerformance('combined', result.executionTime!, combinedResult.isFixed);
      return result;
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        method: 'combined',
        details: `Combined detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Combine multiple detection methods
  private combineDetectionResults(results: DetectionResult[]): { isFixed: boolean; confidence: number; details: string } {
    const successfulResults = results.filter(r => r.success);
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    
    // Require at least 2 methods to agree for high confidence
    const isFixed = successfulResults.length >= 2;
    const confidence = isFixed ? Math.min(95, avgConfidence + 10) : Math.max(5, avgConfidence - 20);
    
    const details = `Combined ${results.length} detection methods: ${successfulResults.length} successful, ${avgConfidence.toFixed(1)}% average confidence`;
    
    return { isFixed, confidence, details };
  }

  // Get bug-specific patterns and requirements
  private getBugPatterns(toolId: string, bugId: number): { patterns: string[]; required: number; confidence: number } {
    const patterns: Record<string, Record<number, { patterns: string[]; required: number; confidence: number }>> = {
      'date-calculator': {
        1: {
          patterns: ['if (!startDate || !endDate)', 'if (!startDate', 'if (!endDate)', 'Select both dates'],
          required: 1,
          confidence: 85
        },
        2: {
          patterns: ['Math.abs', 'Math.ceil'],
          required: 2,
          confidence: 90
        }
      },
      'product-name-generator': {
        1: {
          patterns: ['suffixes.map', '.map(suffix', 'newNames'],
          required: 1,
          confidence: 80
        }
      },
      'receipt-builder': {
        1: {
          patterns: ['onSubmit', 'preventDefault'],
          required: 2,
          confidence: 85
        },
        2: {
          patterns: ['parseFloat', 'Number('],
          required: 1,
          confidence: 80
        }
      },
      'poll-maker': {
        1: {
          patterns: ['setVotes', 'prev =>'],
          required: 2,
          confidence: 85
        },
        2: {
          patterns: ['onClick', 'handleVote'],
          required: 2,
          confidence: 85
        }
      },
      'bio-generator': {
        1: {
          patterns: ['Math.floor(Math.random()', 'Math.random() * names.length', 'Math.random() * jobs.length', 'Math.random() * hobbies.length'],
          required: 1,
          confidence: 80
        },
        2: {
          patterns: ['Morgan', 'Riley', 'Quinn', 'Doctor', 'Writer', 'Musician'],
          required: 2,
          confidence: 85
        }
      }
    };
    
    return patterns[toolId]?.[bugId] || { patterns: [], required: 0, confidence: 0 };
  }

  // Get performance metrics
  getPerformanceMetrics(): Record<string, number> {
    return {
      'pattern-match': this.performanceMonitor.getAverageExecutionTime('pattern-match'),
      'test-execution': this.performanceMonitor.getAverageExecutionTime('test-execution'),
      'code-analysis': this.performanceMonitor.getAverageExecutionTime('code-analysis'),
      'combined': this.performanceMonitor.getAverageExecutionTime('combined')
    };
  }
} 