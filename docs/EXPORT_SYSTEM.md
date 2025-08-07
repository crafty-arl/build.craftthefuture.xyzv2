# Export System Documentation

## Overview

The Export System allows users to export their code from the coding sandbox in multiple formats and share it with others. This system provides a seamless way to take your work from the Build Studio and use it in other environments.

## Features

### 🚀 Export Formats

#### 1. **React Component**
- **Description**: Export as a standalone React component file
- **Format**: `.jsx` file
- **Use Case**: When you want to use the component in an existing React project
- **Includes**: Clean component code with proper imports

#### 2. **Next.js Project**
- **Description**: Export as a complete Next.js project with all necessary files
- **Format**: `.zip` file containing full project structure
- **Use Case**: When you want to create a standalone Next.js application
- **Includes**: 
  - `package.json` with dependencies
  - `next.config.js`
  - `pages/index.js` with your component
  - `pages/_app.js`
  - `styles/globals.css`
  - `README.md` with setup instructions

#### 3. **CodeSandbox**
- **Description**: Create a CodeSandbox and open it in the browser
- **Format**: Online sandbox URL
- **Use Case**: When you want to share your code online or continue development in the browser
- **Features**: 
  - Instant online development environment
  - Shareable URL
  - Real-time collaboration

#### 4. **GitHub Gist**
- **Description**: Create a GitHub Gist for sharing code snippets
- **Format**: GitHub Gist URL or JSON data
- **Use Case**: When you want to share code on GitHub or with other developers
- **Features**: 
  - Version control
  - Comments and discussions
  - Easy sharing

### 🎯 Export Options

Each export format supports the following options:

- **Include Dependencies**: Whether to include package.json with dependencies
- **Include Styles**: Whether to include CSS/styling files
- **Include Tests**: Whether to include test files (future feature)
- **Custom Filename**: Custom name for the exported file

## Usage

### Basic Export

1. **Navigate to a Tool**: Go to any tool in the Build Studio (e.g., `/tool/date-calculator`)
2. **Write Your Code**: Use the code editor to write your component
3. **Click Export**: Click the "Export" button in the bottom toolbar
4. **Choose Format**: Select your preferred export format
5. **Download/Share**: The file will be downloaded or the link will be opened

### Export Dialog

The export dialog provides a clean interface with:

- **Visual Format Selection**: Grid of export options with icons and descriptions
- **Real-time Status**: Loading indicators and success/error messages
- **Export Information**: Shows component name, code length, and tool details
- **Direct Links**: For online exports (CodeSandbox, GitHub Gist)

## Technical Implementation

### Export Manager

The `ExportManager` class handles all export operations:

```typescript
// Export as React component
const result = ExportManager.exportAsReactComponent(code, componentName, options)

// Export as Next.js project
const result = await ExportManager.exportAsNextJSProject(code, componentName, options)

// Export to CodeSandbox
const result = await ExportManager.exportToCodeSandbox(code, componentName, options)

// Export to GitHub Gist
const result = await ExportManager.exportToGitHubGist(code, componentName, options)
```

### Code Processing

The system automatically:

1. **Cleans Code**: Removes export statements and imports
2. **Wraps Component**: Adds proper React component structure
3. **Generates Dependencies**: Creates appropriate package.json files
4. **Creates Project Structure**: Generates complete project files for Next.js exports

### File Generation

#### React Component Export
```javascript
import React from 'react';

// Your component code here
function MyComponent() {
  return <div>Hello World</div>
}

export default MyComponent;
```

#### Next.js Project Structure
```
my-component-nextjs-project/
├── package.json
├── next.config.js
├── pages/
│   ├── index.js
│   └── _app.js
├── styles/
│   └── globals.css
├── public/
│   └── vercel.svg
└── README.md
```

## Integration Points

### Current Integration

The export system is integrated into:

- **Tool Pages**: Export button in the bottom toolbar
- **Code Editor**: Accessible from any coding tool
- **Component Context**: Uses the current tool's component name and title

### Future Enhancements

- [ ] **Export Templates**: Pre-defined export templates for different frameworks
- [ ] **Custom Export Formats**: Support for Vue, Angular, Svelte
- [ ] **Export History**: Track and manage previous exports
- [ ] **Batch Export**: Export multiple components at once
- [ ] **Export Analytics**: Track which formats are most popular
- [ ] **Custom Styling**: Include Tailwind CSS or other styling frameworks
- [ ] **TypeScript Support**: Convert JavaScript to TypeScript
- [ ] **Testing Files**: Include Jest/React Testing Library setup

## API Reference

### ExportOptions Interface

```typescript
interface ExportOptions {
  format: 'react-component' | 'nextjs-page' | 'vanilla' | 'typescript'
  includeDependencies: boolean
  includeStyles: boolean
  includeTests: boolean
  filename?: string
}
```

### ExportResult Interface

```typescript
interface ExportResult {
  success: boolean
  data?: string | Blob
  url?: string
  error?: string
}
```

### ExportManager Methods

#### `exportAsReactComponent(code, componentName, options)`
Exports code as a standalone React component.

#### `exportAsNextJSProject(code, componentName, options)`
Exports code as a complete Next.js project.

#### `exportToCodeSandbox(code, componentName, options)`
Creates a CodeSandbox and returns the URL.

#### `exportToGitHubGist(code, componentName, options)`
Creates a GitHub Gist and returns the data.

#### `downloadFile(content, filename, mimeType)`
Downloads a file to the user's device.

## Error Handling

The export system includes comprehensive error handling:

- **Network Errors**: Handles failed API calls to CodeSandbox/GitHub
- **Code Processing Errors**: Handles malformed code gracefully
- **File Generation Errors**: Handles ZIP creation and file generation issues
- **User Feedback**: Clear error messages and success confirmations

## Security Considerations

- **Code Sanitization**: All exported code is cleaned and sanitized
- **No Sensitive Data**: Export system doesn't include user credentials or sensitive information
- **Safe Downloads**: All downloads use safe blob URLs
- **External Links**: External links open in new tabs with proper security attributes

## Performance

- **Lazy Loading**: JSZip is loaded only when needed
- **Async Operations**: All export operations are asynchronous
- **Progress Indicators**: Loading states for long-running operations
- **Memory Management**: Proper cleanup of blob URLs and temporary data

## Browser Support

The export system supports all modern browsers:

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Troubleshooting

### Common Issues

1. **Export Fails**: Check if the code is valid JavaScript/JSX
2. **CodeSandbox Not Loading**: Check internet connection and CodeSandbox status
3. **ZIP File Corrupted**: Try downloading again or use a different browser
4. **GitHub Gist Not Created**: Requires GitHub API integration (future feature)

### Debug Mode

Enable debug mode to see detailed export information:

```javascript
// In browser console
localStorage.setItem('export-debug', 'true')
```

## Contributing

To add new export formats:

1. Add the format to the `ExportOptions` interface
2. Implement the export method in `ExportManager`
3. Add the option to the export dialog
4. Update this documentation

## Examples

### Exporting a Date Calculator

```javascript
// User writes this code in the sandbox
function DateCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [result, setResult] = useState('')

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      setResult('Please select both dates')
      return
    }
    
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setResult(`${diffDays} days`)
  }

  return (
    <div>
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
      />
      <input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
      />
      <button onClick={calculateDifference}>Calculate</button>
      {result && <p>{result}</p>}
    </div>
  )
}
```

This code can be exported as:
- **React Component**: `DateCalculator.jsx`
- **Next.js Project**: `date-calculator-nextjs-project.zip`
- **CodeSandbox**: Online sandbox URL
- **GitHub Gist**: Shareable gist URL

## Support

For issues with the export system:

1. Check the browser console for error messages
2. Verify your code is valid JavaScript/JSX
3. Try a different export format
4. Contact support with the error details

---

*Last updated: December 2024* 