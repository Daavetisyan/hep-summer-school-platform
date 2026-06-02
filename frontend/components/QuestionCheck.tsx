"use client";

import { useState } from "react";

export type CheckQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function QuestionCheck({ questions }: { questions: CheckQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const score = questions.filter((question, index) => answers[index] === question.answer).length;

  return (
    <section className="lesson-card question-card">
      <p className="eyebrow">Knowledge check</p>
      <h2>Check your understanding</h2>
      <div className="question-list">
        {questions.map((question, index) => (
          <label key={question.prompt}>
            <strong>{index + 1}. {question.prompt}</strong>
            <select value={answers[index] || ""} onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })}>
              <option value="">Choose an answer</option>
              {question.options.map((option) => <option key={option}>{option}</option>)}
            </select>
            {checked && <small className={answers[index] === question.answer ? "answer-correct" : "answer-wrong"}>{question.explanation}</small>}
          </label>
        ))}
      </div>
      <button className="button primary" onClick={() => setChecked(true)} type="button">Check my answers</button>
      {checked && <p className="private-result">Your private result: {score} / {questions.length} correct.</p>}
    </section>
  );
}
