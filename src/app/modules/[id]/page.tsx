import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchSanity } from '@/lib/sanity'
import { sidebarHierarchyQuery } from '@/lib/sanity.queries'
import { Module } from '@/types'
import { prisma } from '@/lib/prisma'
import { isChapterLocked } from '@/lib/progress-utils'

import { Progress } from '@prisma/client'
import { cn } from '@/lib/utils'

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let allModules: Module[] = [];
  let currentModule: Module | null = null;
  let progressData: Progress[] = [];
  let error = false

  try {
    const [sanityModules, dbProgress] = await Promise.all([
      fetchSanity<Module[]>(sidebarHierarchyQuery),
      prisma.progress.findMany()
    ])

    allModules = sanityModules;
    currentModule = sanityModules.find(m => m._id === id) || null;
    progressData = dbProgress;
  } catch (e) {
    console.error('Error fetching module data:', e)
    error = true
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">  
        <div className="max-w-3xl mx-auto text-center bg-error-container border-3 border-brand-dark p-8 rounded-neo neo-brutal-shadow">
          <h1 className="text-2xl font-black text-on-error-container mb-4 uppercase">Error</h1>    
          <p className="text-on-error-container mb-8 font-medium">Failed to load module details. Please try again later.</p>
          <Link href="/" className="inline-block bg-white border-3 border-brand-dark px-6 py-2 rounded-neo font-bold hover:bg-surface-container transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }


  if (!currentModule) {
    notFound()
  }

  const chapters = currentModule.chapters || []

  return (
    <main className="min-h-screen bg-background font-body py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="group flex items-center gap-2 text-brand-dark font-heading font-bold uppercase text-xs tracking-widest mb-8 hover:underline">
           <span>←</span> Back to Dashboard
        </Link>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <p className="font-heading font-bold uppercase text-secondary tracking-widest text-xs mb-1">
              Current Module
            </p>
            <h1 className="text-5xl font-black text-brand-dark">
              {currentModule.title}
            </h1>
            <p className="text-lg text-brand-dark/70 font-medium mt-4 max-w-2xl">
              {currentModule.description}
            </p>
          </div>
        </header>

        <section className="space-y-cell-gap">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Chapters / Curriculum</h2>
             <span className="text-[10px] font-bold text-brand-dark/50 uppercase">{chapters.length} Units</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {chapters.length > 0 ? (
              chapters.map((chapter) => {
                const isLocked = isChapterLocked(chapter._id, allModules, progressData);
                const progressRecord = progressData.find(p => p.chapterId === chapter._id);
                const isCompleted = !!progressRecord?.completedAt;

                return (
                  <Link
                    key={chapter._id}
                    href={isLocked ? '#' : `/chapters/${chapter.slug.current}`}
                    className={cn(
                      "flex items-center justify-between px-6 py-6 border-3 border-brand-dark rounded-neo transition-all",
                      isCompleted 
                        ? "bg-surface-container-low grayscale-[0.5]" 
                        : isLocked
                          ? "bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed"
                          : "bg-white neo-brutal-shadow neo-brutal-interactive"
                    )}
                  >
                    <div className="flex items-center space-x-6">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 border-3 border-brand-dark rounded-full font-heading font-black text-lg",
                        isCompleted
                          ? "bg-accent-purple text-white"
                          : isLocked
                            ? "bg-gray-200 text-gray-400 border-gray-300"
                            : "bg-primary-container text-brand-dark"
                      )}>
                        {isCompleted ? "✓" : chapter.order}
                      </div>
                      <div>
                        <span className={cn(
                          "text-xl font-black block leading-tight",
                          isCompleted ? "text-brand-dark/40 line-through" : isLocked ? "text-gray-400" : "text-brand-dark"
                        )}>
                          {chapter.title}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-purple">Mastered</span>
                        )}
                        {isLocked && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Locked</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={cn(
                        "px-4 py-1 border-3 border-brand-dark rounded-neo font-heading font-bold uppercase text-[10px] tracking-widest",
                        isCompleted 
                          ? "bg-white text-brand-dark/40" 
                          : isLocked
                            ? "bg-gray-200 text-gray-400 border-gray-300"
                            : "bg-accent-purple text-white"
                      )}>
                        {isCompleted ? "Review" : isLocked ? "Locked" : "Run Cell"}
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center border-3 border-dashed border-brand-dark/30 rounded-neo bg-white/50 italic text-brand-dark/50">
                No chapters found for this module yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
