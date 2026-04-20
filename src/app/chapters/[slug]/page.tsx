import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { fetchSanity } from '@/lib/sanity'
import { chapterBySlugQuery } from '@/lib/sanity.queries'
import ChapterCompleteButton from '@/components/ChapterCompleteButton'

interface ChapterPageProps {
  params: Promise<{ slug: string }>
}

const portableTextComponents = {
  types: {
    exampleSentence: ({ value }: any) => (
      <div className="my-10 bg-blue-50/80 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-sm">
        <div className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{value.japanese}</div>
        {value.romaji && <div className="text-lg text-blue-600 font-medium mb-2 italic">{value.romaji}</div>}
        <div className="text-xl text-gray-600">{value.english}</div>
      </div>
    ),
  },
  block: {
    normal: ({ children }: any) => <p className="text-xl text-gray-700 leading-relaxed mb-6">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
  },
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  
  const chapter = await fetchSanity<any>(chapterBySlugQuery, { slug })

  if (!chapter) {
    notFound()
  }

  const moduleId = chapter.module?._id
  const moduleSlug = chapter.module?.slug || 'm1' // Fallback for safety

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/modules/${moduleSlug}`} className="text-gray-500 hover:text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Exit Lesson</span>
          </Link>
          <div className="text-sm font-bold text-gray-400">
            JLPT N5 | Chapter {chapter.order}
          </div>
          <ChapterCompleteButton moduleId={moduleId} chapterId={chapter._id} />
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{chapter.title}</h1>
          <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </header>

        <div className="prose prose-lg prose-blue mx-auto">
          <PortableText value={chapter.content} components={portableTextComponents} />
        </div>

        <footer className="mt-20 pt-8 border-t border-gray-200 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {chapter.nextChapter ? `Next: ${chapter.nextChapter.title}` : "End of Module"}
          </div>
          {chapter.nextChapter ? (
            <Link 
              href={`/chapters/${chapter.nextChapter.slug.current}`}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center"
            >
              Next Lesson
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link 
              href={`/modules/${moduleSlug}`}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center"
            >
              Module Overview
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </footer>
      </article>
    </main>
  )
}
