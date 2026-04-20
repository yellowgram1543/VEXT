import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { fetchSanity } from '@/lib/sanity'
import { chapterBySlugQuery } from '@/lib/sanity.queries'
import ChapterCompleteButton from '@/components/ChapterCompleteButton'
import GrammarCard from '@/components/GrammarCard'
import InteractiveExample from '@/components/InteractiveExample'
import { Chapter } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ChapterPageProps {
  params: Promise<{ slug: string }>
}

const portableTextComponents: PortableTextComponents = {
  types: {
    exampleSentence: ({ value }: { value: { japanese: string, romaji?: string, english: string } }) => (
      <InteractiveExample 
        japanese={value.japanese}
        romaji={value.romaji}
        english={value.english}
      />
    ),
  },
  marks: {
    japanese: ({ children }) => <span className="font-medium text-slate-900 bg-slate-100 px-1 rounded">{children}</span>,
  },
  block: {
    normal: ({ children }) => {
      // Don't render empty blocks
      if (Array.isArray(children) && children.length === 1 && children[0] === '') return null;
      return (
        <GrammarCard>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed">{children}</p>
        </GrammarCard>
      )
    },
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 mt-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-800 mb-6 mt-10 px-2 border-l-4 border-blue-500">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-slate-800 mb-4 mt-8">{children}</h3>,
  },
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  
  const chapter = await fetchSanity<Chapter>(chapterBySlugQuery, { slug })

  if (!chapter) {
    notFound()
  }

  const moduleId = chapter.module?._id
  const moduleSlug = chapter.module?.slug || 'm1' // Fallback for safety

  return (
    <main className="min-h-screen bg-slate-50/50">
      <nav className="border-b border-slate-200 bg-white/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/modules/${moduleSlug}`} className="text-slate-500 hover:text-slate-900 flex items-center transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            <span className="text-sm font-semibold">Exit</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-none mb-1">
              Chapter {chapter.order}
            </span>
            <span className="text-sm font-bold text-slate-900 leading-none">
              {chapter.title}
            </span>
          </div>
          <ChapterCompleteButton moduleId={moduleId} chapterId={chapter._id} />
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {chapter.title}
          </h1>
          <div className="h-2 w-20 bg-blue-500 mx-auto rounded-full shadow-sm shadow-blue-200"></div>
        </header>

        <div className="space-y-2">
          <PortableText value={chapter.content} components={portableTextComponents} />
        </div>

        <footer className="mt-20 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm font-medium">
              {chapter.nextChapter ? (
                <span className="flex flex-col">
                  <span className="uppercase text-[10px] tracking-widest mb-1">Up Next</span>
                  <span className="text-slate-600 font-bold text-base">{chapter.nextChapter.title}</span>
                </span>
              ) : (
                <span className="uppercase text-[10px] tracking-widest">End of Module</span>
              )}
            </div>
            
            {chapter.nextChapter ? (
              <Link 
                href={`/chapters/${chapter.nextChapter.slug.current}`}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
              >
                Next Lesson
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                href={`/modules/${moduleSlug}`}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                Module Overview
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </footer>
      </article>
    </main>
  )
}

