'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { sampleChapters } from '@/data/sample-content'

export default function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: session } = useSession()
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  // In a real app, you would fetch based on the slug from Sanity
  const chapter = sampleChapters.find(c => c.slug.current === slug) || sampleChapters[0];

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
          moduleId: chapter.module._ref,
          chapterId: chapter._id,
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
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/modules/m1`} className="text-gray-500 hover:text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Exit Lesson</span>
          </Link>
          <div className="text-sm font-bold text-gray-400">
            JLPT N5 | Chapter {chapter.order}
          </div>
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
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{chapter.title}</h1>
          <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </header>

        <div className="prose prose-lg prose-blue mx-auto">
          {chapter.content.map((block, i) => {
            if (block._type === 'block') {
              return (
                <p key={i} className="text-xl text-gray-700 leading-relaxed mb-6">
                  {block.children.map((span: any) => span.text).join('')}
                </p>
              );
            }
            if (block._type === 'exampleSentence') {
              return (
                <div key={i} className="my-10 bg-blue-50/80 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-sm">
                  <div className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{block.japanese}</div>
                  <div className="text-lg text-blue-600 font-medium mb-2 italic">{block.romaji}</div>
                  <div className="text-xl text-gray-600">{block.english}</div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <footer className="mt-20 pt-8 border-t border-gray-200 flex justify-between items-center">
          <div className="text-gray-400 text-sm">Next Chapter: Subject Particle "ga"</div>
          <Link 
            href="/modules/m1"
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center"
          >
            Next Lesson
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </footer>
      </article>
    </main>
  )
}
