import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔹 Фільтри
  const [filters, setFilters] = useState({
    stack: null,
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
  });

  const [stacks, setStacks] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  // === Завантаження клієнтів ===
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients", {
        params: {
          page,
          limit: PAGE_SIZE,
          stack: filters.stack?.value || "",
          name: filters.name || "",
          edrpou: filters.edrpou || "",
          dealTitle: filters.dealTitle || "",
          startDate: filters.startDate || "",
          amount: filters.amount || "",
          currency: filters.currency || "",
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

  // === Завантаження стеків ===
  const fetchStacks = async () => {
    try {
      const res = await api.get("/stacks");
      const stacksArray = Array.isArray(res.data)
        ? res.data
        : res.data.rows || [];

      const options = stacksArray.map((s) => ({
        value: s.id,
        label: s.name,
      }));
      setStacks(options);
    } catch (err) {
      console.error("Помилка завантаження стеків:", err);
    }
  };

  // === Завантаження валют ===
  const fetchCurrencies = async () => {
    try {
      const res = await api.get("/currencies");
      const currencyArray = Array.isArray(res.data)
        ? res.data
        : res.data.rows || [];

      const options = currencyArray.map((c) => ({
        value: c.code,
        label: c.code,
      }));
      setCurrencies(options);
    } catch (err) {
      console.error("Помилка завантаження валют:", err);
    }
  };

  // === Виклики ===
  useEffect(() => {
    fetchStacks();
    fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  // === Хендлери ===
  const handleFilterChange = (field, value) => {
    setPage(1); // 🔹 Завжди повертатись на першу сторінку при зміні фільтра
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // === Розрахунок сторінок ===
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.wrapper}>
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
                    value={filters.stack}
                    onChange={(v) => handleFilterChange("stack", v)}
                    isClearable
                    placeholder="Пошук..."
                  />
                </th>
                <th>
                  Назва
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) =>
                      handleFilterChange("name", e.target.value)
                    }
                    placeholder="Пошук..."
                  />
                </th>
                <th>
                  ЄДРПОУ
                  <input
                    type="text"
                    value={filters.edrpou}
                    onChange={(e) =>
                      handleFilterChange("edrpou", e.target.value)
                    }
                    placeholder="Пошук..."
                  />
                </th>
                <th>
                  Назва угоди
                  <input
                    type="text"
                    value={filters.dealTitle}
                    onChange={(e) =>
                      handleFilterChange("dealTitle", e.target.value)
                    }
                    placeholder="Пошук..."
                  />
                </th>
                <th>
                  Дата угоди
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </th>
                <th>
                  Сума
                  <input
                    type="number"
                    value={filters.amount}
                    onChange={(e) =>
                      handleFilterChange("amount", e.target.value)
                    }
                    placeholder="Пошук..."
                  />
                </th>
                <th>
                  Валюта
                  <Select
                    options={currencies}
                    value={filters.currency}
                    onChange={(v) => handleFilterChange("currency", v?.value)}
                    isClearable
                    placeholder="Пошук..."
                  />
                </th>
                <th>Еквівалент в UAH</th>
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
                    <td>
                      {c.deals
                        ?.map((d) =>
                          d.currency === "UAH"
                            ? d.amount
                            : Math.round(d.amount * 1) // тимчасово курс 1:1
                        )
                        .join(", ") || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Дані відсутні</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Пагінація */}
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Назад
            </button>
            <span>
              {page} / {totalPages}
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
