'use client'; // WICHTIG! Diese Zeile muss ganz oben stehen. Sie macht die Seite interaktiv.

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Importiert unseren Supabase client
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { Session } from '@supabase/supabase-js';

export default function Home() {
  // In diesem 'State' speichern wir die Informationen zum eingeloggten Nutzer.
  const [session, setSession] = useState<Session | null>(null);

  // Dieser `useEffect` Hook läuft einmal, wenn die Seite geladen wird.
  // Er holt die aktuelle User-Session und lauscht auf zukünftige Änderungen (Login/Logout).
  useEffect(() => {
    // Holen der aktuellen Session beim Laden der Seite
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Lauschen auf Änderungen des Authentifizierungs-Status
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Aufräumen des Listeners, wenn die Komponente verlassen wird
    return () => subscription.unsubscribe();
  }, []);


  // Die handleLogout Funktion, die den Nutzer ausloggt.
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Setzt die Session manuell zurück, um die UI sofort zu aktualisieren
  };


  // Die Logik, was angezeigt wird:
  // WENN KEINE SESSION (niemand eingeloggt), zeige die Login-Box.
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
           <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Willkommen bei Psychedu</h1>
           {/* Dies ist die fertige UI-Komponente von Supabase */}
           <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']} // Optional: Social Logins hinzufügen
            theme="dark"
           />
        </div>
      </div>
    );
  }
  
  // WENN EINE SESSION EXISTIERT (jemand ist eingeloggt), zeige das Dashboard.
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