import { PerformanceMetrics } from '../types/enhancedBugTypes';

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  trackDetectionPerformance(method: string, executionTime: number, success: boolean, confidence: number = 0): void {
    const metric: PerformanceMetrics = {
      method,
      executionTime,
      success,
      timestamp: Date.now(),
      confidence
    };
    
    this.metrics.push(metric);
    
    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getAverageExecutionTime(method: string): number {
    const methodMetrics = this.metrics.filter(m => m.method === method);
    if (methodMetrics.length === 0) return 0;
    
    const totalTime = methodMetrics.reduce((sum, m) => sum + m.executionTime, 0);
    return totalTime / methodMetrics.length;
  }

  getSuccessRate(method: string): number {
    const methodMetrics = this.metrics.filter(m => m.method === method);
    if (methodMetrics.length === 0) return 0;
    
    const successfulMetrics = methodMetrics.filter(m => m.success);
    return (successfulMetrics.length / methodMetrics.length) * 100;
  }

  getAverageConfidence(method: string): number {
    const methodMetrics = this.metrics.filter(m => m.method === method);
    if (methodMetrics.length === 0) return 0;
    
    const totalConfidence = methodMetrics.reduce((sum, m) => sum + m.confidence, 0);
    return totalConfidence / methodMetrics.length;
  }

  getPerformanceSummary(): Record<string, { avgTime: number; successRate: number; avgConfidence: number; totalRuns: number }> {
    const methods = [...new Set(this.metrics.map(m => m.method))];
    const summary: Record<string, { avgTime: number; successRate: number; avgConfidence: number; totalRuns: number }> = {};
    
    methods.forEach(method => {
      const methodMetrics = this.metrics.filter(m => m.method === method);
      summary[method] = {
        avgTime: this.getAverageExecutionTime(method),
        successRate: this.getSuccessRate(method),
        avgConfidence: this.getAverageConfidence(method),
        totalRuns: methodMetrics.length
      };
    });
    
    return summary;
  }

  getRecentMetrics(method: string, count: number = 10): PerformanceMetrics[] {
    const methodMetrics = this.metrics.filter(m => m.method === method);
    return methodMetrics.slice(-count);
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getMetricsCount(): number {
    return this.metrics.length;
  }

  getMethodMetrics(method: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.method === method);
  }

  getTopPerformingMethods(): string[] {
    const summary = this.getPerformanceSummary();
    return Object.entries(summary)
      .sort(([, a], [, b]) => (b.successRate + b.avgConfidence) - (a.successRate + a.avgConfidence))
      .map(([method]) => method);
  }

  getSlowestMethods(): string[] {
    const summary = this.getPerformanceSummary();
    return Object.entries(summary)
      .sort(([, a], [, b]) => b.avgTime - a.avgTime)
      .map(([method]) => method);
  }
} 