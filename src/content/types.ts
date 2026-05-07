import { QuestionType } from '@/components/stages/QuizCell';

export interface ModuleContent {
  id: string;
  order: number;
  title: string;
  description: string;
  chapters: ChapterContent[];
}

export interface ChapterContent {
  id: string;
  slug: string;
  title: string;
  stages: {
    understand: UnderstandStage;
    practice: PracticeStage;
    quiz: QuizStage;
    apply: ApplyStage;
  };
}

export interface UnderstandStage {
  content: any[]; // PortableText blocks
  visualizer?: 'loss' | 'probability' | 'gradient';
}

export interface PracticeStage {
  tabs: {
    coding?: {
      title: string;
      initialCode: string;
      solution: string;
      hints: string[];
    };
    math?: {
      questions: {
        id: string;
        question: string;
        hint?: string;
        answer: string;
      }[];
    };
    concept?: {
      questions: {
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    };
  };
}

export interface QuizStage {
  questions: {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer: any;
    explanation: string;
    hint?: string;
    dimension: 'Theory' | 'Numerical' | 'Coding' | 'Practical' | 'Intuition' | 'Arch';
  }[];
}

export interface ApplyStage {
  instruction: string;
  milestones: {
    id: string;
    title: string;
    description: string;
  }[];
}
