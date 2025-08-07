# JSON Integration System for Season 0

## Overview

The JSON integration system allows you to easily upload and manage tools for your Season 0 platform. This system provides a scalable way to add new debugging challenges without manually coding each one.

## Features

- ✅ **Drag & Drop Import**: Upload JSON files directly via the admin interface
- ✅ **Validation**: Automatic validation of tool structure and required fields
- ✅ **Preview**: See imported tools before committing them
- ✅ **Export**: Download current tools as JSON for backup or sharing
- ✅ **Sample Templates**: Download sample JSON files to understand the format
- ✅ **Error Handling**: Clear error messages for invalid files
- ✅ **Type Safety**: Full TypeScript support with proper interfaces

## Quick Start

### 1. Access Admin Panel

Navigate to `/admin` in your application to access the admin dashboard.

### 2. Import Tools

1. Click on the "Import Tools" tab
2. Drag and drop a JSON file or click "Choose File"
3. Review the preview of imported tools
4. Click "Import All" to add them to your platform

### 3. Download Sample Template

Click "Download Sample Template" to get a properly formatted JSON file as a reference.

## JSON Structure

### Required Fields

Each tool must include these required fields:

```json
{
  "id": "unique-tool-id",
  "title": "Tool Title",
  "description": "Brief description",
  "icon": "LucideIconName",
  "difficulty": "S-0",
  "season": 0,
  "category": "frontend",
  "tags": ["javascript", "react"],
  "estimatedTime": 15,
  "brokenCode": "// Your broken code here",
  "fixedCode": "// Your fixed code here",
  "bugs": [
    {
      "id": 1,
      "title": "Bug Title",
      "description": "Bug description",
      "clue": "Hint for developers",
      "bonus": "Bonus challenge",
      "difficulty": "easy",
      "category": "logic",
      "points": 10,
      "hints": ["Hint 1", "Hint 2"]
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### Optional Fields

```json
{
  "longDescription": "Detailed description",
  "requirements": ["Requirement 1", "Requirement 2"],
  "learningObjectives": ["Objective 1", "Objective 2"],
  "metadata": {
    "author": "Your Name",
    "version": "1.0.0",
    "difficulty": "beginner",
    "techStack": ["React", "JavaScript"],
    "frameworks": ["React"]
  }
}
```

## Icon Names

Use valid Lucide React icon names. Common icons include:

- `Calendar`
- `Code2`
- `CheckSquare`
- `Calculator`
- `Database`
- `Globe`
- `Settings`
- `Zap`
- `Bug`
- `AlertCircle`

## Categories

Available categories for tools:

- `frontend`
- `backend`
- `fullstack`
- `algorithm`
- `debugging`
- `optimization`

## Bug Categories

Available categories for bugs:

- `logic`
- `syntax`
- `performance`
- `security`
- `ui`

## Difficulty Levels

- `easy`
- `medium`
- `hard`

## Validation Rules

The system validates:

1. **Required Fields**: All required fields must be present
2. **Icon Names**: Must be valid Lucide React icon names
3. **Bug Structure**: Each bug must have required fields
4. **JSON Format**: Must be valid JSON
5. **Code Format**: Broken and fixed code must be strings

## Error Messages

Common error messages and solutions:

- `Missing required field: [field]` - Add the missing field
- `Invalid icon: [icon]` - Use a valid Lucide icon name
- `Tool must have at least one bug` - Add at least one bug
- `Invalid JSON format` - Check JSON syntax

## Best Practices

### 1. Tool Design

- **Clear Objectives**: Each tool should have a clear learning objective
- **Progressive Difficulty**: Start simple and build complexity
- **Real-world Scenarios**: Use realistic bugs developers encounter
- **Multiple Bugs**: Include 2-3 bugs per tool for variety

### 2. Bug Design

- **Specific Issues**: Focus on one specific problem per bug
- **Clear Clues**: Provide helpful but not obvious hints
- **Progressive Hints**: Start vague, get more specific
- **Bonus Challenges**: Add extra learning opportunities

### 3. Code Quality

- **Readable Code**: Use clear variable names and comments
- **Consistent Formatting**: Follow consistent code style
- **Realistic Scenarios**: Use realistic code patterns
- **Educational Value**: Each bug should teach something specific

## Example Workflow

### 1. Create a New Tool

```json
{
  "id": "counter-app",
  "title": "Counter App",
  "description": "A simple counter with state management bugs",
  "icon": "Calculator",
  "difficulty": "S-0",
  "season": 0,
  "category": "frontend",
  "tags": ["react", "state"],
  "estimatedTime": 10,
  "brokenCode": "function Counter() {\n  const [count, setCount] = useState(0)\n  \n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count++)}>Increment</button>\n    </div>\n  )\n}",
  "fixedCode": "import { useState } from 'react'\n\nfunction Counter() {\n  const [count, setCount] = useState(0)\n  \n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  )\n}",
  "bugs": [
    {
      "id": 1,
      "title": "Increment Not Working",
      "description": "The increment button doesn't work properly",
      "clue": "Check the onClick handler syntax",
      "bonus": "Add a decrement button",
      "difficulty": "easy",
      "category": "syntax",
      "points": 10,
      "hints": ["Look at the setCount call", "What's wrong with count++?"]
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### 2. Save as JSON File

Save your tool as `counter-app.json`

### 3. Import via Admin Panel

1. Go to `/admin`
2. Click "Import Tools"
3. Upload your JSON file
4. Review and import

## Troubleshooting

### Common Issues

1. **Icon Not Showing**: Ensure you're using a valid Lucide icon name
2. **Validation Errors**: Check that all required fields are present
3. **Code Not Rendering**: Ensure code is properly escaped in JSON
4. **Import Fails**: Check JSON syntax with a JSON validator

### Getting Help

- Check the sample template in `/public/sample-tools.json`
- Use the admin panel's validation feedback
- Review the TypeScript interfaces in `/lib/types/tool.ts`

## Advanced Features

### Bulk Import

You can import multiple tools at once by including them in a single JSON file:

```json
{
  "tools": [
    { /* Tool 1 */ },
    { /* Tool 2 */ },
    { /* Tool 3 */ }
  ]
}
```

### Export Current Tools

Use the "Export Current Tools" button to download all currently imported tools as a JSON file.

### Version Control

The system includes version tracking in the metadata to help manage tool updates.

## Future Enhancements

- [ ] Tool editing interface
- [ ] Bulk tool management
- [ ] Tool versioning
- [ ] Advanced search and filtering
- [ ] Tool analytics and usage stats
- [ ] Collaborative tool creation
- [ ] Tool templates and wizards 