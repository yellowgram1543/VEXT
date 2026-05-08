import fs from 'fs';
import path from 'path';
import { Calculator, HelpCircle, FileCode } from 'lucide-react';
import { ModuleContent, ChapterContent } from '@/content/types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/modules');

export function getAllModules(): ModuleContent[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  
  const moduleDirs = fs.readdirSync(CONTENT_DIR);
  return moduleDirs.map(dir => {
    const configPath = path.join(CONTENT_DIR, dir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      // Map JSON to Module interface
      return {
        ...config,
        _id: config.id,
        chapters: (config.chapters || []).map((ch: any) => ({
          ...ch,
          _id: ch.id,
          slug: { current: ch.slug }
        }))
      };
    }
    return null;
  }).filter(Boolean);
}

export function getChapterContent(moduleSlug: string, chapterSlug: string): ChapterContent | null {
  const chapterPath = path.join(CONTENT_DIR, moduleSlug, 'chapters', `${chapterSlug}.json`);
  if (fs.existsSync(chapterPath)) {
    const rawContent = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
    
    // Validate content against schema
    const result = ChapterSchema.safeParse(rawContent);
    if (!result.success) {
      console.warn(`[Content Validation Error] Chapter "${chapterSlug}" has schema errors:`, result.error.format());
    }

    return rawContent;
  }
  return null;
}

export function getLocalChapterBySlug(chapterSlug: string): any | null {
  const allModules = getAllModules();
  for (const m of allModules) {
    const chapterConfig = (m.chapters || []).find((c: any) => c.slug.current === chapterSlug);
    if (chapterConfig) {
      // Load full content from the JSON file
      const fullContent = getChapterContent(m._id, chapterSlug);
      if (fullContent) {
        return {
          ...chapterConfig,
          _id: chapterConfig.id,
          _type: 'chapter',
          understand: {
            content: fullContent.stages?.understand?.content || [],
            visualizer: fullContent.stages?.understand?.visualizer,
            visualizerData: fullContent.stages?.understand?.visualizerData
          },
          reinforce: {
            practices: (fullContent.stages?.practice?.tabs?.concept?.questions || []).map((q: any) => ({
              id: q.id,
              tab: 'concept',
              type: 'Insight',
              label: 'Concept Reflection',
              iconName: 'help',
              instruction: q.question,
              hints: q.hint ? [q.hint] : [],
              solution: q.explanation || 'Think about the relationship between variables.',
              options: q.options,
              correctAnswer: q.correctAnswer,
              checklist: q.checklist, // Rubric support
              scenario: q.scenario,
              observation: q.observation,
              commonMistake: q.commonMistake,
              realWorldImplication: q.realWorldImplication,
              mentalModel: q.mentalModel
            }))
          },
          practice: {
            exercises: [
              ...(fullContent.stages?.practice?.tabs?.math?.questions || []).map((q: any) => ({
                id: q.id,
                tab: 'math',
                type: 'Calculation',
                label: 'Math Lab',
                iconName: 'calculator',
                instruction: q.question,
                hints: q.hint ? [q.hint] : [],
                solution: q.answer || 'Check your derivation.',
                expected: q.answer
              })),
              ...(fullContent.stages?.practice?.tabs?.coding?.questions || []).map((q: any) => ({
                id: q.id,
                tab: 'coding',
                type: 'Implementation',
                label: 'Coding Lab',
                iconName: 'code',
                instruction: q.instruction,
                hints: q.hints || [],
                solution: q.solution,
                initialCode: q.initialCode
              }))
            ]
          },
          test: {
            questions: fullContent.stages?.quiz?.questions || []
          },
          apply: {
            instruction: fullContent.stages?.apply?.instruction,
            milestones: fullContent.stages?.apply?.milestones || []
          }
        };
      }
      return { ...chapterConfig, _type: 'chapter' };
    }
  }
  return null;
}
