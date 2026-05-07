# Masterclass Design Principles

## 1. The Example Block (Reinforce Stage)
- **NOT A QUIZ**: This is for learning by example after the theory.
- **Show, Don't Test**: Automatically highlight the correct option and show the explanation/logic on the card immediately.
- **Walkthrough Style**: The user should feel like they are being guided through a solved case study.

## 2. The Practice Block (Practice Stage) - "Homework Mode"
- **Math & Concept Tabs**: Completely remove all textareas and numerical inputs. These are "Homework Mode" only—questions, hints, and solutions.
- **Coding Tab**: Keep interactive. The Python editor is the primary workspace. Use code comments as "TODO" prompts.
- **Self-Evaluation Rubric**: In the Concept solution view, provide a "Key Points for Your Answer" bulleted list (rubric) so learners can self-verify their mental answer.
- **No Validation**: No "Check Answer" buttons or alerts. Reveal the solution only when requested.
- **Button Styling**: Use a premium "Mark Practice as Finished" button that leads to a summary screen.

## 3. Example Archetypes (The "Secret Sauce")
Use these 12 archetypes to drive deep intuition:
1. **Real-World Industry**: Predictive maintenance, Uber trip duration, Spam filters.
2. **Progression**: Basic (2D points) → Intermediate (Noisy housing) → Advanced (Imbalanced fraud).
3. **Correct vs Wrong Thinking**: "95% accuracy is good" vs "Dataset imbalance makes it misleading".
4. **Common Pitfalls**: "Confusing variance with variability".
5. **"What Happens If..."**: Sliders/Animations showing high learning rates or k=1 in KNN.
6. **Side-by-Side Comparisons**: Underfit vs Good Fit vs Overfit.
7. **Failure Stories**: Tay AI, self-driving cars in snow.
8. **Interactive Visuals**: Sliders, decision boundaries, neural net playgrounds.
9. **"Expert Thinking" Boxes**: "Model performs well on train but poorly on val → high variance."
10. **Concept Maps**: Visual anchors for Bias/Variance/Complexity.
11. **Analogy-Based**: Gradient Descent as walking downhill blindfolded.
12. **Counter-Intuitive**: More data can worsen performance if labels are noisy.

## 4. The "Best Example" Structure
Every example card should follow this 7-point rubric:
1. **Scenario**: The setting/setup.
2. **Observation**: What do we see happening?
3. **Why it happens**: The underlying logic/math.
4. **Visualization**: A visual anchor (chart, emoji, or animation).
5. **Common mistake**: The trap learners fall into.
6. **Real-world implication**: Why this matters in a job.
7. **Mental model takeaway**: The one-sentence "anchor" to remember.

## 5. The Capstone Block (Apply Stage)
- **Milestone Driven**: Focus on the overarching project steps.
- **Documentation**: Provide clear references and code snippets if needed.
