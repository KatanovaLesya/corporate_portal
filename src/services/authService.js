import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🟢 Вхід через Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/dashboard",
    },
  });

  if (error) {
    console.error("Помилка входу через Google:", error);
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
