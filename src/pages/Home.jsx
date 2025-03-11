
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { signInWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      console.log("🔄 Оновлення сесії перед перевіркою...");
      
      // Оновлюємо сесію та чекаємо завершення процесу
      const { data: refreshedSession, error } = await supabase.auth.refreshSession();
      if (error) console.error("❌ Помилка оновлення сесії:", error.message);
      
      console.log("🟢 Сесія після оновлення:", refreshedSession);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("✅ Користувач знайдений, редірект на /dashboard");
        navigate("/dashboard");
      }
    };

    checkAuthState();

    // Створюємо слухача змін сесії
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Зміна стану авторизації: ${event}`, session);
      if (session) {
        console.log("✅ Сесія активна, редіректимо на /dashboard...");
        navigate("/dashboard");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
      console.log("📴 Слухач авторизації відключений");
    };
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
