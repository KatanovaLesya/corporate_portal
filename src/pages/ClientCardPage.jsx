import ClientCard from "../components/clientCard/ClientCard";
import styles from "./ClientCardPage.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ClientCardPage() {
  const [selectedClientName, setSelectedClientName] = useState("");
  const [initialClientData, setInitialClientData] = useState(null);
  const { id } = useParams(); // <-- додаємо підтримку clientId з URL

  // Якщо сторінка відкрита за посиланням типу /client-card/123
  useEffect(() => {
    if (!id) return; // якщо id немає — просто чекаємо ручного вибору
    const fetchClient = async () => {
      try {
        const res = await api.get(`/clients/${id}`);
        setInitialClientData(res.data);
        setSelectedClientName(res.data.name);
      } catch (err) {
        console.error("Помилка завантаження клієнта:", err);
      }
    };
    fetchClient();
  }, [id]);

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>
        {selectedClientName || "Картка клієнта"}
      </h1>

      <ClientCard
        onClientChange={(name) => setSelectedClientName(name)}
        initialClientData={initialClientData} // <-- передаємо стартові дані, якщо є
      />
    </div>
  );
}
