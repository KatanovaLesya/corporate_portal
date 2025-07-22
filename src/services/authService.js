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

// Оновити Telegram або телефон
export const patchProfile = async (fields) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found!");
  return api.patch("/users/me", fields, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Оновити аватар
export const uploadAvatar = async (file) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found!");
  const formData = new FormData();
  formData.append("avatar", file);
  return api.post("/users/me/avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
