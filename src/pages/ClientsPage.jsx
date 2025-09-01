import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // фільтри для бекенду
  const [filters, setFilters] = useState({
    stack: null,
    clientName: null,
    edrpou: null,
    dealTitle: null,
    startDate: null,
    amount: null,
    currency: null,
    amountUah: null,
  });

  // ===== Завантаження даних з бекенду =====
  const fetchClients = async () => {
    try {
      setLoading(true);

      // будуємо query-параметри
      const params = {
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      };

      if (filters.stack) params.stack = filters.stack;
      if (filters.clientName) params.name = filters.clientName;
      if (filters.edrpou) params.edrpou = filters.edrpou;
      if (filters.dealTitle) params.dealTitle = filters.dealTitle;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.amount) params.amount = filters.amount;
      if (filters.currency) params.currency = filters.currency;

      const res = await api.get("/clients", { params });

      console.log("API /clients:", res.data);

      // бекенд повертає { count, rows }
      setRows(res.data.rows || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  const handleFilterChange = (col, option) => {
    setFilters((prev) => ({ ...prev, [col]: option ? option.value : null }));
    setPage(1); // скидати на першу сторінку при зміні фільтру
  };

  // поки для демо — беремо значення з поточної сторінки
  const getOptions = (col) => {
    const unique = [...new Set(rows.map((r) => r[col] || "-"))];
    return unique.map((v) => ({ value: v, label: v }));
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Клієнти</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Стек</th>
            <th>Назва</th>
            <th>ЄДРПОУ</th>
            <th>Назва угоди</th>
            <th>Дата угоди</th>
            <th>Сума</th>
            <th>Валюта</th>
            <th>Еквівалент в UAH</th>
          </tr>
          <tr>
            {Object.keys(filters).map((col) => (
              <th key={col}>
                <Select
                  options={getOptions(col)}
                  isClearable
                  placeholder="Пошук..."
                  value={filters[col] ? { value: filters[col], label: filters[col] } : null}
                  onChange={(opt) => handleFilterChange(col, opt)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.stack || "-"}</td>
              <td>{r.clientName || r.name}</td>
              <td>{r.edrpou}</td>
              <td>{r.dealTitle || (r.deals?.[0]?.title ?? "-")}</td>
              <td>{r.startDate || (r.deals?.[0]?.start_date ?? "-")}</td>
              <td>{r.amount || (r.deals?.[0]?.amount ?? "-")}</td>
              <td>{r.currency || (r.deals?.[0]?.currency ?? "-")}</td>
              <td>{r.amountUah || r.amount || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Назад
        </button>
        <span>
          {page} / {Math.ceil(total / PAGE_SIZE) || 1}
        </span>
        <button
          onClick={() => setPage((p) => (p < Math.ceil(total / PAGE_SIZE) ? p + 1 : p))}
          disabled={page >= Math.ceil(total / PAGE_SIZE)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
