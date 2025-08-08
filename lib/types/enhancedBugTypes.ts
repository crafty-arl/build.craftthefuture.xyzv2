export interface BugCompletionStatus {
  bugId: number;
  status: 'open' | 'in-progress' | 'detected' | 'fixed' | 'verified' | 'completed';
  detectionMethods: {
    patternMatch: boolean;
    testExecution: boolean;
    codeAnalysis: boolean;
  };
  confidence: number; // 0-100
  lastDetected?: string;
  fixedAt?: string;
  verificationHistory: VerificationEntry[];
}

export interface VerificationEntry {
  timestamp: string;
  method: 'pattern-match' | 'test-execution' | 'code-analysis' | 'manual' | 'combined';
  result: boolean;
  confidence: number;
  details?: string;
}

export interface DetectionResult {
  success: boolean;
  confidence: number;
  method: string;
  details?: string;
  executionTime?: number;
  errorMessage?: string;
}

export interface TestResult {
  success: boolean;
  testName: string;
  executionTime: number;
  errorMessage?: string;
  details?: string[];
}

export interface AnalysisResult {
  isStructurallyCorrect: boolean;
  confidence: number;
  reasoning: string;
  checks: {
    hasRequiredFunctions: boolean;
    hasProperLogic: boolean;
    hasErrorHandling: boolean;
    hasOptimization: boolean;
  };
}

export interface BugContext {
  toolId: string;
  bugId: number;
  expectedPatterns: string[];
  requiredFunctions: string[];
  testCases: TestCase[];
}

export interface TestCase {
  name: string;
  input: any;
  expectedOutput: any;
  description: string;
}

export interface MLPrediction {
  isFixed: boolean;
  confidence: number;
  reasoning: string;
  features: Record<string, any>;
}

export interface PerformanceMetrics {
  method: string;
  executionTime: number;
  success: boolean;
  timestamp: number;
  confidence: number;
} 