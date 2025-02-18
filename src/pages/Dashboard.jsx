import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate("/login");
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Помилка отримання користувача:", error);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    return <p>Завантаження...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Вітаю, {user.email}</p>
      <button onClick={handleLogout}>Вийти</button>
    </div>
  );
};

export default Dashboard;
