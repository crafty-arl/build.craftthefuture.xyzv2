'use client'

import { BugHighlighter, type BugLocation } from "@/lib/utils/bugHighlighter"
import { useEffect, useState } from "react"

interface BugDetectorProps {
  toolId: string
  currentCode: string
  onBugsDetected: (bugs: BugLocation[]) => void
}

export const BugDetector = ({ toolId, currentCode, onBugsDetected }: BugDetectorProps) => {
  const [detectedBugs, setDetectedBugs] = useState<BugLocation[]>([])
  
  useEffect(() => {
    const bugs = BugHighlighter.getBugLocations(toolId, currentCode)
    setDetectedBugs(bugs)
    onBugsDetected(bugs)
  }, [toolId, currentCode, onBugsDetected])
  
  // This component doesn't render anything visible
  // It just detects bugs and calls the callback
  return null
} 