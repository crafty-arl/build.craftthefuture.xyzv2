'use client'

import { BugHighlighter, type BugLocation } from "@/lib/utils/bugHighlighter"
import { useState, useEffect } from "react"

interface BugErrorOverlayProps {
  toolId: string
  currentCode: string
  bugsFixed: number[]
}

export const BugErrorOverlay = ({ toolId, currentCode, bugsFixed }: BugErrorOverlayProps) => {
  const [detectedBugs, setDetectedBugs] = useState<BugLocation[]>([])
  const [showBugInfo, setShowBugInfo] = useState<BugLocation | null>(null)
  
  useEffect(() => {
    const bugs = BugHighlighter.getBugLocations(toolId, currentCode)
    // Filter out bugs that are already fixed
    const unfixedBugs = bugs.filter(bug => !bugsFixed.includes(bug.id))
    setDetectedBugs(unfixedBugs)
  }, [toolId, currentCode, bugsFixed])
  
  if (detectedBugs.length === 0) {
    return null
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {detectedBugs.map(bug => (
        <div
          key={bug.id}
          className={`p-3 rounded-lg shadow-lg border-l-4 cursor-pointer transition-all duration-200 ${
            bug.severity === 'error' 
              ? 'bg-red-50 border-red-400 text-red-800 hover:bg-red-100' 
              : 'bg-yellow-50 border-yellow-400 text-yellow-800 hover:bg-yellow-100'
          }`}
          onClick={() => setShowBugInfo(showBugInfo?.id === bug.id ? null : bug)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🐛</span>
            <span className="font-medium">{bug.title}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              bug.severity === 'error' 
                ? 'bg-red-600 text-white' 
                : 'bg-yellow-600 text-black'
            }`}>
              {bug.severity}
            </span>
          </div>
          
          {showBugInfo?.id === bug.id && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm mb-2">{bug.message}</p>
              {bug.hint && (
                <p className="text-sm text-blue-600">
                  💡 {bug.hint}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 