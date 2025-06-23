import { redirect } from 'next/navigation';
// === HIER IST DIE FINALE KORREKTUR: Wir benutzen den robusten Pfad-Alias ===
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

// Wir definieren einen "Typ" für unsere Kursdaten. Das hilft, Fehler zu vermeiden.
type Course = {
  id: number;
  title: string;
  description: string;
  image_url: string;
};

export default async function DashboardPage() {
  const supabase = createClient();

  // Prüfen, ob der Nutzer eingeloggt ist (sicherere Methode)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }

  // --- HIER IST DER NEUE TEIL: KURSE AUS DER DATENBANK HOLEN ---
  const { data: courses, error } = await supabase
    .from('courses') // Wähle die Tabelle 'courses'
    .select('*');   // Wähle alle Spalten aus

  if (error) {
    console.error('Fehler beim Abrufen der Kurse:', error);
  }
  // --- ENDE DES NEUEN TEILS ---

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Willkommen im Dashboard</h1>
            <p className="mt-4 text-xl text-gray-600">Deine verfügbaren Kurse:</p>
            <p className="mt-1 text-sm text-gray-500 font-mono">{user.email}</p>
        </div>

        {/* Hier zeigen wir die Kurse an */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course: Course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <img src={course.image_url} alt={`Bild für den Kurs ${course.title}`} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
            <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                Zurück zur Startseite
            </a>
        </div>
      </div>
    </div>
  );
}