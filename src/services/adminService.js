import api from "./api";

// Отримати всіх користувачів
export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// Отримати всі ролі
export const getRoles = async () => {
  const { data } = await api.get("/roles");
  return data;
};

// Додати роль користувачу
export const addUserRole = async (userId, roleName) => {
  const { data } = await api.post(`/users/${userId}/roles`, { roleName });
  return data;
};

// Видалити роль у користувача
export const removeUserRole = async (userId, roleName) => {
  const { data } = await api.delete(`/users/${userId}/roles`, { data: { roleName } });
  return data;
};
