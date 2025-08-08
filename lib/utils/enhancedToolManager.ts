import { BugDetectionEngine } from './bugDetectionEngine';
import { BugCompletionStatus, DetectionResult } from '../types/enhancedBugTypes';

export class EnhancedToolManager {
  private static instance: EnhancedToolManager;
  private detectionEngine: BugDetectionEngine;
  private bugCompletions: Map<string, Map<number, BugCompletionStatus>> = new Map();
  private detectionResults: Map<string, Map<number, DetectionResult>> = new Map();

  private constructor() {
    this.detectionEngine = new BugDetectionEngine();
  }

  static getInstance(): EnhancedToolManager {
    if (!EnhancedToolManager.instance) {
      EnhancedToolManager.instance = new EnhancedToolManager();
    }
    return EnhancedToolManager.instance;
  }

  // Enhanced bug detection with multiple methods
  async detectBugCompletions(toolId: string, code: string): Promise<{
    newCompletions: BugCompletionStatus[];
    detectionResults: Map<number, DetectionResult>;
    overallProgress: number;
  }> {
    const toolCompletions = this.bugCompletions.get(toolId) || new Map();
    const toolDetectionResults = this.detectionResults.get(toolId) || new Map();
    const newCompletions: BugCompletionStatus[] = [];

    // Get tool bugs (you'll need to pass this from the tool page)
    const toolBugs = await this.getToolBugs(toolId);
    
    for (const bug of toolBugs) {
      // Run enhanced detection
      const detectionResult = await this.detectionEngine.detectBugCompletion(toolId, bug.id, code);
      
      // Update detection results
      toolDetectionResults.set(bug.id, detectionResult);
      
      // Check if this is a new completion
      const existingCompletion = toolCompletions.get(bug.id);
      if (detectionResult.success && (!existingCompletion || existingCompletion.status !== 'fixed')) {
        const newCompletion: BugCompletionStatus = {
          bugId: bug.id,
          status: 'fixed',
          detectionMethods: {
            patternMatch: detectionResult.method === 'pattern-match' || detectionResult.method === 'combined',
            testExecution: detectionResult.method === 'test-execution' || detectionResult.method === 'combined',
            codeAnalysis: detectionResult.method === 'code-analysis' || detectionResult.method === 'combined'
          },
          confidence: detectionResult.confidence,
          lastDetected: new Date().toISOString(),
          fixedAt: new Date().toISOString(),
          verificationHistory: [
            {
              timestamp: new Date().toISOString(),
              method: detectionResult.method as any,
              result: detectionResult.success,
              confidence: detectionResult.confidence,
              details: detectionResult.details
            }
          ]
        };
        
        newCompletions.push(newCompletion);
        toolCompletions.set(bug.id, newCompletion);
      } else if (existingCompletion) {
        // Update existing completion with new detection result
        existingCompletion.verificationHistory.push({
          timestamp: new Date().toISOString(),
          method: detectionResult.method as any,
          result: detectionResult.success,
          confidence: detectionResult.confidence,
          details: detectionResult.details
        });
      }
    }

    // Update stored data
    this.bugCompletions.set(toolId, toolCompletions);
    this.detectionResults.set(toolId, toolDetectionResults);

    // Calculate overall progress
    const overallProgress = (toolCompletions.size / toolBugs.length) * 100;

    return {
      newCompletions,
      detectionResults: toolDetectionResults,
      overallProgress
    };
  }

  // Get bug completion status for a tool
  getBugCompletions(toolId: string): Map<number, BugCompletionStatus> {
    return this.bugCompletions.get(toolId) || new Map();
  }

  // Get detection results for a tool
  getDetectionResults(toolId: string): Map<number, DetectionResult> {
    return this.detectionResults.get(toolId) || new Map();
  }

  // Get performance metrics
  getPerformanceMetrics(): Record<string, number> {
    return this.detectionEngine.getPerformanceMetrics();
  }

  // Reset completions for a tool
  resetToolCompletions(toolId: string): void {
    this.bugCompletions.delete(toolId);
    this.detectionResults.delete(toolId);
  }

  // Get completion statistics
  getCompletionStats(toolId: string): {
    totalBugs: number;
    completedBugs: number;
    progressPercentage: number;
    averageConfidence: number;
    methodBreakdown: Record<string, number>;
  } {
    const completions = this.getBugCompletions(toolId);
    const totalBugs = completions.size;
    const completedBugs = Array.from(completions.values()).filter(c => c.status === 'fixed').length;
    
    const averageConfidence = totalBugs > 0 
      ? Array.from(completions.values()).reduce((sum, c) => sum + c.confidence, 0) / totalBugs 
      : 0;

    const methodBreakdown = {
      patternMatch: Array.from(completions.values()).filter(c => c.detectionMethods.patternMatch).length,
      testExecution: Array.from(completions.values()).filter(c => c.detectionMethods.testExecution).length,
      codeAnalysis: Array.from(completions.values()).filter(c => c.detectionMethods.codeAnalysis).length
    };

    return {
      totalBugs,
      completedBugs,
      progressPercentage: totalBugs > 0 ? (completedBugs / totalBugs) * 100 : 0,
      averageConfidence,
      methodBreakdown
    };
  }

  // Export completion data
  exportCompletionData(toolId: string): {
    toolId: string;
    completions: BugCompletionStatus[];
    detectionResults: DetectionResult[];
    stats: {
      totalBugs: number;
      completedBugs: number;
      progressPercentage: number;
      averageConfidence: number;
      methodBreakdown: Record<string, number>;
    };
    exportedAt: string;
  } {
    const completions = this.getBugCompletions(toolId);
    const detectionResults = this.getDetectionResults(toolId);
    
    return {
      toolId,
      completions: Array.from(completions.values()),
      detectionResults: Array.from(detectionResults.values()),
      stats: this.getCompletionStats(toolId),
      exportedAt: new Date().toISOString()
    };
  }

  // Import completion data
  importCompletionData(data: {
    toolId: string;
    completions: BugCompletionStatus[];
    detectionResults: DetectionResult[];
  }): void {
    const completionsMap = new Map(data.completions.map(c => [c.bugId, c]));
    const detectionResultsMap = new Map(data.detectionResults.map((d, index) => [index, d]));
    
    this.bugCompletions.set(data.toolId, completionsMap);
    this.detectionResults.set(data.toolId, detectionResultsMap);
  }

  // Get tool bugs (placeholder - you'll need to implement this based on your tool loading system)
  private async getToolBugs(toolId: string): Promise<any[]> {
    try {
      // Dynamically import the JSON files via public fetch is not available in Node here,
      // so rely on the same structure that UI uses via `public/*.json` at runtime.
      // For server-side scripts, we attempt to read from disk.
      const fs = await import('fs');
      const path = await import('path');
      const publicDir = path.join(process.cwd(), 'public');
      const files = [
        'date_calculator_tool.json',
        'product_name_generator_tool.json',
        'receipt_builder_tool.json',
        'poll_maker_tool.json',
        'bio_generator_tool.json'
      ];
      for (const file of files) {
        const filePath = path.join(publicDir, file);
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);
          if (data && data.id === toolId && Array.isArray(data.bugs)) {
            return data.bugs.map((b: any) => ({ id: b.id, title: b.title, description: b.description }));
          }
        }
      }
      return [];
    } catch {
      return [];
    }
  }
} 