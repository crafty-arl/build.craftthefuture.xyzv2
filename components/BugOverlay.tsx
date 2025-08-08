'use client'

import { BugHighlighter, type BugLocation } from "@/lib/utils/bugHighlighter"
import { useState, useEffect } from "react"

interface BugOverlayProps {
  toolId: string
  currentCode: string
  expectedBugs: Array<{
    id: number
    title: string
    description: string
    clue: string
    bonus: string
    solution?: string
  }>
}

export const BugOverlay = ({ toolId, currentCode }: BugOverlayProps) => {
  const [hoveredBug, setHoveredBug] = useState<BugLocation | null>(null)
  const [detectedBugs, setDetectedBugs] = useState<BugLocation[]>([])
  
  useEffect(() => {
    const bugs = BugHighlighter.getBugLocations(toolId, currentCode)
    setDetectedBugs(bugs)
  }, [toolId, currentCode])
  
  if (detectedBugs.length === 0) {
    return null
  }
  
  return (
    <div className="bug-overlay">
      {detectedBugs.map(bug => (
        <div key={bug.id} className="bug-marker">
          {bug.lines.map(lineNumber => (
            <div
              key={`${bug.id}-${lineNumber}`}
              className={`bug-highlight bug-${bug.severity}`}
              style={{
                position: 'absolute',
                top: `${(lineNumber - 1) * 20}px`, // Approximate line height
                left: '0',
                right: '0',
                height: '20px',
                backgroundColor: bug.severity === 'error' 
                  ? 'rgba(255, 107, 107, 0.2)' 
                  : 'rgba(255, 217, 61, 0.2)',
                borderLeft: `3px solid ${bug.severity === 'error' ? '#ff6b6b' : '#ffd93d'}`,
                pointerEvents: 'auto',
                zIndex: 10,
                cursor: 'help'
              }}
              onMouseEnter={() => setHoveredBug(bug)}
              onMouseLeave={() => setHoveredBug(null)}
            />
          ))}
        </div>
      ))}
      
      {/* Bug Tooltip */}
      {hoveredBug && (
        <div 
          className="bug-tooltip"
          style={{
            position: 'absolute',
            top: `${(hoveredBug.lines[0] - 1) * 20 - 40}px`,
            left: '20px',
            background: '#2a2a2a',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: `1px solid ${hoveredBug.severity === 'error' ? '#ff6b6b' : '#ffd93d'}`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              🐛 {hoveredBug.title}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${
              hoveredBug.severity === 'error' 
                ? 'bg-red-600 text-white' 
                : 'bg-yellow-600 text-black'
            }`}>
              {hoveredBug.severity}
            </span>
          </div>
          <div className="text-xs text-gray-300 mb-2">
            {hoveredBug.message}
          </div>
          {hoveredBug.hint && (
            <div className="text-xs text-blue-300">
              💡 {hoveredBug.hint}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 