import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        signOut();
        navigate("/");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  if (loading) return <div className="text-center mt-10">🔄 Завантаження...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Вітаю, {user.email}</p>
      <p className="mt-2">
        <strong>Ваші ролі:</strong>{" "}
        {user.roles?.length > 0 ? user.roles.join(", ") : "Немає ролей"}
      </p>

      {user.roles?.includes("admin") && (
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