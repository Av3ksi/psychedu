'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

type Course = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase: SupabaseClient = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndCourses = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/');
        return;
      }

      setSession(session);

      const { data: courseData, error } = await supabase.from('courses').select('*');

      if (error) {
        console.error('Fehler beim Abrufen der Kurse:', error);
      } else if (courseData) {
        setCourses(courseData);
      }

      setLoading(false);
    };

    getSessionAndCourses();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-xl text-gray-600">Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition">
          MeinDashboard
        </Link>
        {session && (
          <div className="text-gray-700 font-medium">
            {session.user.email}
          </div>
        )}
      </nav>

      {/* Inhalt */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Willkommen im Dashboard</h1>
          <p className="mt-4 text-xl text-gray-600">Deine verfügbaren Kurse</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={course.image_url}
                  alt={`Bild für den Kurs ${course.title}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-x-4">
          <Link
            href="/lessons"
            className="inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Zu den Lektionen
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
