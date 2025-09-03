// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

// розмір сторінки
const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    stackId: null,
    clientName: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
  });

  // ---- завантаження клієнтів ----
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients", {
        params: {
          page,
          limit: PAGE_SIZE,
          ...filters,
        },
      });

      setClients(res.data.rows || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- завантаження стеків ----
  const fetchStacks = async () => {
    try {
      const res = await api.get("/stacks");
      const options = res.data.map((s) => ({ value: s.id, label: s.name }));
      setStacks(options);
    } catch (err) {
      console.error("Помилка завантаження стеків:", err);
    }
  };

  // при першому завантаженні
  useEffect(() => {
    fetchStacks();
  }, []);

  // при зміні сторінки або фільтрів
  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  // ---- хендлери ----
  const handleFilterChange = (field, value) => {
    setPage(1); // повертаємось на 1 сторінку при фільтрації
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  Стек
                  <Select
                    options={stacks}
                    value={stacks.find((s) => s.value === filters.stackId) || null}
                    onChange={(val) => handleFilterChange("stackId", val ? val.value : null)}
                    placeholder="Пошук..."
                    isClearable
                  />
                </th>
                <th>
                  Назва
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.clientName}
                    onChange={(e) => handleFilterChange("clientName", e.target.value)}
                  />
                </th>
                <th>
                  ЄДРПОУ
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.edrpou}
                    onChange={(e) => handleFilterChange("edrpou", e.target.value)}
                  />
                </th>
                <th>
                  Назва угоди
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.dealTitle}
                    onChange={(e) => handleFilterChange("dealTitle", e.target.value)}
                  />
                </th>
                <th>
                  Дата угоди
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  />
                </th>
                <th>
                  Сума
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.amount}
                    onChange={(e) => handleFilterChange("amount", e.target.value)}
                  />
                </th>
                <th>
                  Валюта
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.currency}
                    onChange={(e) => handleFilterChange("currency", e.target.value)}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                    <td>{c.name}</td>
                    <td>{c.edrpou}</td>
                    <td>{c.deals?.map((d) => d.title).join(", ") || "-"}</td>
                    <td>{c.deals?.map((d) => d.start_date).join(", ") || "-"}</td>
                    <td>{c.deals?.map((d) => d.amount).join(", ") || "-"}</td>
                    <td>{c.deals?.map((d) => d.currency).join(", ") || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Немає даних</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ---- Пагінація ---- */}
          <div className={styles.pagination}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Назад
            </button>
            <span>
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsPage;
