import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BackToDashboardButton.module.css";
import { TextAlignJustify } from "lucide-react";

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
      <TextAlignJustify size={22} strokeWidth={2} />
      <span>Дашборд</span>
    </button>
  );
}
