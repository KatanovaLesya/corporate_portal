
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { signInWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"

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
    <div className={styles.container}>
      <h1 className={styles.title}>Corporate Portal</h1>
      <p>Sign in to access your dashboard.</p>
      <button
        className={styles.button}
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Home;
