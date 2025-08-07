"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sandpack } from "@codesandbox/sandpack-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, RotateCcw, Terminal, Download, Settings, Save, FileText, Code2, Trash2 } from 'lucide-react'
import { ExportDialog } from '@/components/export-dialog'
import { ReactCodeGenerator } from '@/lib/utils/reactCodeGenerator'

interface SandboxTemplate {
  id: string
  name: string
  description: string
  code: string
  category: 'react' | 'nextjs' | 'vanilla' | 'typescript'
}

const defaultTemplates: SandboxTemplate[] = [
  {
    id: 'react-counter',
    name: 'React Counter',
    description: 'Simple counter component with useState',
    category: 'react',
    code: `import React, { useState } from 'react';

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

export default Counter;`
  },
  {
    id: 'todo-app',
    name: 'Todo App',
    description: 'Simple todo list with add/remove functionality',
    category: 'react',
    code: `import React, { useState } from 'react';

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
        <button 
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span 
              style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`
  },
  {
    id: 'form-component',
    name: 'Form Component',
    description: 'Contact form with validation',
    category: 'react',
    code: `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Here you would typically send the data to a server
      console.log('Form submitted:', formData);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#28a745' }}>Thank you!</h2>
        <p>Your message has been sent successfully.</p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px' }}>
      <h1>Contact Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: errors.name ? '1px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.name}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: errors.email ? '1px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.email}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Message:
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: errors.message ? '1px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
          />
          {errors.message && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.message}</span>
          )}
        </div>
        
        <button 
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactForm;`
  },
  {
    id: 'api-fetch',
    name: 'API Fetch',
    description: 'Component that fetches and displays data from an API',
    category: 'react',
    code: `import React, { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#dc3545' }}>Error: {error}</div>
        <button 
          onClick={fetchUsers}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User List</h1>
      <div style={{ display: 'grid', gap: '15px' }}>
        {users.map(user => (
          <div 
            key={user.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{user.name}</h3>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Company:</strong> {user.company.name}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Website:</strong> {user.website}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;`
  }
]

export default function SandboxPage() {
  const router = useRouter()
  const [currentCode, setCurrentCode] = useState(defaultTemplates[0].code)
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplates[0])
  const [showTemplates, setShowTemplates] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sandboxKey, setSandboxKey] = useState(0)
  const [savedSandboxes, setSavedSandboxes] = useState<Array<{id: string, name: string, code: string, timestamp: string}>>([])
  const [componentName, setComponentName] = useState('MyComponent')

  // Function to extract component name from code
  const extractComponentName = (code: string): string => {
    const componentMatch = code.match(/function\s+(\w+)\s*\(/);
    if (componentMatch) {
      return componentMatch[1];
    }
    // If no function found, look for export default
    const exportMatch = code.match(/export\s+default\s+(\w+)/);
    if (exportMatch) {
      return exportMatch[1];
    }
    return 'MyComponent';
  }

  // Load saved sandboxes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sandbox-saves')
    if (saved) {
      try {
        setSavedSandboxes(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load saved sandboxes:', error)
      }
    }
  }, [])

  const saveSandbox = () => {
    const name = prompt('Enter a name for this sandbox:')
    if (name && name.trim()) {
      const newSandbox = {
        id: Date.now().toString(),
        name: name.trim(),
        code: currentCode,
        timestamp: new Date().toISOString()
      }
      const updated = [...savedSandboxes, newSandbox]
      setSavedSandboxes(updated)
      localStorage.setItem('sandbox-saves', JSON.stringify(updated))
    }
  }

  const loadSandbox = (sandbox: typeof savedSandboxes[0]) => {
    setCurrentCode(sandbox.code)
    setComponentName(extractComponentName(sandbox.code))
    setSandboxKey(prev => prev + 1)
  }

  const deleteSandbox = (id: string) => {
    const updated = savedSandboxes.filter(s => s.id !== id)
    setSavedSandboxes(updated)
    localStorage.setItem('sandbox-saves', JSON.stringify(updated))
  }

  const selectTemplate = (template: SandboxTemplate) => {
    setSelectedTemplate(template)
    setCurrentCode(template.code)
    setComponentName(extractComponentName(template.code))
    setSandboxKey(prev => prev + 1)
    setShowTemplates(false)
  }

  const resetCode = () => {
    setCurrentCode(selectedTemplate.code)
    setSandboxKey(prev => prev + 1)
  }

  const clearCode = () => {
    setCurrentCode('')
    setComponentName('MyComponent')
    setSandboxKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-[#1E1E1E] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white hover:bg-[#1E1E1E] text-xs sm:text-sm shrink-0"
              size="sm"
            >
              ← <span className="hidden sm:inline">Back to Studio</span><span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold">Code Sandbox</h1>
                <Badge className="bg-[#7EE787] text-black font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm shrink-0">
                  Free Play
                </Badge>
              </div>
              <p className="text-gray-400 mt-1 text-sm sm:text-base hidden md:block">Write, test, and export your React components</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-3 sm:px-4 py-2 text-sm"
              size="sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)]">
        {/* Left Panel - Code Editor */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#1E1E1E] h-1/2 lg:h-full">
          <Sandpack
            key={`sandbox-${sandboxKey}`}
            template="react"
            files={{
              "/App.js": {
                code: (() => {
                  // Use ReactCodeGenerator for proper code generation
                  if (!currentCode.trim()) {
                    return ReactCodeGenerator.generateReactCode('', componentName)
                  }
                  return ReactCodeGenerator.generateReactCode(currentCode, componentName)
                })(),
                active: true
              }
            }}
            theme={{
              colors: {
                surface1: "#1E1E1E",
                surface2: "#1E1E1E",
                surface3: "#1E1E1E"
              }
            }}
                          options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: "calc(50vh - 70px)",
                layout: "preview",
                editorWidthPercentage: 100
              }}
            customSetup={{
              dependencies: {
                "react": "^18.0.0",
                "react-dom": "^18.0.0"
              }
            }}
          />
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full">
          <div className="h-full">
            <Sandpack
              key={`preview-sandbox-${sandboxKey}`}
              template="react"
                              files={{
                "/App.js": {
                  code: (() => {
                    const cleanedCode = currentCode.replace(/export default.*;?\s*$/, '')
                    // If code is empty, provide a default component
                    if (!cleanedCode.trim()) {
                      return `import React from 'react';

function ${componentName}() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Sandbox!</h1>
      <p>Start coding your React component here.</p>
      <p>Your component will appear below.</p>
    </div>
  );
}

function App() {
  return <${componentName} />
}

export default App;`
                    }
                    
                    // Check if the code contains a component definition
                    const hasComponent = cleanedCode.includes('function') || cleanedCode.includes('const') || cleanedCode.includes('class')
                    
                    if (!hasComponent) {
                      // If no component found, wrap the code in a component
                      return `import React from 'react';

function ${componentName}() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Component</h1>
      <div>
        ${cleanedCode || '// Your code will appear here'}
      </div>
    </div>
  );
}

function App() {
  return <${componentName} />
}

export default App;`
                    }
                    
                    // Extract the actual component name from the code
                    let actualComponentName = componentName;
                    
                    // Try to find function component
                    const functionMatch = cleanedCode.match(/function\s+(\w+)\s*\(/);
                    if (functionMatch) {
                      actualComponentName = functionMatch[1];
                    } else {
                      // Try to find const component
                      const constMatch = cleanedCode.match(/const\s+(\w+)\s*=/);
                      if (constMatch) {
                        actualComponentName = constMatch[1];
                      }
                    }
                    
                    const finalCode = `${cleanedCode}\n\nfunction App() {\n  return <${actualComponentName} />\n}\n\nexport default App;`
                    return finalCode
                  })(),
                  active: true
                }
              }}
              theme={{
                colors: {
                  surface1: "#1E1E1E",
                  surface2: "#1E1E1E",
                  surface3: "#1E1E1E"
                }
              }}
              options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: false,
                showInlineErrors: false,
                wrapContent: true,
                editorHeight: "calc(100vh - 140px)",
                layout: "preview",
                editorWidthPercentage: 0
              }}
              customSetup={{
                dependencies: {
                  "react": "^18.0.0",
                  "react-dom": "^18.0.0"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="border-t border-[#1E1E1E] bg-[#1E1E1E] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSandboxKey(prev => prev + 1)}
              className="bg-[#7EE787] text-black hover:bg-[#6BD975] font-medium px-4 py-2"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button
              variant="outline"
              onClick={resetCode}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={clearCode}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Choose a Template</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {defaultTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-[#2A2A2A] rounded-lg p-4 hover:border-[#7EE787] transition-colors cursor-pointer"
                      onClick={() => selectTemplate(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-[#7EE787] mt-0.5">
                          <Code2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConsole(!showConsole)}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Console
            </Button>
            <Button
              variant="outline"
              onClick={saveSandbox}
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <ExportDialog
              code={currentCode}
              componentName={componentName}
              toolTitle="Sandbox Component"
              trigger={
                <Button
                  variant="outline"
                  className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Saved Sandboxes Dialog */}
      {savedSandboxes.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              Saved ({savedSandboxes.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1E1E1E] border-[#2A2A2A] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Saved Sandboxes</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedSandboxes.map((sandbox) => (
                <div
                  key={sandbox.id}
                  className="border border-[#2A2A2A] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{sandbox.name}</h3>
                      <p className="text-sm text-gray-300">
                        {new Date(sandbox.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadSandbox(sandbox)}
                        className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSandbox(sandbox.id)}
                        className="border-[#2A2A2A] text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 