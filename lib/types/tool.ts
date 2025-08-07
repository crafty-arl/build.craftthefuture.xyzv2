export interface Bug {
  id: number;
  title: string;
  description: string;
  clue: string;
  bonus: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'logic' | 'syntax' | 'performance' | 'security' | 'ui';
  points: number;
  hints: string[];
  solution?: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: string; // Lucide icon name
  difficulty: string; // e.g., "S-0", "S-1", "S-2"
  season: number;
  category: 'frontend' | 'backend' | 'fullstack' | 'algorithm' | 'debugging' | 'optimization';
  tags: string[];
  estimatedTime: number; // in minutes
  brokenCode: string;
  fixedCode: string;
  bugs: Bug[];
  requirements?: string[];
  learningObjectives?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata?: {
    author?: string;
    version?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    techStack?: string[];
    frameworks?: string[];
  };
}

export interface Season {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  tools: Tool[];
}

export interface ToolImport {
  version: string;
  season: Season;
  tools: Tool[];
  metadata: {
    exportedAt: string;
    exportedBy: string;
    version: string;
  };
} 