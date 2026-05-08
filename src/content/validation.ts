import { z } from 'zod';

/**
 * Zod schemas for validating our "Film" (Content) before the "Projector" (UI) plays it.
 */

export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  tab: z.enum(['coding', 'math', 'concept']),
  type: z.string(),
  label: z.string(),
  instruction: z.string(),
  iconName: z.string().optional(),
  hints: z.array(z.string()),
  solution: z.string(),
  expected: z.string(),
  initialCode: z.string().optional(),
  // Socratic/Rubric fields
  scenario: z.string().optional(),
  observation: z.string().optional(),
  why: z.string().optional(),
  commonMistake: z.string().optional(),
  realWorldImplication: z.string().optional(),
  mentalModel: z.string().optional(),
  checklist: z.array(z.string()).optional(),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq', 'bool', 'match']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.any(),
  explanation: z.string(),
  hint: z.string().optional(),
  dimension: z.enum(['Theory', 'Numerical', 'Coding', 'Practical', 'Intuition', 'Arch']),
});

export const BlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    'text', 'diagram', 'analogy', 'formula-intuition', 'mental-model', 
    'socratic-prompt', 'concept-map', 'story', 'pitfall', 'counterexample',
    'visualizer', 'worked-example', 'case-study', 'comparison', 'think-aloud'
  ]),
  title: z.string().optional(),
  content: z.any().optional(), // Can be text, JSON data, or markdown
  data: z.any().optional(),    // Used for visualizers or structured data
  meta: z.object({
    anchor: z.string().optional(),
    misconception: z.string().optional(),
    correction: z.string().optional(),
    scenario: z.string().optional(),
    insight: z.string().optional(),
  }).optional(),
});

export const ChapterSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  stages: z.object({
    understand: z.object({
      content: z.array(z.any()).optional(), // Legacy support
      blocks: z.array(BlockSchema).optional(), // New Block Registry support
      visualizer: z.string().optional(),
      visualizerData: z.any().optional(),
    }),
    practice: z.object({
      tabs: z.object({
        coding: z.object({ questions: z.array(z.any()) }).optional(),
        math: z.object({ questions: z.array(z.any()) }).optional(),
        concept: z.object({ questions: z.array(z.any()) }).optional(),
      }).optional(),
    }).optional(),
    quiz: z.object({
      questions: z.array(QuizQuestionSchema),
    }),
    apply: z.object({
      instruction: z.string(),
      milestones: z.array(MilestoneSchema),
    }).optional(),
  }),
});

export type ValidatedChapter = z.infer<typeof ChapterSchema>;
