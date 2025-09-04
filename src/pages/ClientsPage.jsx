// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- фільтри ---
  const [filters, setFilters] = useState({
    stack: "",
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
    amountUah: "",
  });

  // --- завантаження клієнтів з бекенду ---
  async function fetchClients() {
    try {
      setLoading(true);

      const res = await api.get("/clients", {
        params: {
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
          ...filters,
        },
      });

      setRows(res.data.rows || []);
      setCount(res.data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  // --- обробник зміни фільтра ---
  const handleFilterChange = (key, value) => {
    setPage(1); // завжди починаємо з 1-ї сторінки
    setFilters((prev) => ({
      ...prev,
      [key]: value || "",
    }));
  };

  // --- кількість сторінок ---
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div>
      <h2>Клієнти</h2>

      {loading && <p>Завантаження...</p>}

      <table>
        <thead>
          <tr>
            <th>
                Стек
                <Select
                    options={stackOptions}
                    value={filters.stack ? { value: filters.stack, label: filters.stack } : null}
                    onChange={(selected) =>
                    setFilters({ ...filters, stack: selected ? selected.value : "" })
                    }
                    isClearable
                    placeholder="Пошук..."
                />
            </th>
            <th>
              Назва
              <input
                placeholder="Пошук..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </th>
            <th>
              ЄДРПОУ
              <input
                placeholder="Пошук..."
                value={filters.edrpou}
                onChange={(e) => handleFilterChange("edrpou", e.target.value)}
              />
            </th>
            <th>
              Назва угоди
              <input
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
                placeholder="Пошук..."
                value={filters.amount}
                onChange={(e) => handleFilterChange("amount", e.target.value)}
              />
            </th>
            <th>
                Валюта
                <Select
                    options={[...new Set(rows.map((r) => r.currency))].map((c) => ({
                    value: c,
                    label: c,
                    }))}
                    onChange={(opt) => handleFilterChange("currency", opt?.value)}
                    isClearable
                />
            </th>
            <th>
              Еквівалент в UAH
              <input
                placeholder="Пошук..."
                value={filters.amountUah}
                onChange={(e) => handleFilterChange("amountUah", e.target.value)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.stacks && row.stacks.length > 0 ? row.stacks.map((s) => s.name).join(", ") : "-"}</td>
              <td>{row.name}</td>
              <td>{row.edrpou}</td>
              <td>{row.dealTitle || "-"}</td>
              <td>{row.startDate || "-"}</td>
              <td>{row.amount || "-"}</td>
              <td>{row.currency || "-"}</td>
              <td>{row.amountUah || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- пагінація --- */}
      <div style={{ marginTop: "10px" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Вперед
        </button>
      </div>
    </div>
  );
}
