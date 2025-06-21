// Ein kleiner Kommentar, um einen neuen Build zu erzwingen
'use client'; 

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client'; // Importiert unsere neue Client-Funktion
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { Session, SupabaseClient } from '@supabase/supabase-js';


export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  // Wir erstellen den Client jetzt direkt in der Komponente
  const supabase: SupabaseClient = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
           <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Willkommen bei Psychedu</h1>
           <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']} 
            theme="dark"
           />
        </div>
      </div>
    );
  }
  else {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center p-4">
            <div className="bg-white p-10 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hallo!</h1>
                <p className="text-gray-700 mb-4">Du bist eingeloggt als:</p>
                <p className="text-blue-600 font-semibold mb-6 break-all">{session.user.email}</p>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                    Ausloggen
                </button>
            </div>
        </div>
    );
  }
}