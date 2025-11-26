import api from "./api";

// Отримати всі параметри або за роком
export const getNormatives = async (year = null) => {
  const url = year ? `/normatives?year=${year}` : "/normatives";
  const { data } = await api.get(url);
  return data;
};

// Створити новий параметр
export const createNormative = async (normativeData) => {
  const { data } = await api.post("/normatives", normativeData);
  return data;
};

// Оновити параметр
export const updateNormative = async (id, normativeData) => {
  const { data } = await api.put(`/normatives/${id}`, normativeData);
  return data;
};

// Видалити параметр
export const deleteNormative = async (id) => {
  await api.delete(`/normatives/${id}`);
};
