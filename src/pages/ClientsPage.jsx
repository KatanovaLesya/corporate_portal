// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  const [stacks, setStacks] = useState([]);
  const [filters, setFilters] = useState({
    stack: "",
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
  });

  const [loading, setLoading] = useState(false);

  // --- завантаження клієнтів ---
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

      const data = res.data;
      setClients(data.rows || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів –", err);
    } finally {
      setLoading(false);
    }
  };

  // --- завантаження стеків ---
  const fetchStacks = async () => {
    try {
      const res = await api.get("/stacks");

      // якщо бекенд повертає {rows: [...]}, дістаємо rows
      const stacksData = Array.isArray(res.data)
        ? res.data
        : res.data?.rows || [];

      setStacks(stacksData);
    } catch (err) {
      console.error("Помилка завантаження стеків –", err);
      setStacks([]); // fallback
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  useEffect(() => {
    fetchStacks();
  }, []);

  const handleFilterChange = (field, value) => {
    setPage(1); // повертаємо на першу сторінку при фільтрації
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

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
                isClearable
                placeholder="Пошук..."
                options={stacks.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                onChange={(opt) =>
                  handleFilterChange("stack", opt ? opt.value : "")
                }
              />
            </th>
            <th>
              Назва
              <input
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("name", e.target.value)
                }
              />
            </th>
            <th>
              ЄДРПОУ
              <input
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("edrpou", e.target.value)
                }
              />
            </th>
            <th>
              Назва угоди
              <input
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("dealTitle", e.target.value)
                }
              />
            </th>
            <th>
              Дата угоди
              <input
                type="date"
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </th>
            <th>
              Сума
              <input
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("amount", e.target.value)
                }
              />
            </th>
            <th>
              Валюта
              <input
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("currency", e.target.value)
                }
              />
            </th>
            <th>Еквівалент в UAH</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
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
                    (d.amount || 0).toLocaleString("uk-UA", {
                      style: "currency",
                      currency: "UAH",
                    })
                  )
                  .join(", ") || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Пагінація --- */}
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Назад
        </button>
        <span>
          {page} / {Math.ceil(count / PAGE_SIZE) || 1}
        </span>
        <button
          disabled={page >= Math.ceil(count / PAGE_SIZE)}
          onClick={() => setPage((p) => p + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
