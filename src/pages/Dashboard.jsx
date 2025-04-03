import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../services/authService";
import { getUserRoles } from "../services/roleService"; // ✅ Підключаємо отримання ролей
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("🟢 Отриманий користувач:", currentUser);

        if (!currentUser) {
          console.warn("❌ Користувач не знайдений, повернення на головну");
          navigate("/");
          return;
        }

        setUser(currentUser);

        // Отримуємо ролі
        const userRoles = await getUserRoles(currentUser.id);
        setRoles(userRoles);
      } catch (error) {
        console.error("❌ Помилка отримання користувача або ролей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRoles();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="text-center mt-10">🔄 Завантаження...</div>;
  }

  if (!user) return null;

  console.log("🏠 Dashboard рендериться!");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Вітаю, {user.email}</p>
      <p className="mt-2">
        <strong>Ваші ролі:</strong>{" "}
        {roles.length > 0 ? roles.join(", ") : "Немає ролей"}
      </p>

      {roles.includes("admin") && (
        <div className="mt-4 p-4 bg-gray-200 rounded">
          <h2 className="text-lg font-semibold">🔑 Панель адміністратора</h2>
          <p>Тут буде функціонал для керування користувачами.</p>
        </div>
      )}

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