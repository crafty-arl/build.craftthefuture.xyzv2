import { AnalysisResult } from '../types/enhancedBugTypes';

export class CodeAnalyzer {
  analyzeCodeStructure(toolId: string, bugId: number, code: string): AnalysisResult {
    const checks = {
      hasRequiredFunctions: this.checkRequiredFunctions(toolId, bugId, code),
      hasProperLogic: this.checkLogicFlow(toolId, bugId, code),
      hasErrorHandling: this.checkErrorHandling(toolId, bugId, code),
      hasOptimization: this.checkOptimization(toolId, bugId, code)
    };
    
    const isStructurallyCorrect = Object.values(checks).every(Boolean);
    const confidence = this.calculateStructuralConfidence(checks);
    const reasoning = this.generateReasoning(checks);
    
    return {
      isStructurallyCorrect,
      confidence,
      reasoning,
      checks
    };
  }

  private checkRequiredFunctions(toolId: string, bugId: number, code: string): boolean {
    const requiredFunctions = this.getRequiredFunctions(toolId, bugId);
    return requiredFunctions.every(func => code.includes(func));
  }

  private checkLogicFlow(toolId: string, bugId: number, code: string): boolean {
    const logicPatterns = this.getLogicPatterns(toolId, bugId);
    return logicPatterns.every(pattern => code.includes(pattern));
  }

  private checkErrorHandling(toolId: string, bugId: number, code: string): boolean {
    const errorHandlingPatterns = this.getErrorHandlingPatterns(toolId, bugId);
    return errorHandlingPatterns.every(pattern => code.includes(pattern));
  }

  private checkOptimization(toolId: string, bugId: number, code: string): boolean {
    const optimizationPatterns = this.getOptimizationPatterns(toolId, bugId);
    return optimizationPatterns.every(pattern => code.includes(pattern));
  }

  private calculateStructuralConfidence(checks: { [key: string]: boolean }): number {
    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    return (passedChecks / totalChecks) * 100;
  }

  private generateReasoning(checks: { [key: string]: boolean }): string {
    const passedChecks = Object.entries(checks)
      .filter(([, passed]) => passed)
      .map(([check]) => check.replace(/([A-Z])/g, ' $1').toLowerCase());
    
    const failedChecks = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check.replace(/([A-Z])/g, ' $1').toLowerCase());
    
    let reasoning = '';
    
    if (passedChecks.length > 0) {
      reasoning += `Passed: ${passedChecks.join(', ')}. `;
    }
    
    if (failedChecks.length > 0) {
      reasoning += `Failed: ${failedChecks.join(', ')}. `;
    }
    
    return reasoning || 'No structural analysis available';
  }

  private getRequiredFunctions(toolId: string, bugId: number): string[] {
    const functions: Record<string, Record<number, string[]>> = {
      'date-calculator': {
        1: ['if (!', 'return'],
        2: ['Math.abs', 'Math.ceil']
      },
      'product-name-generator': {
        1: ['.map(', 'suffixes']
      },
      'receipt-builder': {
        1: ['onSubmit', 'preventDefault'],
        2: ['parseFloat', 'Number(']
      },
      'poll-maker': {
        1: ['setVotes', 'prev =>'],
        2: ['onClick', 'handleVote']
      },
      'bio-generator': {
        1: ['Math.random', 'Math.floor'],
        2: ['Morgan', 'Riley', 'Quinn']
      }
    };
    
    return functions[toolId]?.[bugId] || [];
  }

  private getLogicPatterns(toolId: string, bugId: number): string[] {
    const patterns: Record<string, Record<number, string[]>> = {
      'date-calculator': {
        1: ['if (!startDate', 'if (!endDate', 'Select both dates'],
        2: ['Math.abs(endDate - startDate)', 'Math.ceil(diffTime']
      },
      'product-name-generator': {
        1: ['suffixes.map', 'newNames.push']
      },
      'receipt-builder': {
        1: ['event.preventDefault()', 'handleSubmit'],
        2: ['parseFloat(item.price)', 'parseInt(item.qty)']
      },
      'poll-maker': {
        1: ['setVotes(prev =>', 'prev[option] + 1'],
        2: ['onClick={handleVote}', 'handleVote(option)']
      },
      'bio-generator': {
        1: ['Math.floor(Math.random()', 'Math.random() * names.length'],
        2: ['Morgan', 'Riley', 'Quinn', 'Doctor', 'Writer']
      }
    };
    
    return patterns[toolId]?.[bugId] || [];
  }

  private getErrorHandlingPatterns(toolId: string, bugId: number): string[] {
    const patterns: Record<string, Record<number, string[]>> = {
      'date-calculator': {
        1: ['if (!startDate || !endDate)', 'return'],
        2: ['Math.abs', 'Math.ceil']
      },
      'product-name-generator': {
        1: ['.map(', 'suffixes']
      },
      'receipt-builder': {
        1: ['preventDefault', 'onSubmit'],
        2: ['parseFloat', 'Number(']
      },
      'poll-maker': {
        1: ['setVotes', 'prev =>'],
        2: ['onClick', 'handleVote']
      },
      'bio-generator': {
        1: ['Math.random', 'Math.floor'],
        2: ['Morgan', 'Riley', 'Quinn']
      }
    };
    
    return patterns[toolId]?.[bugId] || [];
  }

  private getOptimizationPatterns(toolId: string, bugId: number): string[] {
    const patterns: Record<string, Record<number, string[]>> = {
      'date-calculator': {
        1: ['if (!', 'return'],
        2: ['Math.abs', 'Math.ceil']
      },
      'product-name-generator': {
        1: ['.map(', 'suffixes']
      },
      'receipt-builder': {
        1: ['preventDefault', 'onSubmit'],
        2: ['parseFloat', 'Number(']
      },
      'poll-maker': {
        1: ['setVotes', 'prev =>'],
        2: ['onClick', 'handleVote']
      },
      'bio-generator': {
        1: ['Math.random', 'Math.floor'],
        2: ['Morgan', 'Riley', 'Quinn']
      }
    };
    
    return patterns[toolId]?.[bugId] || [];
  }
} 