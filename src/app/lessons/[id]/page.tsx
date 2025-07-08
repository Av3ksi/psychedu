'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Lesson = {
  id: number
  title: string
  description?: string | null
}

type PageProps = {
  params: { id: string }
}

export default function LessonsPage({ params }: PageProps) {
  const courseId = parseInt(params.id, 10)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)

      if (error) {
        console.error('Fehler beim Laden der Lektionen:', error)
      } else {
        setLessons(data || [])
      }

      setLoading(false)
    }

    fetchLessons()
  }, [courseId, supabase])

  if (loading) return <p className="p-8">Lade Lektionen...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lektionen für Kurs {courseId}</h1>
      
      {lessons.length === 0 && <p>Keine Lektionen gefunden.</p>}

      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold">{lesson.title}</h2>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </li>
        ))}
      </ul>

      <Link href="/dashboard" className="text-blue-500 underline block mt-8">
        ← Zurück zum Dashboard
      </Link>
    </div>
  )
}
