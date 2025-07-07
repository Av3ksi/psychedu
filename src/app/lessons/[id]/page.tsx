'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Lesson = {
  id: number;
  title: string;
  description?: string;
};

export default function LessonsPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id, 10);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId);

      if (error) {
        console.error('Error fetching lessons:', error);
      } else {
        setLessons(data);
      }

      setLoading(false);
    };

    fetchLessons();
  }, [courseId, supabase]); // Or just [courseId]

  if (loading) return <p>Lade Lektionen...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lektionen für Kurs {courseId}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{lesson.title}</h2>
            <p className="text-sm text-gray-600">{lesson.description || 'Keine Beschreibung'}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="text-blue-500 underline">
          ← Zurück zum Dashboard
        </Link>
      </div>
    </div>
  );
}