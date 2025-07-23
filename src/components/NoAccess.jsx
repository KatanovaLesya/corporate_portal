import { useEffect } from "react";
import styles from "../pages/Home.module.css"; // styles — для уніфікації імені імпорту

const NoAccess = () => {
  useEffect(() => {
    console.warn("❌ Користувач не має доступу. Потрібно звернутися до адміністратора.");
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Доступ обмежено</h1>
      <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
        Ви ще не маєте доступу до корпоративного порталу.<br />
        Будь ласка, зверніться до адміністратора.
      </p>

      {/* Контакти адміністраторів */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1rem", gap: "0.75rem" }}>
        <a
          href="https://t.me/Dmytro_Kalinin_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Дмитро Калінін
        </a>

        <a
          href="https://t.me/Chernega_Katerina_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Катерина Чернега
        </a>

        <a
          href="https://t.me/Katanova_Lesya_Solvensy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Леся Катанова
        </a>
      </div>
    </div>
  );
};

export default NoAccess;
