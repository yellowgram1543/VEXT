import { notFound } from 'next/navigation'
import { fetchSanity } from '@/lib/sanity'
import { chapterBySlugQuery } from '@/lib/sanity.queries'
import { Topic } from '@/types'
import { prisma } from '@/lib/prisma'
import TopicFlow from '@/components/TopicFlow'
import { getTopicProgress } from '@/lib/learning-engine'
import { StageType } from '@prisma/client'

interface ChapterPageProps {
  params: Promise<{ slug: string }>
}

import { getLocalChapterBySlug } from '@/lib/content-loader'

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  
  let topic = await fetchSanity<Topic>(chapterBySlugQuery, { slug })

  if (!topic) {
    topic = getLocalChapterBySlug(slug)
  }

  if (!topic) {
    notFound()
  }

  // Fetch or initialize progress and update lastVisitedAt
  const progress = await getTopicProgress(topic._id)

  const initialHighestStage = progress?.highestStage || StageType.UNDERSTAND

  return (
    <main className="min-h-screen bg-background animate-fade-in">
       <TopicFlow topic={topic} initialHighestStage={initialHighestStage} />
    </main>
  )
}
