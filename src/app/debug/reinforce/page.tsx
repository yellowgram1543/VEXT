'use client';

import React from 'react';
import ReinforceCell from '@/components/stages/ReinforceCell';

export default function ReinforceDebugPage() {
  const demoData = {
    basic: {
      title: "Logistic Regression Inference",
      explanation: "A simple implementation of the sigmoid function and the linear combination $z = wx + b$. This is the foundation of binary classification.",
      code: "import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef predict(x, w, b):\n    z = np.dot(x, w) + b\n    return sigmoid(z)",
      language: "python"
    },
    intermediate: {
      title: "Vectorized Batch Processing",
      explanation: "In production, we never process one sample at a time. We use matrix multiplication to process thousands of samples simultaneously for efficiency.",
      code: "import numpy as np\n\nclass LogisticModel:\n    def __init__(self, weights, bias):\n        self.w = weights\n        self.b = bias\n\n    def forward(self, X):\n        # X shape: (batch_size, num_features)\n        # self.w shape: (num_features,)\n        z = np.matmul(X, self.w) + self.b\n        return 1 / (1 + np.exp(-z))",
      language: "python"
    },
    advanced: {
      title: "Numerical Stability & Optimization",
      explanation: "Standard sigmoid can overflow with large negative numbers. We use a numerically stable version and add type hinting for production robustness.",
      code: "import numpy as np\nfrom typing import Union, NDArray\n\ndef stable_sigmoid(z: NDArray) -> NDArray:\n    \"\"\"Prevents overflow by handling positive/negative cases separately.\"\"\"\n    return np.where(\n        z >= 0, \n        1 / (1 + np.exp(-z)), \n        np.exp(z) / (1 + np.exp(z))\n    )\n\ndef predict_optimized(X: NDArray, W: NDArray) -> NDArray:\n    # Optimized using BLAS-backed matmul\n    return stable_sigmoid(X @ W)",
      language: "python"
    },
    pitfalls: [
      {
        mistake: "if pred > 0.5: return 1\nelse: return 0",
        correction: "return (pred > 0.5).astype(int)",
        reason: "Using Python IF statements inside loops breaks vectorization. Use NumPy boolean masking for 100x better performance."
      },
      {
        mistake: "loss = -np.sum(y * np.log(pred))",
        correction: "loss = -np.sum(y * np.log(pred + 1e-15))",
        reason: "Directly taking log(0) results in -inf, crashing your training. Always add a small epsilon (1e-15) for numerical stability."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-24">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-12 border-b-4 border-brand-dark pb-6">
          <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-2">
            Reinforce Layer Debugger
          </h1>
          <p className="text-brand-dark/60 font-medium italic">
            Previewing the 3-Tier Progression and Interactive Pitfalls.
          </p>
        </header>

        <div className="border-3 border-brand-dark rounded-neo bg-white shadow-[8px_8px_0px_0px_#330C2F] p-8">
          <ReinforceCell 
            data={demoData} 
            status="ACTIVE"
            onComplete={() => alert('Stage Unlocked!')}
          />
        </div>

        <footer className="mt-12 text-center text-xs font-black uppercase text-brand-dark/30 tracking-widest">
          Neo-Brutalist Component Lab v1.0
        </footer>
      </div>
    </div>
  );
}
