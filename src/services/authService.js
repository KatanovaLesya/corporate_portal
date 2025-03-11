import { supabase } from "../supabaseClient";

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    console.log("🟢 Успішно отримано користувача:", data.user);
    return data.user;
  } catch (error) {
    console.error("❌ Помилка отримання користувача:", error.message);
    return null;
  }
};

export const signInWithGoogle = async () => {
  try {
    const isLocalhost = window.location.hostname === "localhost";
    const redirectTo = isLocalhost
      ? "http://localhost:5173/dashboard"
      : "https://corporate-portal-rho.vercel.app/dashboard";

    console.log(`🔄 Авторизація через Google, редірект на: ${redirectTo}`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) throw error;
    console.log("🟢 Авторизація через Google успішна");
  } catch (error) {
    console.error("❌ Помилка авторизації:", error.message);
    alert("❌ Помилка входу: " + error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("🔴 Користувач вийшов");
  } catch (error) {
    console.error("❌ Помилка виходу:", error.message);
  }
};

export const refreshSession = async () => {
  try {
    console.log("🔄 Оновлення сесії...");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    console.log("🟢 Сесію оновлено успішно", data);
    return data;
  } catch (error) {
    console.error("❌ Помилка оновлення сесії:", error.message);
    return null;
  }
};
