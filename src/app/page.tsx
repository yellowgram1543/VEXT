import { fetchSanity } from '@/lib/sanity'
import { modulesQuery } from '@/lib/sanity.queries'
import { Module } from '@/types'
import { prisma } from '@/lib/prisma'
import ModuleCard from '@/components/ModuleCard'
import CognitiveRadar from '@/components/CognitiveRadar'
import { ChevronRight, Play } from 'lucide-react'
import Link from 'next/link'

import { getAllModules } from '@/lib/content-loader'
import { STAGE_LABELS } from '@/lib/constants'

export default async function Home() {
  let modules: Module[] = []
  let completedChapterIds: Set<string> = new Set()
  let activeProgress: any = null
  let mastery: any = null
  let error = false

  try {
    const localModules = getAllModules();
    // Only use local modules for now to remove demo content
    modules = [...(localModules as any[])];
  } catch (e) {
    console.error('Error fetching modules:', e);
    error = true;
  }

  try {
    const [progressData, latestProgress] = await Promise.all([
      prisma.progress.findMany({
        where: { NOT: { completedAt: null } },
        select: { chapterId: true }
      }),
      prisma.progress.findFirst({
        orderBy: { lastVisitedAt: 'desc' }
      })
    ]);
    completedChapterIds = new Set(progressData.map(p => p.chapterId));
    activeProgress = latestProgress;
  } catch (e) {
    console.warn('Database unreachable, progress data unavailable:', e);
    // Fallback to empty progress
    completedChapterIds = new Set();
    activeProgress = null;
  }

  // Fetch mastery separately as it's non-critical and might fail if schema is out of sync
  try {
    mastery = await prisma.userMastery.findUnique({
      where: { userId: 'prototype-user-id' }
    })
  } catch (e) {
    console.warn('Mastery data unavailable (likely database schema mismatch):', e)
    // mastery remains null, UI will show default profile
  }

  // Find the topic title for the active progress
  const activeTopic = modules.flatMap(m => m.chapters || []).find(c => c._id === activeProgress?.chapterId) || 
                      modules.flatMap(m => m.chapters || []).find(c => c.slug?.current && activeProgress?.chapterId);

  return (
    <main className="min-h-screen bg-background font-body py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <p className="font-heading font-bold uppercase text-secondary tracking-widest text-xs mb-1">
              Dashboard
            </p>
            <h1 className="text-5xl font-black text-brand-dark">
              ML Cognitive Coach
            </h1>
          </div>
        </header>

        {activeProgress && (
          <section className="mb-12">
            <div className="bg-[#F1D6FF] border-3 border-brand-dark rounded-neo p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[6px_6px_0px_0px_#330C2F]">
              <div className="flex items-center gap-6">
                <div className="bg-white border-3 border-brand-dark p-4 rounded-full shadow-[3px_3px_0px_0px_#330C2F]">
                  <Play className="w-8 h-8 text-[#7B287D] fill-current" />
                </div>
                <div>
                   <h2 className="text-sm font-black text-brand-dark/60 uppercase tracking-widest mb-1">Continue Learning</h2>
                   <p className="text-2xl font-black text-brand-dark">
                     Resume: <span className="uppercase">{activeTopic?.title || "Latest Topic"}</span>
                   </p>
                   <p className="text-xs font-bold text-[#7B287D] uppercase mt-1">
                     Current Stage: {STAGE_LABELS[activeProgress.highestStage as keyof typeof STAGE_LABELS]}
                   </p>
                </div>
              </div>
              <Link 
                href={activeTopic?.slug?.current ? `/chapters/${activeTopic.slug.current}` : '#'}
                className="bg-white border-3 border-brand-dark px-8 py-3 rounded-neo font-heading font-black uppercase text-sm tracking-widest neo-brutal-shadow neo-brutal-interactive transition-all flex items-center gap-2"
              >
                Go to Lab <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight mb-8">
                Learning Modules
              </h2>

              {error ? (
                <div className="p-6 bg-error-container border-3 border-brand-dark rounded-neo neo-brutal-shadow">
                  <p className="text-on-error-container font-bold">Failed to load modules. Please try again later.</p>
                </div>
              ) : modules && modules.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {modules.map((module) => {
                    const totalChapters = module.chapterCount || module.chapters?.length || 0;
                    const completedCount = module.chapterIds 
                      ? module.chapterIds.filter(id => completedChapterIds.has(id)).length 
                      : (module.chapters || []).filter(ch => completedChapterIds.has(ch._id)).length;
                    
                    const progressPercentage = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

                    return (
                      <ModuleCard 
                        key={module._id}
                        module={module}
                        progressPercentage={progressPercentage}
                        completedCount={completedCount}
                        totalChapters={totalChapters}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant italic">No modules found. Please check back later!</p>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
               <div className="bg-white border-3 border-brand-dark p-8 rounded-neo neo-brutal-shadow flex flex-col items-center">
                  <h3 className="font-heading font-black text-xs uppercase tracking-widest text-brand-dark/40 mb-8">
                    Global Cognitive Profile
                  </h3>
                  <CognitiveRadar 
                    size={260}
                    data={[
                      { label: 'Theory', value: (mastery?.theoryScore || 0) / 100 },
                      { label: 'Numerical', value: (mastery?.numericalScore || 0) / 100 },
                      { label: 'Coding', value: (mastery?.codingScore || 0) / 100 },
                      { label: 'Practical', value: (mastery?.practicalScore || 0) / 100 },
                      { label: 'Intuition', value: (mastery?.intuitionScore || 0) / 100 },
                      { label: 'Arch', value: (mastery?.architectureScore || 0) / 100 },
                    ]}
                  />
                  <div className="mt-10 pt-6 border-t-2 border-brand-dark/5 w-full">
                    <p className="text-[10px] font-bold text-brand-dark/60 uppercase leading-tight text-center">
                      Mastery increases by 5% for each passed quiz or completed practice cell.
                    </p>
                  </div>
               </div>

               <aside className="bg-secondary-container border-3 border-brand-dark p-6 rounded-neo neo-brutal-shadow">
                <div className="flex items-center gap-2 mb-4 text-on-secondary-container">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-xl font-black">Quick Tips</h3>
                </div>
                <ul className="space-y-3 text-on-secondary-container font-medium text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Complete quizzes with 80%+ to unlock next stages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Practical application is the key to retention.</span>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
