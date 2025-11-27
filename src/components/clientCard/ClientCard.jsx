import { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./ClientCard.module.css";

import HeaderSection from "./HeaderSection";
import ContactsSection from "./ContactsSection";
import ChatsSection from "./ChatsSection";
import DealsSection from "./DealsSection";
import WorkVolumesSection from "./WorkVolumesSection";
import TurnoverControlSection from "./TurnoverControlSection";
import BalancesSection from "./BalancesSection";
import UnitEconomicsSection from "./UnitEconomicsSection";
import PropTypes from "prop-types";


export default function ClientCard({ onClientChange }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 завантажуємо список клієнтів при старті
  useEffect(() => {
  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      // Перевіримо, що саме приходить
      console.log("API /clients →", res.data);
      setClients(res.data.rows || []);
    } catch (error) {
      console.error("Помилка при завантаженні клієнтів", error);
      setClients([]); // щоб не ламався .map
    }
  };

  fetchClients();
}, []);

  // 🔹 коли обрали клієнта — тягнемо його деталі
  useEffect(() => {
    if (!selectedClientId) {
      setClientData(null);
      return;
    }

    const fetchClientDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("➡️ Запит деталей клієнта:", selectedClientId);
        const res = await api.get(`/clients/${selectedClientId}`);
        console.log("✅ Відповідь клієнта:", res.data);
        setClientData(res.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити дані клієнта.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [selectedClientId]);

  // 🔹 коли змінився клієнт — передаємо його назву наверх
  useEffect(() => {
    if (clientData && onClientChange) {
      onClientChange(clientData.name || "");
    }
  }, [clientData, onClientChange]);

  ClientCard.propTypes = {
  onClientChange: PropTypes.func,
};


  return (
    <div className={styles.cardWrapper}>
      <HeaderSection
        clients={clients}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        clientData={clientData}
      />

      {/* 🔹 стани */}
      {loading && <p className={styles.loading}>Завантаження даних...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* 🔹 секції клієнта */}
      {!loading && clientData && (
        <>
          <ContactsSection client={clientData} />
          <ChatsSection client={clientData} />
          <DealsSection client={clientData} />
          <WorkVolumesSection client={clientData} />
          <TurnoverControlSection client={clientData} />
          <BalancesSection client={clientData} />
          <UnitEconomicsSection client={clientData} />
        </>
      )}

      {/* 🔹 коли клієнт ще не обраний */}
      {!selectedClientId && !loading && (
        <p className={styles.placeholder}>Оберіть клієнта зі списку вище, щоб переглянути деталі.</p>
      )}
    </div>
  );
}
