# 🏖️ Sandbox System Documentation

## Overview

The Sandbox System provides a free-form coding environment where users can write, test, and export React components without being tied to specific debugging challenges. This standalone coding playground offers a complete development experience with templates, save/load functionality, and full export capabilities.

## Features

### 🚀 Core Features

#### **Free-Form Coding**
- **Unrestricted Environment**: Write any React component without constraints
- **Real-time Preview**: See your code changes instantly in the live preview
- **Split View**: Code editor and preview side by side
- **Full React Support**: Access to all React hooks and features

#### **Template System**
- **Pre-built Templates**: Start with working examples
- **Multiple Categories**: React, Next.js, Vanilla, TypeScript
- **Easy Selection**: Visual template picker with descriptions
- **Customizable**: Modify templates to fit your needs

#### **Save & Load System**
- **Local Storage**: Save sandboxes to your browser
- **Persistent Storage**: Sandboxes survive browser restarts
- **Multiple Saves**: Create multiple versions of your work
- **Quick Access**: Load saved sandboxes instantly

#### **Export Integration**
- **All Export Formats**: Access to the complete export system
- **Component Export**: Export as standalone React components
- **Project Export**: Create complete Next.js projects
- **Online Sharing**: CodeSandbox and GitHub Gist integration

### 📦 Available Templates

#### **React Counter**
- **Description**: Simple counter component with useState
- **Features**: Increment/decrement buttons, state management
- **Learning**: Basic React hooks and event handling

#### **Todo App**
- **Description**: Full-featured todo list application
- **Features**: Add, toggle, delete todos, form handling
- **Learning**: Complex state management, array operations

#### **Contact Form**
- **Description**: Form with validation and submission
- **Features**: Input validation, error handling, success states
- **Learning**: Form handling, validation patterns, user feedback

#### **API Fetch**
- **Description**: Component that fetches and displays data
- **Features**: API integration, loading states, error handling
- **Learning**: useEffect, async/await, API consumption

## Usage

### Getting Started

1. **Navigate to Sandbox**: Click "Sandbox" in the header or go to `/sandbox`
2. **Choose Template**: Select a template to start with
3. **Write Code**: Modify the code in the editor
4. **See Results**: View live preview on the right
5. **Save Work**: Save your sandbox for later
6. **Export**: Export your component in any format

### Template Selection

1. **Click Templates**: Click the "Templates" button
2. **Browse Options**: View available templates with descriptions
3. **Select Template**: Click on a template to load it
4. **Start Coding**: Modify the template code as needed

### Save System

#### Saving a Sandbox
1. **Write Your Code**: Create your component
2. **Click Save**: Click the "Save" button
3. **Enter Name**: Provide a name for your sandbox
4. **Confirm**: Your sandbox is saved locally

#### Loading a Sandbox
1. **Click Saved**: Click "Saved (X)" button
2. **Select Sandbox**: Choose from your saved sandboxes
3. **Load**: Click "Load" to restore the sandbox
4. **Continue Coding**: Pick up where you left off

#### Managing Saves
- **Delete**: Remove unwanted saves
- **Multiple Versions**: Keep different versions of your work
- **Local Storage**: All saves are stored in your browser

### Export Options

The sandbox integrates with the full export system:

- **React Component**: Export as `.jsx` file
- **Next.js Project**: Export as complete project `.zip`
- **CodeSandbox**: Create online sandbox
- **GitHub Gist**: Share via GitHub

## Technical Implementation

### Architecture

```
Sandbox System
├── SandboxPage (app/sandbox/page.tsx)
│   ├── Template Management
│   ├── Save/Load System
│   ├── Code Editor (Sandpack)
│   └── Live Preview
├── Template System
│   ├── Default Templates
│   ├── Template Categories
│   └── Template Selection
├── Save System
│   ├── Local Storage
│   ├── Save Management
│   └── Load Functionality
└── Export Integration
    └── ExportDialog Integration
```

### State Management

```typescript
interface SandboxState {
  currentCode: string
  selectedTemplate: SandboxTemplate
  savedSandboxes: SavedSandbox[]
  componentName: string
  sandboxKey: number // For forcing re-renders
}
```

### Template System

```typescript
interface SandboxTemplate {
  id: string
  name: string
  description: string
  code: string
  category: 'react' | 'nextjs' | 'vanilla' | 'typescript'
}
```

### Save System

```typescript
interface SavedSandbox {
  id: string
  name: string
  code: string
  timestamp: string
}
```

## Template Examples

### React Counter Template

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Counter: {count}</h1>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginRight: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Decrement
      </button>
    </div>
  );
}

export default Counter;
```

### Todo App Template

```javascript
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px' }}>
      <h1>Todo App</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

## User Interface

### Layout

- **Header**: Navigation and user controls
- **Split View**: Code editor (left) and preview (right)
- **Bottom Dock**: Action buttons and controls
- **Dialogs**: Template selection and save management

### Controls

#### **Code Controls**
- **Run**: Force re-render of the component
- **Reset**: Reset to template code
- **Clear**: Clear all code
- **Templates**: Choose from available templates

#### **Save Controls**
- **Save**: Save current sandbox
- **Saved (X)**: View and manage saved sandboxes
- **Load**: Load a saved sandbox
- **Delete**: Remove saved sandboxes

#### **Export Controls**
- **Export**: Access full export system
- **Multiple Formats**: All export options available

## Integration Points

### Current Integration

- **Main Navigation**: Link in header navigation
- **Export System**: Full integration with export functionality
- **Tool System**: Separate from debugging tools
- **User System**: Same user authentication

### Future Enhancements

- [ ] **Template Marketplace**: User-created templates
- [ ] **Collaboration**: Real-time collaboration features
- [ ] **Version Control**: Git integration
- [ ] **Advanced Templates**: More complex examples
- [ ] **Custom Categories**: User-defined template categories
- [ ] **Template Sharing**: Share templates with others
- [ ] **Import System**: Import code from external sources
- [ ] **Advanced Styling**: CSS-in-JS and styling frameworks

## Best Practices

### Code Organization

1. **Component Structure**: Use clear component names
2. **State Management**: Organize state logically
3. **Styling**: Use consistent styling patterns
4. **Comments**: Add comments for complex logic

### Template Usage

1. **Start Simple**: Begin with basic templates
2. **Modify Gradually**: Make small changes and test
3. **Save Often**: Save your work regularly
4. **Export Early**: Export working versions

### Performance

1. **Avoid Infinite Loops**: Be careful with useEffect
2. **Optimize Renders**: Use React.memo when needed
3. **Clean Code**: Remove unused imports and variables
4. **Test Thoroughly**: Test your components before export

## Troubleshooting

### Common Issues

1. **Code Not Updating**: Click "Run" to force refresh
2. **Save Not Working**: Check browser storage permissions
3. **Template Not Loading**: Try refreshing the page
4. **Export Fails**: Check code syntax and validity

### Debug Mode

Enable debug mode for detailed information:

```javascript
// In browser console
localStorage.setItem('sandbox-debug', 'true')
```

### Error Handling

- **Syntax Errors**: Highlighted in the editor
- **Runtime Errors**: Shown in the preview
- **Save Errors**: Displayed in the UI
- **Export Errors**: Handled by export system

## Examples

### Creating a Custom Component

1. **Start with Template**: Choose "React Counter"
2. **Modify Code**: Change the styling and functionality
3. **Add Features**: Add new buttons or state
4. **Test**: Verify everything works
5. **Save**: Save your custom component
6. **Export**: Export in your preferred format

### Building a Complex App

1. **Plan Structure**: Design your component hierarchy
2. **Start Simple**: Begin with basic functionality
3. **Add Features**: Incrementally add features
4. **Test Each Step**: Verify each addition works
5. **Save Versions**: Save at each major milestone
6. **Export Final**: Export the complete application

### Learning React

1. **Start with Templates**: Use provided examples
2. **Modify Gradually**: Make small changes
3. **Experiment**: Try different approaches
4. **Save Progress**: Keep your learning journey
5. **Export Examples**: Export your learning projects

## API Reference

### SandboxPage Props

```typescript
// No external props - self-contained component
```

### Template Interface

```typescript
interface SandboxTemplate {
  id: string
  name: string
  description: string
  code: string
  category: 'react' | 'nextjs' | 'vanilla' | 'typescript'
}
```

### Save Interface

```typescript
interface SavedSandbox {
  id: string
  name: string
  code: string
  timestamp: string
}
```

## Performance Considerations

### Optimization Features

- **Lazy Loading**: Templates loaded on demand
- **Efficient Re-renders**: Smart component updates
- **Memory Management**: Proper cleanup of resources
- **Storage Optimization**: Efficient local storage usage

### Performance Metrics

- **Load Time**: < 1 second for sandbox initialization
- **Template Loading**: < 500ms for template switching
- **Save Operations**: < 100ms for save/load operations
- **Export Integration**: < 2 seconds for export operations

## Security

### Security Features

- **Local Storage**: All saves are local to the browser
- **Code Sanitization**: Export system handles code cleaning
- **No Server Storage**: No sensitive data sent to servers
- **Safe Execution**: Sandboxed code execution

### Best Practices

- **Validate Input**: Always validate user input
- **Sanitize Code**: Clean code before export
- **Handle Errors**: Proper error handling
- **Secure Storage**: Use secure storage methods

## Browser Support

The sandbox system supports all modern browsers:

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Contributing

### Adding New Templates

1. **Create Template**: Add to `defaultTemplates` array
2. **Test Template**: Verify it works correctly
3. **Add Documentation**: Update this documentation
4. **Test Export**: Ensure export works with template

### Template Guidelines

- **Clear Purpose**: Each template should have a clear purpose
- **Working Code**: All templates should work immediately
- **Good Practices**: Follow React best practices
- **Educational**: Include learning opportunities

## Support

For issues with the sandbox system:

1. **Check Console**: Look for error messages
2. **Verify Code**: Ensure your code is valid
3. **Try Templates**: Test with provided templates
4. **Contact Support**: Report issues with details

### Getting Help

- **Documentation**: Check this documentation
- **Templates**: Use provided examples
- **Export System**: Use export for sharing
- **Community**: Ask questions in discussions

---

*Built for the Build Studio community - Happy coding! 🚀* 