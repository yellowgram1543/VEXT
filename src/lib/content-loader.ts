import fs from 'fs';
import path from 'path';
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
    return JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
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
          ...fullContent
        };
      }
      return chapterConfig;
    }
  }
  return null;
}
