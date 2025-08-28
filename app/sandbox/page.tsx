"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sandpack } from "@codesandbox/sandpack-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, RotateCcw, Terminal, Download, Settings, Save, FileText, Code2, Trash2, Target } from 'lucide-react'
import { ExportDialog } from '@/components/export-dialog'
import { LearningBridge } from '@/components/learning-bridge'
import { ContextualHelpSystem } from '@/components/contextual-help'

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
  const [componentName, setComponentName] = useState('Counter')
  
  // Enhanced sandbox features
  const [showLearningBridge, setShowLearningBridge] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  // Function to extract component name from code
  const extractComponentName = (code: string): string => {
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    if (functionMatch) {
      return functionMatch[1];
    }
    // If no function found, look for export default
    const exportMatch = code.match(/export\s+default\s+(\w+)/);
    if (exportMatch) {
      return exportMatch[1];
    }
    return 'MyComponent';
  }

  // Generate properly formatted React code
  const generateReactCode = (code: string): string => {
    if (!code.trim()) {
      return `import React from 'react';

function MyComponent() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Sandbox!</h1>
      <p>Start coding your React component here.</p>
    </div>
  );
}

export default MyComponent;`;
    }

    // If code already has imports and proper structure, return as is
    if (code.includes('import React') && code.includes('export default')) {
      return code;
    }

    // If code has a component but no imports/exports, add them
    if (code.includes('function ') || code.includes('const ')) {
      const cleanCode = code.replace(/export\s+default\s+\w+;?\s*$/, '').trim();
      const componentMatch = cleanCode.match(/function\s+(\w+)\s*\(|const\s+(\w+)\s*=/);
      const componentName = componentMatch ? (componentMatch[1] || componentMatch[2]) : 'MyComponent';
      
      return `import React from 'react';

${cleanCode}

export default ${componentName};`;
    }

    // Otherwise wrap in a component
    return `import React from 'react';

function MyComponent() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Component</h1>
      <div>
        {/* ${code} */}
      </div>
    </div>
  );
}

export default MyComponent;`;
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

  // Update component name when code changes
  useEffect(() => {
    const newComponentName = extractComponentName(currentCode);
    setComponentName(newComponentName);
  }, [currentCode]);

  // Time tracking for contextual help
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setTimeOnPage(Date.now() - startTime)
    }, 1000)
    
    return () => clearInterval(interval)
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
    setSandboxKey(prev => prev + 1)
    setShowTemplates(false)
  }

  const resetCode = () => {
    setCurrentCode(selectedTemplate.code)
    setSandboxKey(prev => prev + 1)
  }

  const clearCode = () => {
    setCurrentCode('')
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
                <h1 className="text-lg sm:text-2xl font-bold">Practice Mode</h1>
                <Badge className="bg-purple-500/10 text-purple-400 border border-purple-400/20 font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm shrink-0">
                  Free Exploration
                </Badge>
              </div>
              <div className="mt-1 hidden md:block">
                <p className="text-gray-400 text-sm sm:text-base">
                  Perfect for experimenting with ideas, testing concepts, or practicing without structured guidance
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  💡 Ready for structured challenges? Try our Guided Challenges mode
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowLearningBridge(!showLearningBridge)}
              className="border-blue-400/20 text-blue-400 hover:bg-blue-500/10 px-3 sm:px-4 py-2 text-sm"
              size="sm"
            >
              <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Challenges</span>
            </Button>
            
            <ContextualHelpSystem
              environment="sandbox"
              userLevel={userLevel}
              timeOnPage={timeOnPage}
            />
            
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
      <div className="h-[calc(100vh-140px)]">
        <Sandpack
          key={`sandbox-${sandboxKey}`}
          template="react"
          files={{
            "/App.js": {
              code: generateReactCode(currentCode),
              active: true
            }
          }}
          theme="dark"
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            layout: "split"
          }}
          customSetup={{
            dependencies: {
              "react": "^18.0.0",
              "react-dom": "^18.0.0"
            }
          }}
        />
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
              className="fixed bottom-20 right-4 border-[#1E1E1E] text-white hover:bg-[#121212] px-4 py-2"
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

      {/* Learning Bridge Panel */}
      {showLearningBridge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ready for Structured Learning?
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowLearningBridge(false)}
                className="text-gray-400 hover:text-white"
                size="sm"
              >
                ×
              </Button>
            </div>
            
            <div className="p-4">
              <LearningBridge
                currentEnvironment="sandbox"
                currentCode={currentCode}
                onTransition={(targetEnvironment, data) => {
                  if (targetEnvironment === 'learning') {
                    // Navigate to guided challenges
                    router.push(`/`)
                  }
                  setShowLearningBridge(false)
                }}
                // Mock suggested challenges - in real app would come from API
                suggestedChallenges={[
                  {
                    id: 'poll-maker',
                    title: 'Poll Maker',
                    description: 'Learn state management by fixing a voting component',
                    difficulty: 'beginner' as const,
                    skills: ['useState', 'event handling', 'state mutations'],
                    estimatedTime: 15,
                    bugCount: 1
                  },
                  {
                    id: 'date-calculator',
                    title: 'Date Calculator',
                    description: 'Master date manipulation and form handling',
                    difficulty: 'intermediate' as const,
                    skills: ['forms', 'validation', 'date handling'],
                    estimatedTime: 20,
                    bugCount: 2
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 