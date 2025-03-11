import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("🟢 Перевірка користувача в ProtectedRoute:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error("❌ Помилка отримання користувача:", error);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>🔄 Завантаження...</p>;
  
  if (!user) {
    console.warn("❌ Доступ заборонено, повернення на головну");
    return <Navigate to="/" />;
  }
  

  return <Outlet />;
};

export default ProtectedRoute;
