export interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  slug?: { current: string };
  chapters?: Topic[];
  chapterCount?: number;
  chapterIds?: string[];
}

export interface Topic {
  _id: string;
  _type: 'topic' | 'chapter';
  title: string;
  slug: { current: string };
  order: number;
  content?: any[]; // Legacy
  module?: {
    _id: string;
    title: string;
  };
  nextChapter?: {
    title: string;
    slug: { current: string };
  };
  understand?: {
    content: any[];
  };
  reinforce?: {
    practices: any[];
  };
  test?: {
    questions: QuizQuestion[];
  };
  apply?: {
    instruction: string;
    spec: any[];
    sandbox: {
      runtime: string;
      entryPoint: string;
      requirements: string[];
    };
  };
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'scenario' | 'debugging' | 'interpretation' | 'model-selection' | 'interview' | 'numerical';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  code?: string;
  image?: string;
  hint?: string;
}
