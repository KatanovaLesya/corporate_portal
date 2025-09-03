import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import api from "../services/api";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});

  // --- функція завантаження клієнтів ---
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients", {
        params: {
          page,
          limit: PAGE_SIZE,
          ...filters, // фільтри йдуть у бекенд
        },
      });
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

  // --- генератори опцій для колонок ---
  const loadStacks = async (inputValue) => {
    try {
      const res = await api.get("/stacks", { params: { q: inputValue } });
      return res.data.map((s) => ({ value: s.name, label: s.name }));
    } catch (err) {
      console.error("Помилка завантаження стеків", err);
      return [];
    }
  };

  const loadClientNames = async (inputValue) => {
    try {
      const res = await api.get("/clients", { params: { name: inputValue, limit: 20 } });
      return res.data.rows.map((c) => ({ value: c.name, label: c.name }));
    } catch {
      return [];
    }
  };

  const loadEdrpou = async (inputValue) => {
    try {
      const res = await api.get("/clients", { params: { edrpou: inputValue, limit: 20 } });
      return res.data.rows.map((c) => ({ value: c.edrpou, label: c.edrpou }));
    } catch {
      return [];
    }
  };

  const loadDeals = async (inputValue) => {
    try {
      const res = await api.get("/deals", { params: { title: inputValue, limit: 20 } });
      return res.data.map((d) => ({ value: d.title, label: d.title }));
    } catch {
      return [];
    }
  };

  const loadCurrencies = async (inputValue) => {
    try {
      const res = await api.get("/currencies", { params: { q: inputValue } });
      return res.data.map((c) => ({ value: c.code, label: c.code }));
    } catch {
      return [];
    }
  };

  // --- обробник змін фільтра ---
  const handleFilterChange = (field, option) => {
    setPage(1); // скидати на першу сторінку
    setFilters((prev) => ({
      ...prev,
      [field]: option ? option.value : undefined,
    }));
  };

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadStacks}
                onChange={(opt) => handleFilterChange("stack", opt)}
                placeholder="Пошук..."
                isClearable
              />
            </th>
            <th>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadClientNames}
                onChange={(opt) => handleFilterChange("name", opt)}
                placeholder="Пошук..."
                isClearable
              />
            </th>
            <th>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadEdrpou}
                onChange={(opt) => handleFilterChange("edrpou", opt)}
                placeholder="Пошук..."
                isClearable
              />
            </th>
            <th>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadDeals}
                onChange={(opt) => handleFilterChange("deal", opt)}
                placeholder="Пошук..."
                isClearable
              />
            </th>
            <th>Дата угоди</th>
            <th>Сума</th>
            <th>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCurrencies}
                onChange={(opt) => handleFilterChange("currency", opt)}
                placeholder="Пошук..."
                isClearable
              />
            </th>
            <th>Еквівалент в UAH</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8}>Завантаження...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={8}>Немає даних</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{r.stack || "-"}</td>
                <td>{r.name}</td>
                <td>{r.edrpou}</td>
                <td>{r.dealTitle || "-"}</td>
                <td>{r.startDate || "-"}</td>
                <td>{r.amount || "-"}</td>
                <td>{r.currency || "-"}</td>
                <td>{r.amountUah || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* пагінація */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Назад
        </button>
        <span>
          {page} / {Math.ceil(total / PAGE_SIZE)}
        </span>
        <button
          disabled={page >= Math.ceil(total / PAGE_SIZE)}
          onClick={() => setPage((p) => p + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
