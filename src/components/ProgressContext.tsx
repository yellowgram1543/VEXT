'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { isChapterLocked as checkIsLocked } from '@/lib/progress-utils';

interface ContextualInfo {
  topicTitle?: string;
  currentStage?: string;
  progress?: number;
}

interface ProgressContextType {
  totalMastery: number;
  streak: number;
  contextualInfo: ContextualInfo;
  setContextualInfo: (info: ContextualInfo) => void;
  isChapterLocked: (chapterId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

interface ProgressProviderProps {
  children: ReactNode;
  modules: any[];
  progressData: any[];
}

export default function ProgressProvider({ children, modules, progressData }: ProgressProviderProps) {
  const [contextualInfo, setContextualInfo] = useState<ContextualInfo>({});

  const isChapterLocked = (chapterId: string) => {
    return checkIsLocked(chapterId, modules, progressData);
  };

  // Calculate total mastery based on completedAt
  const allChapters = modules.flatMap(m => m.chapters || []);
  const totalChaptersAcrossAllModules = allChapters.length;
  const completedChapterIds = new Set(
    progressData.filter(p => p.completedAt).map(p => p.chapterId)
  );
  const totalCompletedChapters = Array.from(completedChapterIds).length;
  
  const totalMastery = totalChaptersAcrossAllModules > 0 
    ? Math.round((totalCompletedChapters / totalChaptersAcrossAllModules) * 100) 
    : 0;

  const streak = 7;

  return (
    <ProgressContext.Provider value={{ 
      totalMastery, 
      streak, 
      contextualInfo, 
      setContextualInfo,
      isChapterLocked
    }}>
      {children}
    </ProgressContext.Provider>
  );
}
