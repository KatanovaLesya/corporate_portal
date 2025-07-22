import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../services/authService";
import styles from "./Dashboard.module.css"; 
import { modules } from "../config/modulesConfig";
import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfo";


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
      <UserInfo user={user} onLogout={handleLogout} />
      <div className={styles.modulesSection}>
          <h2>Мої модулі</h2>
          <div className={styles.modulesGrid}>
            {modules
              .filter(m => user.roles.some(role => m.roles.includes(role)))
              .map(m => (
                <Link to={m.path} key={m.path} className={styles.moduleTile}>
                  <span className={styles.moduleIcon}>{m.icon}</span>
                  <span>{m.name}</span>
                </Link>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
