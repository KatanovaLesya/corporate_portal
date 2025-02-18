import { supabase } from "../supabaseClient";

// 📌 Отримання всіх користувачів
export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// 📌 Отримання користувача за його ID
export const getUserById = async (id) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};
