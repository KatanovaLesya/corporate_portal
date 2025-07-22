
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Зберігаємо токен, якщо прийшли після Google OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  if (token) {
    localStorage.setItem("token", token);
    // Прибрати токен із URL, щоб не дублікувався при рефреші:
    window.history.replaceState({}, document.title, "/");
  }

  // 2. Перевіряємо user 
    const checkUser = async () => {
  // щоб запускалася сторінка без токіна
      if (!token) {
      setChecking(false);
      return;
    }

      const user = await getCurrentUser();
      if (user) {
        if (!user.roles || user.roles.length === 0 || (user.roles.length === 1 && user.roles[0] === "guest")) {
          navigate("/no-access");
        } else {
          navigate("/dashboard");
      }

        return;
      }
      setChecking(false);
    };
    checkUser();
  }, [navigate]);

  const signInWithGoogle = () => {
    window.location.href = "https://back-corp-portal.onrender.com/api/auth/google";
  };

  if (checking) return <div>Завантаження...</div>;


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Corporate Portal</h1>
      <p>Sign in to access your dashboard.</p>
      <button className={styles.button} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Home;