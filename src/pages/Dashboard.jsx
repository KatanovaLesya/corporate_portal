import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Додаємо стан завантаження
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("🟢 Отриманий користувач:", currentUser);

        if (!currentUser) {
          console.warn("❌ Користувач не знайдений, повернення на головну");
          navigate("/");
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("❌ Помилка отримання користувача:", error);
      } finally {
        setLoading(false); // Завершуємо завантаження
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Показуємо завантаження, поки отримуємо користувача
  if (loading) {
    return <div className="text-center mt-10">🔄 Завантаження...</div>;
  }

  // Якщо користувач не знайдений, повертаємо null (редірект уже зроблено)
  if (!user) return null;

  console.log("🏠 Dashboard рендериться!");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Вітаю, {user.email}</p>
      <button
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
        onClick={handleLogout}
      >
        Вийти
      </button>
    </div>
  );
};

export default Dashboard;
