import { supabase } from '../supabaseClient';

export const getUserRoles = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_roles') // Звертаємось до таблиці user_roles
      .select('role_id') // Отримуємо role_id
      .eq('user_id', userId); // Фільтр по user_id

    if (error) throw error;

    console.log("🟢 Отримані ролі:", data); // Виводимо для перевірки

    return data.map(role => role.role_id); // Повертаємо список ролей
  } catch (error) {
    console.error("❌ Помилка отримання ролей користувача:", error.message);
    return [];
  }
};