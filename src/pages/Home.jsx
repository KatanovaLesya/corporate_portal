
import { useEffect } from "react";

import { supabase } from '../supabaseClient';
import { signInWithGoogle } from '../services/authService';

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      console.log("🔄 Оновлення сесії перед перевіркою...");
      await supabase.auth.refreshSession(); // 🔥 Примусово оновлюємо сесію

      const { data: { session } } = await supabase.auth.getSession();
      console.log("🟢 Перевірка сесії після оновлення:", session);
      if (session) {
        navigate("/dashboard");
      }
    };

    checkAuthState();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Auth state changed: ${event}`, session);
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Corporate Portal</h1>
      <p>Sign in to access your dashboard.</p>
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Home;

