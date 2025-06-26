'use client';

import { useState } from 'react';

export default function LessonPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctAnswer = 'B';

  const handleAnswer = (option: string) => {
    setSelected(option);
    setSubmitted(true);
  };

  const getButtonClass = (option: string) => {
    if (!submitted) return 'border-gray-300 hover:bg-gray-50';
    if (selected === option) {
      return option === correctAnswer
        ? 'border-green-500 bg-green-100'
        : 'border-red-500 bg-red-100';
    }
    return 'border-gray-300';
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 sm:px-12 lg:px-48">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Warum Psychologie studieren?</h1>
      <p className="text-lg text-gray-700 mb-6">
        Psychologie ist die Wissenschaft vom Erleben und Verhalten des Menschen.
        Sie hilft uns zu verstehen, warum Menschen so handeln, wie sie es tun —
        in Beziehungen, in der Arbeit oder im Alltag.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        Durch ein Psychologie-Studium lernst du, wie das Gehirn arbeitet,
        wie man Menschen in Krisen helfen kann oder Organisationen besser gestaltet.
      </p>

      <hr className="my-10" />

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quiz: Was beschreibt die Psychologie am besten?</h2>

      <div className="space-y-4">
        {['A', 'B', 'C'].map((option) => {
          const text =
            option === 'A'
              ? 'Die Lehre vom Körperbau des Menschen'
              : option === 'B'
              ? 'Die Wissenschaft vom Verhalten und Erleben'
              : 'Die Kunst der Gesprächsführung';

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`block w-full text-left px-4 py-3 rounded-lg border ${getButtonClass(option)}`}
            >
              {option}) {text}
            </button>
          );
        })}
      </div>

      {submitted && selected !== correctAnswer && (
        <p className="mt-6 text-red-600 font-medium">
          Nicht ganz! Die richtige Antwort ist <strong>B</strong>: Psychologie ist die Wissenschaft vom Verhalten und Erleben.
        </p>
      )}

      {submitted && selected === correctAnswer && (
        <p className="mt-6 text-green-600 font-medium">Richtig! 🎉</p>
      )}
    </div>
  );
}
