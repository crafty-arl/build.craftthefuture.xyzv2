import { Tool, Season, ToolImport } from '../types/tool';
import * as lucideIcons from 'lucide-react';

export class ToolManager {
  private static validateTool(tool: unknown): Tool {
    if (!tool || typeof tool !== 'object') {
      throw new Error('Tool must be an object');
    }

    const toolObj = tool as Record<string, unknown>;
    const requiredFields = ['id', 'title', 'description', 'icon', 'difficulty', 'brokenCode', 'fixedCode', 'bugs'];
    
    for (const field of requiredFields) {
      if (!toolObj[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate icon exists in lucide-react
    if (typeof toolObj.icon !== 'string' || !(toolObj.icon in lucideIcons)) {
      throw new Error(`Invalid icon: ${toolObj.icon}. Must be a valid Lucide icon name.`);
    }

    // Validate bugs
    if (!Array.isArray(toolObj.bugs) || toolObj.bugs.length === 0) {
      throw new Error('Tool must have at least one bug');
    }

    toolObj.bugs.forEach((bug: unknown, index: number) => {
      if (!bug || typeof bug !== 'object') {
        throw new Error(`Bug ${index + 1} must be an object`);
      }
      const bugObj = bug as Record<string, unknown>;
      if (!bugObj.id || !bugObj.title || !bugObj.description) {
        throw new Error(`Bug ${index + 1} is missing required fields`);
      }
    });

    return tool as Tool;
  }

  static exportTools(tools: Tool[], season: Season): ToolImport {
    const exportData: ToolImport = {
      version: '1.0.0',
      season,
      tools: tools.map(tool => ({
        ...tool,
        createdAt: tool.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'siki-developer',
        version: '1.0.0'
      }
    };

    return exportData;
  }

  static importTools(jsonData: string): Tool[] {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.tools || !Array.isArray(data.tools)) {
        throw new Error('Invalid JSON format: missing tools array');
      }

      const validatedTools: Tool[] = [];
      
      for (const tool of data.tools) {
        try {
          const validatedTool = this.validateTool(tool);
          validatedTools.push(validatedTool);
        } catch (error) {
          console.error(`Error validating tool ${tool.id || 'unknown'}:`, error);
          throw error;
        }
      }

      return validatedTools;
    } catch (error) {
      throw new Error(`Failed to import tools: ${error}`);
    }
  }

  static validateJsonFile(file: File): Promise<Tool[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const tools = this.importTools(content);
          resolve(tools);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static generateSampleTool(): Tool {
    return {
      id: 'sample-tool',
      title: 'Sample Tool',
      description: 'This is a sample tool for testing',
      icon: 'Code2',
      difficulty: 'S-0',
      season: 0,
      category: 'frontend',
      tags: ['react', 'javascript'],
      estimatedTime: 15,
      brokenCode: `function SampleComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`,
      fixedCode: `import { useState } from 'react'

function SampleComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`,
      bugs: [
        {
          id: 1,
          title: 'Missing Import',
          description: 'The useState hook is not imported',
          clue: 'Check the imports at the top of the file',
          bonus: 'Add proper error handling',
          difficulty: 'easy',
          category: 'syntax',
          points: 10,
          hints: ['Look for missing imports', 'React hooks need to be imported']
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
  }
} 