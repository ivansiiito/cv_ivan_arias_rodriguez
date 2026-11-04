"use client";

import { useEffect, useState, type CSSProperties } from "react";

export function JourneyQuestions({ questions }: { questions: string[] }) {
  const [order, setOrder] = useState(questions);

  useEffect(() => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
  }, [questions]);

  return <div className="journey-questions" aria-hidden="true">
    {order.map((question, index) => {
      const x = (index * 37 + 17) % 101;
      const y = (index * 61 + 29) % 101;
      const angle = ((index * 137 + 41) % 360) * Math.PI / 180;
      const style = {
        animationDuration: `${order.length * 4}s`,
        animationDelay: `${index * 4}s`,
        "--question-x": `${10 + x * .42}%`,
        "--question-y": `${12 + y * .65}%`,
        "--drift-x": `${Math.cos(angle) * 8}px`,
        "--drift-y": `${Math.sin(angle) * 8}px`,
      } as CSSProperties;
      return <span key={question} style={style}>{question}</span>;
    })}
  </div>;
}
