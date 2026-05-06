'use client';

import React from 'react';
import QuizCell, { QuizQuestion } from '@/components/stages/QuizCell';

const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    question: 'Which loss function is most appropriate for a multi-class classification problem where the labels are mutually exclusive?',
    options: ['Mean Squared Error', 'Binary Cross-Entropy', 'Categorical Cross-Entropy', 'Huber Loss'],
    correctAnswer: 2,
    explanation: 'Categorical Cross-Entropy is designed for multi-class problems. Binary Cross-Entropy is for 2 classes, and MSE is typically for regression.'
  },
  {
    id: 'q2',
    type: 'true-false',
    question: 'Increasing the batch size in SGD (Stochastic Gradient Descent) always leads to better generalization performance.',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. Large batch sizes often lead to "sharp minima" which can hurt generalization. Smaller batches provide a regularization effect through stochastic noise.'
  },
  {
    id: 'q3',
    type: 'debugging',
    question: 'Identify the logical flaw in this PyTorch weight update loop that prevents the model from learning.',
    code: 'for data, target in dataloader:\n    optimizer.zero_grad()\n    output = model(data)\n    loss = criterion(output, target)\n    loss.backward()\n    # Missing step here\n    # model.update() ??',
    options: ['Missing loss.step()', 'Missing optimizer.step()', 'Missing model.train()', 'Missing data.to(device)'],
    correctAnswer: 1,
    explanation: '`optimizer.step()` is the critical call that actually updates the weights based on the gradients computed during `loss.backward()`.'
  },
  {
    id: 'q4',
    type: 'interpretation',
    question: 'Look at this Loss Curve. The Training Loss continues to drop, but the Validation Loss starts rising after epoch 15. What is happening?',
    image: 'https://miro.medium.com/v2/resize:fit:1200/1*86U90-E5VvYI8B-2yP7PBA.png',
    options: ['Underfitting', 'Overfitting', 'Learning rate too small', 'Vanishing Gradients'],
    correctAnswer: 1,
    explanation: 'This divergence is the classic signature of overfitting: the model is memorizing the training data but losing its ability to generalize to unseen validation data.'
  },
  {
    id: 'q5',
    type: 'model-selection',
    question: 'You need to deploy a model on an edge device (mobile) with extremely limited memory. You need high interpretability and decent accuracy on tabular data. Which model do you choose?',
    options: ['Deep Neural Network', 'Random Forest (1000 trees)', 'Decision Tree (Pruned)', 'XGBoost with Histogram binning'],
    correctAnswer: 2,
    explanation: 'A pruned Decision Tree is lightweight, has near-zero latency, and is highly interpretable. Forests and DNNs would be too heavy for this specific memory constraint.'
  },
  {
    id: 'q6',
    type: 'interview',
    question: 'Briefly explain the concept of "Self-Attention" in the context of the Transformer architecture.',
    correctAnswer: [
      'Mention that it relates words within the same sequence.',
      'Explain that it uses Query, Key, and Value vectors.',
      'Mention that it allows for parallelization compared to RNNs.',
      'Explain that it captures long-range dependencies regardless of distance.'
    ],
    explanation: 'Self-attention allows the model to look at other words in the input sequence to get a better encoding for the word it is currently processing. It computes a weighted sum of values based on query-key compatibility.'
  },
  {
    id: 'q7',
    type: 'numerical',
    question: 'Calculate the Entropy (in bits) of a biased coin that lands heads with probability $p=0.5$. (Recall: $H(X) = -\\sum p_i \\log_2 p_i$)',
    hint: 'For $p=0.5$, both states have $p_i=0.5$. $\\log_2(0.5) = -1$.',
    correctAnswer: '1',
    explanation: '$H(X) = -(0.5 \\cdot (-1) + 0.5 \\cdot (-1)) = -(-0.5 - 0.5) = 1$. This is the maximum entropy for a binary variable.'
  }
];

export default function QuizDebugPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-24">
      <div className="max-w-[1000px] mx-auto">
        <header className="mb-12 border-b-4 border-brand-dark pb-6">
          <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-2">
            Quiz Mastery Engine
          </h1>
          <p className="text-brand-dark/60 font-medium italic">
            Validating 7 Cognitive Dimensions with 80% Threshold Logic.
          </p>
        </header>

        <div className="border-3 border-brand-dark rounded-neo bg-white shadow-[12px_12px_0px_0px_#330C2F] p-8 md:p-12">
          <QuizCell 
            topicId="debug-mastery"
            questions={DEMO_QUESTIONS}
            onComplete={(score) => console.log('Quiz Final Score:', score)}
          />
        </div>

        <footer className="mt-12 text-center text-xs font-black uppercase text-brand-dark/30 tracking-widest">
          Cognitive Assessment Lab v2.0
        </footer>
      </div>
    </div>
  );
}
