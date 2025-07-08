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
  params: Promise<{ id: string }>
}

export default function LessonsPage({ params }: PageProps) {
  const [courseId, setCourseId] = useState<number | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Resolve dynamic route param
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      const id = parseInt(resolved.id, 10)
      setCourseId(id)
    }

    resolveParams()
  }, [params])

  // Fetch lessons
  useEffect(() => {
    if (!courseId) return

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)

      if (error) {
        console.error('Error fetching lessons:', error)
      } else {
        setLessons(data || [])
      }

      setLoading(false)
    }

    fetchLessons()
  }, [courseId, supabase])

  if (loading) return <p>Lade Lektionen...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lektionen für Kurs {courseId}</h1>
      {/* Show lessons here */}
      <Link href="/dashboard" className="text-blue-500 underline">
        ← Zurück zum Dashboard
      </Link>
    </div>
  )
}

