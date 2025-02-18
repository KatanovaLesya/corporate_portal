
import PropTypes from "prop-types"; // Додаємо валідацію пропсів

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
        setUser(currentUser);
      } catch (error) {
        console.error("Помилка отримання користувача:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Завантаження...</p>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};




// 📌 Додаємо валідацію пропсів (щоб ESLint не лаявся)
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
