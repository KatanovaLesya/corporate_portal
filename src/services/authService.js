import api from "./api";

// Отримати поточного користувача
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("USER FROM API:", res.data);
    return res.data;
  } catch (err) {
    console.log("ERROR getCurrentUser:", err);
    return null;
  }
};

// Вийти (logout)
export const signOut = () => {
  localStorage.removeItem("token");
};