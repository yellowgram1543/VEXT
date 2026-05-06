import phase from './phase'
import moduleSchema from './module'
import topic from './topic'
import understand, { socraticPrompt } from './objects/understand'
import reinforce from './objects/reinforce'
import test, { quizQuestion } from './objects/test'
import apply, { sandboxConfig } from './objects/apply'

export const schemaTypes = [
  phase,
  moduleSchema,
  topic,
  understand,
  socraticPrompt,
  reinforce,
  test,
  quizQuestion,
  apply,
  sandboxConfig,
]
