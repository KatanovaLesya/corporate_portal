import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/authService";
import styles from "./Dashboard.module.css"; 
import AdminPanel from "../components/AdminPanel";;

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
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* USER INFO TOP RIGHT */}
      <div className={styles["user-info-top-right"]}>
        <img src={user.avatarURL} alt={user.name} className={styles["user-info__avatar"]} />
        <div>
          <span className={styles["user-info__name"]}>{user.name}</span>
          <div className={styles["user-info__email"]}>{user.email}</div>
          <div className={styles["user-info__roles"]}>{user.roles && user.roles.length > 0 ? user.roles.join(", ") : "Немає ролей"}</div>
        </div>
        <button className={styles["logout-btn"]} onClick={handleLogout}>LOG OUT</button>
      </div>
      {user.roles && user.roles.includes("admin") && (
  <AdminPanel />
)}
      
      
    </div>
  );
};

export default Dashboard;
