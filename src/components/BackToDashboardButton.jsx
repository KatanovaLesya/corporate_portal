import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react"; // Можеш замінити на будь-яку іконку
import styles from "./BackToDashboardButton.module.css";

export default function BackToDashboardButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // ❌ Ховаємо кнопку, якщо користувач уже на Dashboard
  if (location.pathname === "/dashboard") return null;

  return (
    <button
      className={styles.backButton}
      onClick={() => navigate("/dashboard")}
      title="Повернутися на Дашборд"
    >
      <Home size={18} />
      <span>Дашборд</span>
    </button>
  );
}
