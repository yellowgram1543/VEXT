import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchSanity } from '@/lib/sanity'
import { moduleByIdQuery } from '@/lib/sanity.queries'
import { Module } from '@/types'

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let moduleData: Module | null = null;
  let error = false

  try {
    moduleData = await fetchSanity<Module>(moduleByIdQuery, { id })
  } catch (e) {
    console.error('Error fetching module:', e)
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

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to All Modules
        </Link>
        <header className="mb-10">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{moduleData.level}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 font-medium">Module {moduleData.order}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{moduleData.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{moduleData.description}</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Course Curriculum</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <Link 
                  key={chapter._id} 
                  href={`/chapters/${chapter.slug.current}`}
                  className="flex items-center justify-between px-6 py-5 hover:bg-blue-50/50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold text-sm group-hover:bg-blue-100 group-hover:text-blue-600">
                      {chapter.order}
                    </span>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-blue-700">{chapter.title}</span>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-blue-400">
                    <span className="text-sm mr-2">Start Lesson</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))
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
