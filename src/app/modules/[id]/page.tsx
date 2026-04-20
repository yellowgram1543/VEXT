import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchSanity } from '@/lib/sanity'
import { moduleByIdQuery } from '@/lib/sanity.queries'
import { Module } from '@/types'
import { prisma } from '@/lib/prisma'
import ProgressBar from '@/components/ProgressBar'

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let moduleData: Module | null = null;
  let error = false
  let completedChapterIds: Set<string> = new Set()

  try {
    // Parallel fetch for module data and progress
    const [sanityData, progressData] = await Promise.all([
      fetchSanity<Module>(moduleByIdQuery, { id }),
      prisma.progress.findMany({
        select: { chapterId: true }
      })
    ])
    
    moduleData = sanityData
    completedChapterIds = new Set(progressData.map(p => p.chapterId))
  } catch (e) {
    console.error('Error fetching module data:', e)
    error = true
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">Failed to load module details. Please try again later.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  if (!moduleData) {
    notFound()
  }

  const chapters = moduleData.chapters || []
  const totalChapters = chapters.length
  const completedCount = chapters.filter(c => completedChapterIds.has(c._id)).length
  const progressPercentage = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to All Modules
        </Link>
        <header className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{moduleData.level}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 font-medium">Module {moduleData.order}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{moduleData.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{moduleData.description}</p>
          
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                <span className="text-gray-400 ml-2 font-medium">Complete</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {completedCount} of {totalChapters} chapters mastered
              </span>
            </div>
            <ProgressBar progress={progressPercentage} size="md" />
          </div>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Course Curriculum</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {chapters.length > 0 ? (
              chapters.map((chapter) => {
                const isCompleted = completedChapterIds.has(chapter._id)
                return (
                  <Link 
                    key={chapter._id} 
                    href={`/chapters/${chapter.slug.current}`}
                    className="flex items-center justify-between px-6 py-5 hover:bg-blue-50/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        isCompleted 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}>
                        {isCompleted ? "✓" : chapter.order}
                      </span>
                      <span className={`text-lg font-medium group-hover:text-blue-700 ${
                        isCompleted ? "text-gray-400" : "text-gray-800"
                      }`}>
                        {chapter.title}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-blue-400">
                      <span className="text-sm mr-2">{isCompleted ? "Review" : "Start Lesson"}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No chapters found for this module yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
