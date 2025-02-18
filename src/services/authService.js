import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🟢 Вхід через Google
export const signInWithGoogle = async () => {
  const redirectTo =
    import.meta.env.MODE === "development"
      ? "http://localhost:5173/dashboard"
      : "https://corporate-portal-rho.vercel.app/dashboard";

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("❌ Помилка авторизації:", error);
    alert("❌ Помилка входу: " + error.message);
  }
};


// 🔵 Отримати поточного користувача
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Помилка отримання користувача:", error);
    return null;
  }
  return data.user;
};

// 🔴 Вийти з аккаунту
export const signOut = async () => {
  await supabase.auth.signOut();
};
