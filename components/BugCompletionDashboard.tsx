import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Bug, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { BugCompletionStatus, DetectionResult } from '@/lib/types/enhancedBugTypes';

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'verified':
      return 'bg-green-900/20 text-green-400 border-green-900';
    case 'fixed':
      return 'bg-blue-900/20 text-blue-400 border-blue-900';
    case 'detected':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-900';
    case 'in-progress':
      return 'bg-purple-900/20 text-purple-400 border-purple-900';
    default:
      return 'bg-red-900/20 text-red-400 border-red-900';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'verified':
      return <CheckCircle className="w-4 h-4" />;
    case 'fixed':
      return <Zap className="w-4 h-4" />;
    case 'detected':
      return <AlertCircle className="w-4 h-4" />;
    case 'in-progress':
      return <Clock className="w-4 h-4" />;
    default:
      return <Bug className="w-4 h-4" />;
  }
};

interface BugCompletionDashboardProps {
  bugs: Array<{id: number, title: string, description: string, clue: string, bonus: string, solution?: string}>;
  completions: Map<number, BugCompletionStatus>;
  detectionResults?: Map<number, DetectionResult>;
}

export function BugCompletionDashboard({ 
  bugs, 
  completions, 
  detectionResults 
}: BugCompletionDashboardProps) {
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const getMethodCompletion = (method: string): number => {
    const methodCompletions = Array.from(completions.values())
      .filter(status => status.detectionMethods[method as keyof typeof status.detectionMethods]);
    return (methodCompletions.length / bugs.length) * 100;
  };

  const getAverageConfidence = (): number => {
    if (completions.size === 0) return 0;
    const totalConfidence = Array.from(completions.values())
      .reduce((sum, status) => sum + status.confidence, 0);
    return totalConfidence / completions.size;
  };


  return (
    <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          Bug Completion Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-400">
                {completions.size}/{bugs.length} bugs completed
              </span>
            </div>
            <Progress 
              value={(completions.size / bugs.length) * 100} 
              className="h-3 bg-[#2A2A2A]"
            />
          </div>

          {/* Method Performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CompletionMetric 
              title="Pattern Match" 
              value={getMethodCompletion('patternMatch')} 
              color="blue" 
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <CompletionMetric 
              title="Test Execution" 
              value={getMethodCompletion('testExecution')} 
              color="green" 
              icon={<Zap className="w-4 h-4" />}
            />
            <CompletionMetric 
              title="Code Analysis" 
              value={getMethodCompletion('codeAnalysis')} 
              color="purple" 
              icon={<AlertCircle className="w-4 h-4" />}
            />
            <CompletionMetric 
              title="Avg Confidence" 
              value={getAverageConfidence()} 
              color="yellow" 
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
          
          {/* Detailed Bug Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Bug Status Details</h3>
            {bugs.map(bug => {
              const completion = completions.get(bug.id);
              const detectionResult = detectionResults?.get(bug.id);
              
              return (
                <BugStatusCard 
                  key={bug.id} 
                  bug={bug} 
                  completion={completion}
                  detectionResult={detectionResult}
                  showDetails={showDetails === bug.id}
                  onToggleDetails={() => setShowDetails(showDetails === bug.id ? null : bug.id)}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CompletionMetricProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function CompletionMetric({ title, value, color, icon }: CompletionMetricProps) {
  return (
    <div className="text-center p-4 bg-[#2A2A2A] rounded-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-2xl font-bold" style={{ color: `var(--${color}-500)` }}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="text-xs text-gray-400">{title}</div>
    </div>
  );
}

interface BugStatusCardProps {
  bug: {id: number, title: string, description: string, clue: string, bonus: string, solution?: string};
  completion?: BugCompletionStatus;
  detectionResult?: DetectionResult;
  showDetails: boolean;
  onToggleDetails: () => void;
}

function BugStatusCard({ 
  bug, 
  completion, 
  detectionResult, 
  showDetails, 
  onToggleDetails 
}: BugStatusCardProps) {
  const status = completion?.status || 'open';
  const confidence = completion?.confidence || 0;
  
  return (
    <div className={`border border-[#2A2A2A] rounded-lg p-4 ${
      completion ? 'border-[#7EE787] bg-[#1A2A1A]' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <div>
            <h4 className="font-semibold text-lg">{bug.title}</h4>
            <p className="text-sm text-gray-400">{bug.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
          {completion && (
            <Badge variant="outline" className="text-xs">
              {confidence.toFixed(0)}% confidence
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDetails}
            className="text-gray-400 hover:text-white"
          >
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] space-y-3">
          {/* Detection Methods */}
          {completion && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-300">Detection Methods:</h5>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(completion.detectionMethods).map(([method, detected]) => (
                  <div key={method} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${detected ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-xs capitalize">{method.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Detection Result */}
          {detectionResult && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-300">Latest Detection:</h5>
              <div className="text-xs space-y-1">
                <div>Method: {detectionResult.method}</div>
                <div>Success: {detectionResult.success ? 'Yes' : 'No'}</div>
                <div>Confidence: {detectionResult.confidence.toFixed(1)}%</div>
                {detectionResult.details && (
                  <div>Details: {detectionResult.details}</div>
                )}
                {detectionResult.executionTime && (
                  <div>Execution Time: {detectionResult.executionTime}ms</div>
                )}
              </div>
            </div>
          )}
          
          {/* Verification History */}
          {completion?.verificationHistory && completion.verificationHistory.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-300">Verification History:</h5>
              <div className="space-y-1">
                {completion.verificationHistory.slice(-3).map((entry, index) => (
                  <div key={index} className="text-xs flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${entry.result ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{entry.method}</span>
                    <span className="text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 