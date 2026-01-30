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

export default function ClientCard({ onClientChange, initialClientData }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientData, setClientData] = useState(initialClientData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 завантажуємо список клієнтів при старті
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        console.log("API /clients →", res.data);
        setClients(res.data.rows || []);
      } catch (error) {
        console.error("Помилка при завантаженні клієнтів", error);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  // 🔹 якщо є initialClientData (наприклад, із /client-card/:id) або id з URL
  useEffect(() => {
    if (initialClientData) {
      setClientData(initialClientData);
      setSelectedClientId(initialClientData.id);
    } else if (window.location.pathname.startsWith("/client-card/")) {
      // якщо даних ще немає, але є id у URL — витягуємо його з адреси
      const idFromUrl = window.location.pathname.split("/").pop();
      if (idFromUrl) {
        setSelectedClientId(idFromUrl);
      }
    }
  }, [initialClientData]);

const fetchClientDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("➡️ Запит деталей клієнта:", selectedClientId);
        const res = await api.get(`/clients/${selectedClientId}`);
        console.log("✅ Відповідь клієнта:", res.data);
        console.log("📞 Контакти клієнта:", res.data.contacts);
        setClientData(res.data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити дані клієнта.");
      } finally {
        setLoading(false);
      }
    };
  // 🔹 коли обрали клієнта вручну — тягнемо його деталі
  useEffect(() => {
    if (!selectedClientId) {
      setClientData(null);
      return;
    }

    // якщо вже маємо дані (наприклад, із initialClientData), не перезапитуємо
    if (initialClientData && initialClientData.id === selectedClientId) return;

    fetchClientDetails();
  }, [selectedClientId, initialClientData]);

  // 🔹 коли змінився клієнт — передаємо його назву наверх
  useEffect(() => {
    if (clientData && onClientChange) {
      onClientChange(clientData.name || "");
    }
  }, [clientData, onClientChange]);

  ClientCard.propTypes = {
    onClientChange: PropTypes.func,
    initialClientData: PropTypes.object,
  };

  return (
    <div className={styles.cardWrapper}>
      <HeaderSection
        clients={clients}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        clientData={clientData}
      />

      {loading && <p className={styles.loading}>Завантаження даних...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && clientData && (
        <>
          <ContactsSection
            client={clientData}
            onRefreshClient={fetchClientDetails}
          />

          <ChatsSection client={clientData} />
          <DealsSection client={clientData} />
          <WorkVolumesSection client={clientData} />
          <TurnoverControlSection client={clientData} />
          <BalancesSection client={clientData} />
          <UnitEconomicsSection client={clientData} />
        </>
      )}

      {!selectedClientId && !loading && !initialClientData && (
        <p className={styles.placeholder}>
          Оберіть клієнта зі списку вище, щоб переглянути деталі.
        </p>
      )}
    </div>
  );
}
