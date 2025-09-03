// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Фільтри
  const [filters, setFilters] = useState({
    stack: "",
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
    amountUah: ""
  });

  const [stacks, setStacks] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  // --- Завантажуємо клієнтів ---
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients", {
        params: {
          page,
          limit: PAGE_SIZE,
          ...filters
        }
      });
      setClients(res.data.rows || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Завантажуємо стеки ---
  const fetchStacks = async () => {
    try {
      const res = await api.get("/stacks");
      setStacks(res.data.map(s => ({ value: s.name, label: s.name })));
    } catch (err) {
      console.error("Помилка завантаження стеків", err);
    }
  };

  // --- Завантажуємо валюти ---
  const fetchCurrencies = async () => {
    try {
      const res = await api.get("/currencies");
      setCurrencies(res.data.map(c => ({ value: c.code, label: c.code })));
    } catch (err) {
      console.error("Помилка завантаження валют", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  useEffect(() => {
    fetchStacks();
    fetchCurrencies();
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>

      {/* Таблиця */}
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                Стек
                <Select
                  options={stacks}
                  isClearable
                  placeholder="Пошук..."
                  onChange={(opt) =>
                    setFilters({ ...filters, stack: opt ? opt.value : "" })
                  }
                />
              </th>
              <th>
                Назва
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </th>
              <th>
                ЄДРПОУ
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={filters.edrpou}
                  onChange={(e) =>
                    setFilters({ ...filters, edrpou: e.target.value })
                  }
                />
              </th>
              <th>
                Назва угоди
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={filters.dealTitle}
                  onChange={(e) =>
                    setFilters({ ...filters, dealTitle: e.target.value })
                  }
                />
              </th>
              <th>
                Дата угоди
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </th>
              <th>
                Сума
                <input
                  type="number"
                  placeholder="Пошук..."
                  value={filters.amount}
                  onChange={(e) =>
                    setFilters({ ...filters, amount: e.target.value })
                  }
                />
              </th>
              <th>
                Валюта
                <Select
                  options={currencies}
                  isClearable
                  placeholder="Пошук..."
                  onChange={(opt) =>
                    setFilters({ ...filters, currency: opt ? opt.value : "" })
                  }
                />
              </th>
              <th>
                Еквівалент в UAH
                <input
                  type="number"
                  placeholder="Пошук..."
                  value={filters.amountUah}
                  onChange={(e) =>
                    setFilters({ ...filters, amountUah: e.target.value })
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="8">Немає даних</td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                  <td>{c.name}</td>
                  <td>{c.edrpou}</td>
                  <td>
                    {c.deals?.map((d) => d.title).join(", ") || "-"}
                  </td>
                  <td>
                    {c.deals?.map((d) => d.start_date).join(", ") || "-"}
                  </td>
                  <td>
                    {c.deals?.map((d) => d.amount).join(", ") || "-"}
                  </td>
                  <td>
                    {c.deals?.map((d) => d.currency).join(", ") || "-"}
                  </td>
                  <td>
                    {c.deals
                      ?.map((d) => d.amount) // тут поки 1:1 як ти казала
                      .join(", ") || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Пагінація */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
