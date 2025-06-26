'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock } from 'lucide-react';

const lessons = [
  { title: 'Warum studiert man Psychologie?', href: '/lessons/1', locked: false },
  { title: 'Gesundheitspsychologie', href: '/lessons/2', locked: true },
  { title: 'Klinische Psychologie', href: '/lessons/3', locked: true },
  { title: 'Biologische Psychologie', href: '/lessons/4', locked: true },
  // ...weitere Lektionen
];

export default function LessonsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/');
      } else {
        setIsLoggedIn(true);
      }
    });
  }, [supabase, router]);

  if (!isLoggedIn) {
    return null; // Verhindert Flackern
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Psychologie Lektionen</h1>
        <p className="text-gray-600">Starte mit der ersten Lektion – weitere sind bald freigeschaltet.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {lessons.map((lesson, i) => (
          <div
            key={i}
            className={`p-6 rounded-lg shadow-md transition-all duration-300 ${
              lesson.locked ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:-translate-y-1'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-lg font-semibold ${lesson.locked ? 'text-gray-500' : 'text-gray-800'}`}>
                {lesson.title}
              </span>
              {lesson.locked && <Lock className="w-5 h-5 text-gray-500" />}
            </div>
            {!lesson.locked && (
              <a
                href={lesson.href}
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                Lektion öffnen →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
