import api from "./api";

// Отримати поточного користувача (user)
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // res.data має бути або { ...userFields }
    // або якщо бекенд повертає { user: { ... } }, то return res.data.user;
    // Якщо res.data містить саме user, як у PATCH-відповіді:
    if (res.data.user) {
      return res.data.user;
    }
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

// Оновити Telegram, телефон, department і одразу повернути нового юзера!
export const patchProfile = async (fields) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found!");
  // PATCH повертає { message, user }
  const res = await api.patch("/users/me", fields, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // відразу повертаємо user:
  return res.data.user;
};

// Оновити аватарку і повернути user (оновлений)!
export const uploadAvatar = async (file) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found!");
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.post("/users/me/avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  // Якщо PATCH повертає тільки avatarURL, зроби окремий getCurrentUser після цього.
  return res.data.avatarURL;
};
