import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Замініть URL на свій API!
    fetch("/api/profile", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Не вдалося отримати профіль");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Помилка");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;
  if (!user) return <div>Профіль не знайдено</div>;

  return (
    <div className={styles["profile-page"]}>
      <h2>Профіль користувача</h2>
      <img
        src={user.avatarURL || "/default-avatar.png"}
        alt={user.name}
        className={styles["user-info__avatar"]}
        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%" }}
      />
      <div><strong>Імʼя:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Відділ:</strong> {user.department || "Не вказано"}</div>
      <div><strong>Telegram:</strong> {user.telegram || "Не вказано"}</div>
      <div><strong>Телефон:</strong> {user.phone || "Не вказано"}</div>
    </div>
  );
};

export default ProfilePage;
