export interface Module {
  _id: string;
  title: string;
  description: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  order: number;
  slug?: { current: string };
  chapters?: Chapter[];
  chapterCount?: number;
  chapterIds?: string[];
}

export interface Chapter {
  _id: string;
  title: string;
  slug: { current: string };
  order: number;
  content: any[]; // Using any[] for now as PortableText is complex, but I'll try to refine
  module?: {
    _id: string;
    title: string;
    slug: string;
  };
  nextChapter?: {
    title: string;
    slug: { current: string };
  };
  completed?: boolean;
}
