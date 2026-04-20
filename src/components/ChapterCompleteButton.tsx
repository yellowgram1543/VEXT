'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'

interface ChapterCompleteButtonProps {
  moduleId: string;
  chapterId: string;
}

export default function ChapterCompleteButton({ moduleId, chapterId }: ChapterCompleteButtonProps) {
  const { data: session } = useSession()
  const [completed, setCompleted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleToggleComplete = async () => {
    if (!session) {
      alert("Please sign in to track your progress!")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          chapterId,
          completed: !completed
        })
      })

      if (response.ok) {
        setCompleted(!completed)
      } else {
        console.error("Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggleComplete}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
        completed 
          ? "bg-green-100 text-green-700 border border-green-200" 
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Saving..." : completed ? "✓ Completed" : "Mark Completed"}
    </button>
  )
}
