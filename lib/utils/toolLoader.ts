
import { Calendar, FileText, List, BarChart, Code2, User } from 'lucide-react'

export interface HomepageTool {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  difficulty: string
  bugs: Array<{
    id: number
    title: string
    description: string
    clue: string
    bonus: string
    solution?: string
  }>
  brokenCode: string
  fixedCode: string
}

export async function loadToolsFromJson(): Promise<HomepageTool[]> {
  try {
    const tools: HomepageTool[] = []
    console.log('Starting to load tools from JSON files...')

    // Helper function to get icon component safely
    const getIconComponent = (iconName: string, fallback: React.ComponentType<{ className?: string }>) => {
      const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
        'Calendar': Calendar,
        'FileText': FileText,
        'List': List,
        'BarChart': BarChart,
        'Code2': Code2
      }
      
      return iconMap[iconName] || fallback
    }

    // Load the date calculator tool from its separate file
    try {
      const dateCalculatorResponse = await fetch('/date_calculator_tool.json')
      if (dateCalculatorResponse.ok) {
        const dateCalculatorTool = await dateCalculatorResponse.json()
        
        // Convert the date calculator tool to homepage format
        const dateCalculatorIcon = getIconComponent(dateCalculatorTool.icon, Calendar)
        
        const dateCalculatorHomepageTool: HomepageTool = {
          id: dateCalculatorTool.id,
          title: dateCalculatorTool.title,
          description: dateCalculatorTool.description,
          icon: dateCalculatorIcon,
          difficulty: dateCalculatorTool.difficulty,
          bugs: dateCalculatorTool.bugs.map((bug: { id: number; title: string; description: string; clue: string; bonus: string; solution?: string }) => ({
            id: bug.id,
            title: bug.title,
            description: bug.description,
            clue: bug.clue,
            bonus: bug.bonus,
            solution: bug.solution
          })),
          brokenCode: dateCalculatorTool.brokenCode,
          fixedCode: dateCalculatorTool.fixedCode
        }

        tools.push(dateCalculatorHomepageTool)
        console.log('Successfully loaded date calculator tool:', dateCalculatorTool.id)
      }
    } catch (error) {
      console.warn('Failed to load date calculator tool:', error)
    }

    // Load the product name generator tool from its separate file
    try {
      const productNameGeneratorResponse = await fetch('/product_name_generator_tool.json')
      if (productNameGeneratorResponse.ok) {
        const productNameGeneratorTool = await productNameGeneratorResponse.json()
        
        // Convert the product name generator tool to homepage format
        const productNameGeneratorIcon = getIconComponent(productNameGeneratorTool.icon, FileText)
        
        const productNameGeneratorHomepageTool: HomepageTool = {
          id: productNameGeneratorTool.id,
          title: productNameGeneratorTool.title,
          description: productNameGeneratorTool.description,
          icon: productNameGeneratorIcon,
          difficulty: productNameGeneratorTool.difficulty,
          bugs: productNameGeneratorTool.bugs.map((bug: { id: number; title: string; description: string; clue: string; bonus: string; solution?: string }) => ({
            id: bug.id,
            title: bug.title,
            description: bug.description,
            clue: bug.clue,
            bonus: bug.bonus,
            solution: bug.solution
          })),
          brokenCode: productNameGeneratorTool.brokenCode,
          fixedCode: productNameGeneratorTool.fixedCode
        }

        tools.push(productNameGeneratorHomepageTool)
        console.log('Successfully loaded product name generator tool:', productNameGeneratorTool.id)
      }
    } catch (error) {
      console.warn('Failed to load product name generator tool:', error)
    }

    // Load the receipt builder tool from its separate file
    try {
      const receiptBuilderResponse = await fetch('/receipt_builder_tool.json')
      if (receiptBuilderResponse.ok) {
        const receiptBuilderTool = await receiptBuilderResponse.json()
        
        // Convert the receipt builder tool to homepage format
        const receiptBuilderIcon = getIconComponent(receiptBuilderTool.icon, List)
        
        const receiptBuilderHomepageTool: HomepageTool = {
          id: receiptBuilderTool.id,
          title: receiptBuilderTool.title,
          description: receiptBuilderTool.description,
          icon: receiptBuilderIcon,
          difficulty: receiptBuilderTool.difficulty,
          bugs: receiptBuilderTool.bugs.map((bug: { id: number; title: string; description: string; clue: string; bonus: string; solution?: string }) => ({
            id: bug.id,
            title: bug.title,
            description: bug.description,
            clue: bug.clue,
            bonus: bug.bonus,
            solution: bug.solution
          })),
          brokenCode: receiptBuilderTool.brokenCode,
          fixedCode: receiptBuilderTool.fixedCode
        }

        tools.push(receiptBuilderHomepageTool)
        console.log('Successfully loaded receipt builder tool:', receiptBuilderTool.id)
      }
    } catch (error) {
      console.warn('Failed to load receipt builder tool:', error)
    }

    // Load the poll maker tool from its separate file
    try {
      const pollMakerResponse = await fetch('/poll_maker_tool.json')
      if (pollMakerResponse.ok) {
        const pollMakerTool = await pollMakerResponse.json()
        
        // Convert the poll maker tool to homepage format
        const pollMakerIcon = getIconComponent(pollMakerTool.icon, BarChart)
        
        const pollMakerHomepageTool: HomepageTool = {
          id: pollMakerTool.id,
          title: pollMakerTool.title,
          description: pollMakerTool.description,
          icon: pollMakerIcon,
          difficulty: pollMakerTool.difficulty,
          bugs: pollMakerTool.bugs.map((bug: { id: number; title: string; description: string; clue: string; bonus: string; solution?: string }) => ({
            id: bug.id,
            title: bug.title,
            description: bug.description,
            clue: bug.clue,
            bonus: bug.bonus,
            solution: bug.solution
          })),
          brokenCode: pollMakerTool.brokenCode,
          fixedCode: pollMakerTool.fixedCode
        }

        tools.push(pollMakerHomepageTool)
        console.log('Successfully loaded poll maker tool:', pollMakerTool.id)
      }
    } catch (error) {
      console.warn('Failed to load poll maker tool:', error)
    }

    // Load the bio generator tool from its separate file
    try {
      const bioGeneratorResponse = await fetch('/bio_generator_tool.json')
      if (bioGeneratorResponse.ok) {
        const bioGeneratorTool = await bioGeneratorResponse.json()
        
        // Convert the bio generator tool to homepage format
        const bioGeneratorIcon = getIconComponent(bioGeneratorTool.icon, User)
        
        const bioGeneratorHomepageTool: HomepageTool = {
          id: bioGeneratorTool.id,
          title: bioGeneratorTool.title,
          description: bioGeneratorTool.description,
          icon: bioGeneratorIcon,
          difficulty: bioGeneratorTool.difficulty,
          bugs: bioGeneratorTool.bugs.map((bug: { id: number; title: string; description: string; clue: string; bonus: string; solution?: string }) => ({
            id: bug.id,
            title: bug.title,
            description: bug.description,
            clue: bug.clue,
            bonus: bug.bonus,
            solution: bug.solution
          })),
          brokenCode: bioGeneratorTool.brokenCode,
          fixedCode: bioGeneratorTool.fixedCode
        }

        tools.push(bioGeneratorHomepageTool)
        console.log('Successfully loaded bio generator tool:', bioGeneratorTool.id)
      }
    } catch (error) {
      console.warn('Failed to load bio generator tool:', error)
    }

    console.log('Final loaded tools:', tools.map(t => ({ id: t.id, title: t.title })))
    return tools
  } catch (error) {
    console.error('Error loading tools from JSON:', error)
    // Return empty array if loading fails
    return []
  }
}

// Fallback tools in case JSON loading fails
export const fallbackTools: HomepageTool[] = [] 