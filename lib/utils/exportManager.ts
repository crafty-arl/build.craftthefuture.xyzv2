export interface ExportOptions {
  format: 'react-component' | 'nextjs-page' | 'vanilla' | 'typescript'
  includeDependencies: boolean
  includeStyles: boolean
  includeTests: boolean
  filename?: string
}

export interface ExportResult {
  success: boolean
  data?: string | Blob
  url?: string
  error?: string
}

export class ExportManager {
  /**
   * Export code as a standalone React component
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static exportAsReactComponent(code: string, componentName: string, options: ExportOptions): ExportResult {
    try {
      const cleanedCode = this.cleanCode(code)
      const componentCode = this.wrapAsReactComponent(cleanedCode, componentName)
      
      const blob = new Blob([componentCode], { type: 'text/javascript' })
      return {
        success: true,
        data: blob
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to export React component: ${error}`
      }
    }
  }

  /**
   * Export as a complete Next.js project
   */
  static async exportAsNextJSProject(code: string, componentName: string, options: ExportOptions): Promise<ExportResult> {
    try {
      const projectStructure = this.generateNextJSProject(code, componentName, options)
      const zipBlob = await this.createProjectZip(projectStructure)
      
      return {
        success: true,
        data: zipBlob
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to export Next.js project: ${error}`
      }
    }
  }

  /**
   * Export to CodeSandbox
   */
  static async exportToCodeSandbox(code: string, componentName: string, options: ExportOptions): Promise<ExportResult> {
    try {
      const sandboxData = {
        files: {
          "package.json": {
            content: this.generatePackageJson(options)
          },
          "App.js": {
            content: this.wrapAsReactComponent(this.cleanCode(code), componentName)
          },
          "index.js": {
            content: this.generateIndexJS()
          },
          "public/index.html": {
            content: this.generateIndexHTML()
          }
        }
      }

      const response = await fetch('https://codesandbox.io/api/v1/sandboxes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sandboxData)
      })

      const result = await response.json()
      
      if (result.sandbox_id) {
        return {
          success: true,
          url: `https://codesandbox.io/s/${result.sandbox_id}`
        }
      } else {
        return {
          success: false,
          error: 'Failed to create CodeSandbox'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to export to CodeSandbox: ${error}`
      }
    }
  }

  /**
   * Export to GitHub Gist
   */
  static async exportToGitHubGist(code: string, componentName: string, options: ExportOptions): Promise<ExportResult> {
    try {
      const gistData = {
        description: `${componentName} - Exported from Build Studio`,
        public: true,
        files: {
          [`${componentName}.jsx`]: {
            content: this.wrapAsReactComponent(this.cleanCode(code), componentName)
          },
          'package.json': {
            content: this.generatePackageJson(options)
          },
          'README.md': {
            content: this.generateReadme(componentName)
          }
        }
      }

      // Note: This would require GitHub API token for authenticated requests
      // For now, we'll return the gist data for manual creation
      return {
        success: true,
        data: JSON.stringify(gistData, null, 2)
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to export to GitHub Gist: ${error}`
      }
    }
  }

  /**
   * Clean and format code
   */
  private static cleanCode(code: string): string {
    return code
      .replace(/export default.*;?\s*$/, '') // Remove export default
      .replace(/import.*from.*['"].*['"];?\s*$/gm, '') // Remove imports
      .trim()
  }

  /**
   * Wrap code as a React component
   */
  private static wrapAsReactComponent(code: string, componentName: string): string {
    return `import React from 'react';

${code}

export default ${componentName};`
  }

  /**
   * Generate package.json for the exported project
   */
  private static generatePackageJson(options: ExportOptions): string {
    const dependencies = options.includeDependencies ? {
      "react": "^18.0.0",
      "react-dom": "^18.0.0"
    } : {}

    return JSON.stringify({
      name: "exported-component",
      version: "1.0.0",
      private: true,
      dependencies,
      scripts: {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
      }
    }, null, 2)
  }

  /**
   * Generate index.js for React app
   */
  private static generateIndexJS(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
  }

  /**
   * Generate index.html
   */
  private static generateIndexHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Exported component from Build Studio" />
    <title>Exported Component</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
  }

  /**
   * Generate README.md
   */
  private static generateReadme(componentName: string): string {
    return `# ${componentName}

This component was exported from Build Studio.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Component

The main component is located in \`App.js\`.

## Learn More

This project was created with Create React App.`
  }

  /**
   * Generate Next.js project structure
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static generateNextJSProject(code: string, componentName: string, options: ExportOptions): Record<string, string> {
    const cleanedCode = this.cleanCode(code)
    
    return {
      'package.json': this.generateNextJSPackageJson(),
      'next.config.js': this.generateNextConfig(),
      'pages/index.js': this.generateNextJSPage(cleanedCode, componentName),
      'pages/_app.js': this.generateNextJSApp(),
      'styles/globals.css': this.generateGlobalStyles(),
      'public/vercel.svg': this.generateVercelSVG(),
      'README.md': this.generateNextJSReadme(componentName)
    }
  }

  /**
   * Generate Next.js package.json
   */
  private static generateNextJSPackageJson(): string {
    return JSON.stringify({
      name: "exported-nextjs-project",
      version: "1.0.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      dependencies: {
        "next": "^13.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
      },
      devDependencies: {
        "eslint": "^8.0.0",
        "eslint-config-next": "^13.0.0"
      }
    }, null, 2)
  }

  /**
   * Generate Next.js config
   */
  private static generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`
  }

  /**
   * Generate Next.js page
   */
  private static generateNextJSPage(code: string, componentName: string): string {
    return `import ${componentName} from '../components/${componentName}'

export default function Home() {
  return (
    <div className="container">
      <${componentName} />
    </div>
  )
}`
  }

  /**
   * Generate Next.js _app.js
   */
  private static generateNextJSApp(): string {
    return `import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}`
  }

  /**
   * Generate global styles
   */
  private static generateGlobalStyles(): string {
    return `html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}`
  }

  /**
   * Generate Vercel SVG
   */
  private static generateVercelSVG(): string {
    return `<svg width="76" height="65" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000"/>
</svg>`
  }

  /**
   * Generate Next.js README
   */
  private static generateNextJSReadme(componentName: string): string {
    return `# ${componentName} - Next.js Project

This Next.js project was exported from Build Studio.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.`
  }

  /**
   * Create ZIP file from project structure
   */
  private static async createProjectZip(projectStructure: Record<string, string>): Promise<Blob> {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    
    // Add all files to the ZIP
    Object.entries(projectStructure).forEach(([filename, content]) => {
      zip.file(filename, content)
    })
    
    // Generate the ZIP blob
    return await zip.generateAsync({ type: 'blob' })
  }

  /**
   * Download file to user's device
   */
  static downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
    const blob = typeof content === 'string' 
      ? new Blob([content], { type: mimeType || 'text/plain' })
      : content
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
} 