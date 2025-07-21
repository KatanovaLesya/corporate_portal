import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>🔄 Завантаження...</p>;

  if (!user) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
