'use client'

import * as React from 'react'

interface ChapterCompleteButtonProps {
  chapterId: string;
}

export default function ChapterCompleteButton({ chapterId }: ChapterCompleteButtonProps) {
  const [completed, setCompleted] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)

  // Fetch initial completion status on mount
  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/progress/${chapterId}`)
        if (response.ok) {
          const data = await response.json()
          setCompleted(data.completed)
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [chapterId])

  const handleToggleComplete = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/progress/${chapterId}`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setCompleted(data.completed)
      } else {
        console.error("Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <button disabled className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
        Loading...
      </button>
    )
  }

  return (
    <button 
      onClick={handleToggleComplete}
      disabled={updating}
      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-2 ${
        completed 
          ? "bg-green-500 text-white shadow-lg shadow-green-200" 
          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
      } ${updating ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {updating ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </>
      ) : completed ? (
        <>
          <span className="text-lg animate-bounce-short">✓</span>
          <span>Mastered</span>
        </>
      ) : (
        <span>Mark Completed</span>
      )}
    </button>
  )
}
